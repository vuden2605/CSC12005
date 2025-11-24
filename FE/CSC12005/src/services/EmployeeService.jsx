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
};
