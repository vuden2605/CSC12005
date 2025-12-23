import api from "../api/axios";
import { markAsRead } from "../redux/slices/notificationSlice";
export const NotificationService = {
    getNotifications: async (page, size, sortBy, direction) => {
        try {
            const response = await api.get('/notifications', {
                params: { page, size, sortBy, direction },
            });
            console.log("Fetched notifications:", response.data);
            return response.data.data.content;
        } catch (error) {
            console.log(error);
        }
    },
    markAsRead: async (notificationId, dispatch) => {
        try {
            await api.put(`/notifications/${notificationId}/read`);
            dispatch(markAsRead(notificationId));
        } catch (error) {
            console.log(error);
        }
    },
    unreadCount: async () => {
        try {
            const response = await api.get('/notifications/unread/count');
            return response.data.data;
        } catch (error) {
            console.log(error);
        }
    },
};