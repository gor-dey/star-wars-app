import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";

export function Notification() {
  const { message, type } = useNotificationStore((state) => state.notification);
  const closeNotification = useNotificationStore(
    (state) => state.closeNotification
  );

  useEffect(() => {
    if (message) {
      const timer = setTimeout(closeNotification, 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
