import api from "../api/axios";

export const EmployeeService = {
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

  createWFHRequest: async (wfhData) => {
    try {
      // Tạo FormData để gửi file multipart
      const formData = new FormData();
      
      // Thêm file nếu có
      if (wfhData.file) {
        formData.append("file", wfhData.file);
      }
      
      // Thêm các trường khác
      formData.append("reason", wfhData.reason || "");
      formData.append("startDate", wfhData.startDate || "");
      formData.append("endDate", wfhData.endDate || "");

      // Không truyền headers config - axios sẽ tự động detect FormData và set Content-Type với boundary phù hợp
      const response = await api.post(`/wfh-requests`, formData);
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error creating WFH request";
      console.error("Error creating WFH request:", errMsg);
      throw new Error(errMsg);
    }
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

  createTimesheetRequest: async (timesheetData) => {
    try {
      // Nếu timesheetData là FormData, gửi trực tiếp (axios sẽ tự động xử lý)
      // Nếu không, wrap vào FormData
      let requestData = timesheetData;
      if (!(timesheetData instanceof FormData)) {
        requestData = new FormData();
        Object.keys(timesheetData).forEach(key => {
          requestData.append(key, timesheetData[key]);
        });
      }

      const response = await api.post(`/timesheet-requests`, requestData);
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error creating timesheet request";
      console.error("Error creating timesheet request:", errMsg);
      throw new Error(errMsg);
    }
  },

  createLeaveRequest: async (leaveData) => {
    try {
      // Nếu leaveData là FormData, gửi trực tiếp
      // Nếu không, wrap vào FormData
      let requestData = leaveData;
      if (!(leaveData instanceof FormData)) {
        requestData = new FormData();
        Object.keys(leaveData).forEach(key => {
          requestData.append(key, leaveData[key]);
        });
      }

      const response = await api.post(`/leave-requests`, requestData);
      return response.data.data || response.data;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || "Error creating leave request";
      console.error("Error creating leave request:", errMsg);
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
  }
};
