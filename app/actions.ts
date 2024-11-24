'use server';
 
import webpush from 'web-push';
 
webpush.setVapidDetails(
  'mailto:marcoscachis@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);
 
let subscription: any = null;
 
export async function subscribeUser(sub:any) {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}
 
export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}
 
export async function sendNotification(message : any, title = 'Test Notification', sub : any) {
  message = typeof message === 'string' ? message : 'Test Notification';
  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: title,
        body: message,
        icon: '/icon.png',
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}