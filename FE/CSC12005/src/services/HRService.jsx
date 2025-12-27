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
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching all emp";
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
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error creating employee";
      console.error("Error creating employee:", errMsg);

      throw new Error(errMsg);
    }
  },
  updateEmp: async (employeeId, employeeData) => {
    try {
      const response = await api.patch(
        `/employees/${employeeId}`,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error updating employee";
      console.error("Error updating employee:", errMsg);
      throw new Error(errMsg);
    }
  },
  UpdateStatusEmp: async (employeeId) => {
    try {
      const response = await api.patch(
        `/employees/status/${employeeId}`,
        {
          status: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error disabling employee";
      console.error("Error disabling employee:", errMsg);
      throw new Error(errMsg);
    }
  },
  UpdateActivity: async (activityId, requestData) => {
    try {
      const response = await api.patch(
        `activities/${activityId}`,
        requestData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error disabling activity";
      console.error("Error disabling activity:", errMsg);
      throw new Error(errMsg);
    }
  },
  createActivity: async (requestData) => {
    try {
      const response = await api.post(
        `activities`,
        requestData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error disabling activity";
      console.error("Error disabling activity:", errMsg);
      throw new Error(errMsg);
    }
  },
  GetParticipantsByActivity: async (activityId, params) => {
    try {
      const response = await api.get(
        `/activities/${activityId}`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching participants";
      throw new Error(errMsg);
    }
  },
  importEmployees: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file); 
  
      const response = await api.post(
        "/employees/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error importing employees";
      console.error("Error importing employees:", errMsg);
      throw new Error(errMsg);
    }
  },
  getMonthlyCandidatesPoints: async () => {
    try {
      const response = await api.get(
        `/point-histories/monthly-candidates`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching monthly candidates points";
      console.error("Error fetching monthly candidates points:", errMsg);
      throw new Error(errMsg);
    }
  },
  grantMonthlyPoints: async (candidateIds) => {
    try {
      const response = await api.post(
        `/point-histories/monthly-grant`,
        { candidateIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error granting monthly points";
      console.error("Error granting monthly points:", errMsg);
      throw new Error(errMsg);
    }
  },
  getPointExchangeRequests: async (params = {}) => {
    try {
      const response = await api.get(
        `/point-exchanges/all`,
        {
          params,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching point exchange requests";
      console.error("Error fetching point exchange requests:", errMsg);
      throw new Error(errMsg);
    }
  },
  approvePointExchangeRequest: async (requestIds) => {
    try {
      const response = await api.put(
        `/point-exchanges/status`,
        {
          pointExchangeIds: Array.isArray(requestIds) ? requestIds : [requestIds],
          status: "APPROVED"
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error approving request";
      console.error("Error approving request:", errMsg);
      throw new Error(errMsg);
    }
  },
  completePointExchangeRequest: async (requestIds) => {
    try {
      const response = await api.put(
        `/point-exchanges/status`,
        {
          pointExchangeIds: Array.isArray(requestIds) ? requestIds : [requestIds],
          status: "COMPLETED"
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error completing request";
      console.error("Error completing request:", errMsg);
      throw new Error(errMsg);
    }
  },
  rejectPointExchangeRequest: async (requestIds) => {
    try {
      const response = await api.put(
        `/point-exchanges/status`,
        {
          pointExchangeIds: Array.isArray(requestIds) ? requestIds : [requestIds],
          status: "REJECTED"
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error rejecting request";
      console.error("Error rejecting request:", errMsg);
      throw new Error(errMsg);
    }
  }

  

};
