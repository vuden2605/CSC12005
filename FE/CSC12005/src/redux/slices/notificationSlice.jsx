import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      state.push(action.payload);
    },
    removeNotification: (state, action) =>
      state.filter((n) => n.id !== action.payload),
    clearNotifications: () => [],
    markAsRead: (state, action) => {
      const notif = state.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
  },
});

export const { addNotification, removeNotification, clearNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
