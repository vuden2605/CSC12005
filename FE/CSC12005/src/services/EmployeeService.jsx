import api from "../api/axios";

export const EmployeeService = {
  // Download file from S3
  downloadFile: async (fileKey) => {
    try {
      const response = await api.get(`/s3/download`, {
        params: { key: fileKey },
      });
      if (response.data.code === 9999 && response.data.data) {
        return response.data.data; // Return presigned URL
      }
      throw new Error("Failed to get download URL");
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error downloading file";
      console.error("Error downloading file:", errMsg);
      throw new Error(errMsg);
    }
  },

  // getEmployees: async () => {
  //   const response = await fetch(`${API_URL}/employees`);
  //   return response.json();
  // },
  // createEmployee: async (employee) => {
  //   const response = await fetch(`${API_URL}/employees`, {
  //     method: "POST",
  //     body: JSON.stringify(employee),
  //   });
  //   return response.json();
  // },
  // updateEmployee: async (employee) => {
  //   const response = await fetch(`${API_URL}/employees/${employee.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(employee),
  //   });
  //   return response.json();
  // },
  // deleteEmployee: async (id) => {
  //   const response = await fetch(`${API_URL}/employees/${id}`, {
  //     method: "DELETE",
  //   });
  //   return response.json();
  // },

  getCurrentUser: async () => {
    try {
      const response = await api.get(`/employees/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching current user";
      console.error("Error fetching current user:", errMsg);
      throw new Error(errMsg);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.patch(`/employees`, profileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error updating profile";
      console.error("Error updating profile:", errMsg);
      throw new Error(errMsg);
    }
  },

  createRequest: async (requestData, requestType) => {
    const formData = new FormData();
    formData.append("requestType", requestType);
  
    Object.entries(requestData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
  
    const response = await api.post("/requests", formData);
    return response.data.data;
  },
  
  

  getRequests: async (params = {}) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      
      // Sorting
      if (params.direction) queryParams.append("direction", params.direction);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      
      // Date filters
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      
      // Request type filter
      if (params.requestType) queryParams.append("requestType", params.requestType);
      
      // Request status filter
      if (params.requeststatus) queryParams.append("requeststatus", params.requeststatus);

      const queryString = queryParams.toString();
      const url = `/requests/me${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching requests";
      console.error("Error fetching requests:", errMsg);
      throw new Error(errMsg);
    }
  },

  getActivities: async (params = {}) => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Activity name filter
      if (params.activityName) queryParams.append("activityName", params.activityName);
      
      // Date filters
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
      
      // Pagination
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      
      // Sorting
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.direction) queryParams.append("direction", params.direction);

      const queryString = queryParams.toString();
      const url = `/activities${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching activities";
      console.error("Error fetching activities:", errMsg);
      throw new Error(errMsg);
    }
  },

  registerActivity: async (activityId) => {
    try {
      const response = await api.post(`/activities/${activityId}/details`, {});
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error registering activity";
      console.error("Error registering activity:", errMsg);
      throw new Error(errMsg);
    }
  },

  getAttendanceHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.startDate) queryParams.append("fromDate", params.startDate);
      if (params.endDate) queryParams.append("toDate", params.endDate);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.direction) queryParams.append("direction", params.direction);

      const queryString = queryParams.toString();
      const url = `/timesheets/my${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching attendance history";
      console.error("Error fetching attendance history:", errMsg);
      throw new Error(errMsg);
    }
  },

  getRequestDetail: async (requestId, requestType) => {
    try {
      const response = await api.get(`/requests/${requestId}`, {
        params: { requestType }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        "Error fetching request detail"
      );
    }
  },

  getMyPointHistories: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.direction) queryParams.append("direction", params.direction);

      const queryString = queryParams.toString();
      const url = `/point-histories/me${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error fetching point histories";
      console.error("Error fetching point histories:", errMsg);
      throw new Error(errMsg);
    }
  },
  // Lấy yêu cầu đổi điểm của nhân viên (giống HR nhưng không dùng /all)
  getMyPointExchangeRequests: async (params = {}) => {
    try {
      const response = await api.get(
        `/point-exchanges`,
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
        "Error fetching my point exchange requests";
      console.error("Error fetching my point exchange requests:", errMsg);
      throw new Error(errMsg);
    }
  },

  // Tạo yêu cầu đổi điểm
  createPointExchangeRequest: async (points, note) => {
    try {
      const payload = { points };
      if (note) payload.note = note;
      const response = await api.post(
        "/point-exchanges",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error creating point exchange request";
      console.error("Error creating point exchange request:", errMsg);
      throw new Error(errMsg);
    }
  }
};
