import api from "../api/axios";

export const HRService = {


   getAllEmp: async () => {
    try {
      const response = await api.get(`/employees`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching all emp";
      console.error("Error fetching all emp:", errMsg);
      throw new Error(errMsg);
    }
  },
  
};
