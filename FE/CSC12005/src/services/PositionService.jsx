import api from "../api/axios";

export const PositionService = {
  getByDepartmentId: async (departmentId) => {
    try {
      const res = await api.get(`/positions/${departmentId}`);
      return res.data?.data ?? [];
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching positions";
      console.error("Error fetching positions:", errMsg);
      throw new Error(errMsg);
    }
  },
};