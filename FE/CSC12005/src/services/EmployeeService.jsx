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
  }
};
