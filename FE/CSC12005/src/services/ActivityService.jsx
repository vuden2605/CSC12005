import api from "../api/axios";

export const ActivityService = {
    getActivities: async (params = {}) => {
        try {
            const response = await api.get('/activities', { params });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    createActivity: async (activityData) => {
        try {
            const response = await api.post('/activities', activityData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    updateActivity: async (activityId, updateData) => {
        try {
            const response = await api.patch(`/activities/${activityId}`, updateData);
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    getActivityParticipants: async (activityId, params = {}) => {
        try {
            const response = await api.get(`/activities/${activityId}`, { params });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    createActivityDetail: async (activityId) => {
        try {
            const response = await api.post(`/activities/${activityId}/details`);
            return response.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    importActivityResult: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/activities/import-result', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },

    cancelActivity: async (activityId) => {
        try {
            const response = await api.patch(`/activities/cancel/${activityId}`);
            return response.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    }
};
