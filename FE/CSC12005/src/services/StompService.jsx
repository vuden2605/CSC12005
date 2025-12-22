import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

class StompService {
  client = null;

  connect(accessToken) {
    if (this.client?.connected) {
      console.log("STOMP already connected");
      return;
    }

    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/api/ws?token=${accessToken}`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),

      onConnect: () => {
        console.log("✅ STOMP connected");

        // 🔥 SUBSCRIBE USER QUEUE
        this.client.subscribe("/user/queue/notifications", (msg) => {
          const data = JSON.parse(msg.body);
          console.log("📩 Notification:", data);
          // dispatch redux / toast / badge count
        });
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error", frame);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
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
    }
  }
}

export const stompService = new StompService();
