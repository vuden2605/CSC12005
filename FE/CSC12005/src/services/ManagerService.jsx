import api from "../api/axios";

export const ManagerService = {
    getEmployeesByManager: async (managerId, page, size, sortBy, direction) => {
        try {
            const response = await api.get(
                `/employees/by-manager/${managerId}`,
                {
                    params: {
                        page,
                        size,
                        sortBy,
                        direction
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    getRequestsByManager: async (params) => {
        try {
            const response = await api.get(
                `/requests/by-manager`,
                {
                    params: {
                        ...params
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    approveLeaveRequest: async (requestId) => {
        try {
            const response = await api.put(
                `/leave-requests/${requestId}/approve`
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    rejectLeaveRequest: async (requestId) => {
        try {
            const response = await api.put(
                `/leave-requests/${requestId}/reject`
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    approveWFHRequest: async (requestId) => {
        try {
            const response = await api.put(
                `/wfh-requests/${requestId}/approve`
            );
            return response.data.data;
        }
    
        catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    rejectWFHRequest: async (requestId) => {
        try {
            const response = await api.put(
                `/wfh-requests/${requestId}/reject`
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    
};