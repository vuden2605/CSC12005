import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { store } from "../redux";
import { addNotification, setUnreadCount } from "../redux/slices/notificationSlice";

class StompService {
  client = null;

  connect(accessToken) {
    if (this.client && this.client.active) {
      console.log("STOMP already active");
      return;
    }
  
    this.client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/api/ws?token=${accessToken}`),
  
      reconnectDelay: 5000, // ✅ tự reconnect
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
  
      debug: (str) => console.log(str),
  
      onConnect: () => {
        console.log("✅ STOMP connected");
  
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
        });
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
        });
      },
  
      onWebSocketClose: () => {
        console.warn("⚠️ WebSocket closed, will auto-reconnect...");
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