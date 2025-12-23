import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    // Thêm một notification mới (từ WebSocket)
    addNotification: (state, action) => {
      const exists = state.list.find(n => n.id === action.payload.id);
      if (!exists) {
        // Thêm vào đầu danh sách
        state.list.unshift(action.payload);
        
        // Chỉ tăng unread count nếu notification chưa đọc
        if (!action.payload.read) {
          state.unreadCount += 1;
        }
      }
    },
    
    // Thêm nhiều notifications cùng lúc (từ API fetch)
    addNotifications: (state, action) => {
      const existingIds = new Set(state.list.map(n => n.id));
      const newNotifications = action.payload.filter(
        n => !existingIds.has(n.id)
      );
      
      // Thêm vào cuối danh sách
      state.list.push(...newNotifications);
      
      // KHÔNG tăng unread count ở đây vì đã có từ API
      // Chỉ tăng count khi nhận notification mới từ WebSocket
    },
    
    // Đánh dấu một notification là đã đọc
    markAsRead: (state, action) => {
      const notification = state.list.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Đánh dấu tất cả là đã đọc
    markAllAsRead: (state) => {
      state.list.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    
    // Set unread count từ API
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    
    // Xóa tất cả notifications
    clearNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    },
    
    // Xóa một notification
    removeNotification: (state, action) => {
      const notification = state.list.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.list = state.list.filter(n => n.id !== action.payload);
    },
    
    // Sync unread count từ server
    syncUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  }
});

export const {
  addNotification,
  addNotifications,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  clearNotifications,
  removeNotification,
  syncUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;