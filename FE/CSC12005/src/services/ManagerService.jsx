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
    
};
