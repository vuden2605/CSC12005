import api from "../api/axios";
export const ManagerService = {
    getEmployeesByManager: async (managerId) => {
        try {
            const response = await api.get(`/employee/by-manager/${managerId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message || "Error fetching employees by manager";
            console.error("Error fetching employees by manager:", errMsg);
            throw new Error(errMsg);
        }
    },
}
