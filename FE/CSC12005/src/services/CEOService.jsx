import api from "../api/axios";

export const CEOService = {
  // Lấy thống kê tổng quan công ty
  getCompanyStats: async () => {
    try {
      const response = await api.get(`/ceo/stats`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching company stats";
      console.error("Error fetching company stats:", errMsg);
      throw new Error(errMsg);
    }
  },

  // Lấy số lượng nhân viên theo phòng ban
  getEmployeesByDepartment: async () => {
    try {
      const response = await api.get(`/ceo/employees-by-department`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching employees by department";
      console.error("Error fetching employees by department:", errMsg);
      throw new Error(errMsg);
    }
  },

  // Lấy tổng quan dự án
  getProjectOverview: async () => {
    try {
      const response = await api.get(`/ceo/project-overview`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching project overview";
      console.error("Error fetching project overview:", errMsg);
      throw new Error(errMsg);
    }
  },

  // Lấy thống kê hoạt động công ty
  getActivityStats: async () => {
    try {
      const response = await api.get(`/ceo/activity-stats`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching activity stats";
      console.error("Error fetching activity stats:", errMsg);
      throw new Error(errMsg);
    }
  },
};
