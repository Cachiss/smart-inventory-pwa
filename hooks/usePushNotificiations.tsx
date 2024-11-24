import { useContext } from "react";
import { PushNotificationContext } from "../components/pwa/PushNotificationsManager";

export const usePushNotifications = () => {
  const { sendNotification } = useContext(PushNotificationContext);
  return { sendNotification };
}