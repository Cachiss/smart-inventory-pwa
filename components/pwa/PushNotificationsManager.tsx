'use client'
 
import { useState, useEffect, createContext } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification as sendNoti } from '../../app/actions'

export const PushNotificationContext = createContext<{
  sendNotification: (message: string, title: string) => Promise<void>,
}>({
  sendNotification: () => Promise.resolve(),
})
 
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\\-/g, '+')
    .replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => console.log('scope is: ', registration.scope));
    }
  }, []);

  return null;
};

function PushNotificationManager({children}: {children: React.ReactNode}) {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
      null
    )
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
   
    useEffect(() => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        (async () => {
          setIsSupported(true);
          await registerServiceWorker();
          setLoading(false);
        })()
      }else{
        (async () => {
          await subscribeToPush(); 
          setLoading(false);
        })()
      }
    }, [])
   
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    }
   
    async function subscribeToPush() {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      setSubscription(sub)
      await subscribeUser(sub)
    }
   
    async function unsubscribeFromPush() {
      await subscription?.unsubscribe()
      setSubscription(null)
      await unsubscribeUser()
    }
   
    async function sendNotification(message: string, title:string) {
      if (subscription) {
        await sendNoti(message,title, subscription)
        setMessage('')
      }
    }
   
    if (loading) {
      return null;
    }
   
    return ( 
      <PushNotificationContext.Provider value={{ sendNotification}}>
        {children}
      </PushNotificationContext.Provider>
    )
  }

export default PushNotificationManager;

