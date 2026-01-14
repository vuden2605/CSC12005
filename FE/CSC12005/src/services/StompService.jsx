import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { store } from "../redux";
import { addNotification } from "../redux/slices/notificationSlice";

const API_URL = import.meta.env.VITE_API_BASE_URL;

class StompService {
  client = null;
  manualDisconnect = false;
  subscriptions = [];

  connect() {
    const token = localStorage.getItem("accessToken");

    // 🚫 Không có token → không connect
    if (!token) {
      console.warn("No accessToken, skip WS connect");
      return;
    }

    // 🔁 Reset flag khi login lại
    this.manualDisconnect = false;

    // ✅ Đã connected thì không connect lại
    if (this.client?.connected) {
      console.log("STOMP already connected");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => {
        // ⚠️ Guard thêm lần nữa
        const t = localStorage.getItem("accessToken");
        if (!t) return null;
        return new SockJS(`${API_URL}/ws?token=${t}`);
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      debug: (str) => console.log(str),

      onConnect: () => {
        console.log("✅ STOMP connected");

        // 🔥 Clear old subscriptions (tránh duplicate)
        this.subscriptions.forEach((s) => s.unsubscribe());
        this.subscriptions = [];

        // 🔔 User-specific notifications
        this.subscriptions.push(
          this.client.subscribe("/user/queue/notifications", (msg) => {
            const data = JSON.parse(msg.body);
            store.dispatch(
              addNotification({
                id: data.id ?? Date.now(),
                title: data.title,
                content: data.content,
                type: data.type,
                read: false,
                referenceId: data.referenceId,
                timestamp: data.createdAt,
              })
            );
          })
        );

        // 🔔 Global notifications
        this.subscriptions.push(
          this.client.subscribe("/topic/notifications", (msg) => {
            const data = JSON.parse(msg.body);
            store.dispatch(
              addNotification({
                id: data.id ?? Date.now(),
                title: data.title,
                content: data.content,
                type: data.type,
                read: false,
                referenceId: data.referenceId,
                timestamp: data.createdAt,
              })
            );
          })
        );
      },

      onWebSocketClose: () => {
        if (this.manualDisconnect) {
          console.log("🛑 WS closed manually (logout), no reconnect");
          return;
        }
        console.warn("⚠️ WS closed unexpectedly, will reconnect...");
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      console.log("Disconnecting STOMP...");
      this.manualDisconnect = true;

      // 🧹 Clean subscriptions
      this.subscriptions.forEach((s) => s.unsubscribe());
      this.subscriptions = [];

      this.client.deactivate();
      this.client = null;
    }
  }

  send(destination, payload) {
    if (this.client?.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("Cannot send message: STOMP not connected");
    }
  }

  isConnected() {
    return this.client?.connected || false;
  }
}

export const stompService = new StompService();
