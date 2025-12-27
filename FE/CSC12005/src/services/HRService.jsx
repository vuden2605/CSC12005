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
      const response = await api.get(`/activities/${activityId}`, { params });
      console.log("detail activity", response.data.data);
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

      const response = await api.post("/employees/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
  getAllSalaries: async (filter, params) => {
    try {
      const response = await api.post(`/salaries/search`, filter, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("salaries:",response.data.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching salaries";
      console.error("Error fetching salaries:", errMsg);
      throw new Error(errMsg);
    }
  },
  createPayroll: async (month, year) => {
  try {
    const response = await api.post(
      "/salaries",
      {
        month,
        year,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.message ||
      "Error creating payroll";
    console.error("Error creating payroll:", errMsg);
    throw new Error(errMsg);
  }
},
paySalary: async (month, year) => {
    try {
      const response = await api.post(
        `/salaries/pay`,
        null, 
        {
          params: { month, year },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error paying salary";

      console.error("Pay salary error:", errMsg);
      throw new Error(errMsg);
    }
  },

};
