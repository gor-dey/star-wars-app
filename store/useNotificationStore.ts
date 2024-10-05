import { create } from "zustand";

interface Notification {
  message: string | null;
  type: "success" | "error";
}

interface NotificationStore {
  notification: Notification;
  setNotification: (notification: Notification) => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notification: {
    message: null,
    type: "success",
  },

  setNotification: (notification) =>
    set(() => ({
      notification,
    })),
  closeNotification: () =>
    set((state) => ({
      notification: {
        ...state.notification,
        message: null,
      },
    })),
}));
