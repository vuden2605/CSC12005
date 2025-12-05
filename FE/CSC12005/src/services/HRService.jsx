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
  createEmp: async (employeeData) => {
    try {
      const response = await api.post(`/employees`, employeeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data. data;
    } catch (error) {
      const errMsg = error. response?.data?.message || error. message || "Error creating employee";
      console.error("Error creating employee:", errMsg);
      
      throw new Error(errMsg);
    }
  },
  updateEmp: async (employeeId, employeeData) => {
    try {
      const response = await api.patch(`/employees/${employeeId}`, employeeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data. data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error updating employee";
      console.error("Error updating employee:", errMsg);
      throw new Error(errMsg);
    }
  },
    UpdateStatusEmp: async (employeeId) => {
    try {
      const response = await api. patch(`/employees/status/${employeeId}`, {
        status: false,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error disabling employee";
      console.error("Error disabling employee:", errMsg);
      throw new Error(errMsg);
    }
  },

};
