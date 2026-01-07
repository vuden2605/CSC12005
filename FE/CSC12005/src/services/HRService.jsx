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
  // Tìm kiếm bảng lương (HR)
  // params: { status, month, year, employeeName, page, size, sortBy, direction }
  getAllSalaries: async (params = {}) => {
    try {
      const response = await api.get(`/salaries/search`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("salaries:", response.data.data);
      return response.data.data || response.data;
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
      const response = await api.post(`/salaries/pay`, null, {
        params: { month, year },
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Error paying salary";

      console.error("Pay salary error:", errMsg);
      throw new Error(errMsg);
    }
  },

  getMonthlyCandidatesPoints: async () => {
    try {
      const response = await api.get(`/point-histories/monthly-candidates`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      const response = await api.get(`/point-exchanges/all`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });
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
          pointExchangeIds: Array.isArray(requestIds)
            ? requestIds
            : [requestIds],
          status: "APPROVED",
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
          pointExchangeIds: Array.isArray(requestIds)
            ? requestIds
            : [requestIds],
          status: "COMPLETED",
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
          pointExchangeIds: Array.isArray(requestIds)
            ? requestIds
            : [requestIds],
          status: "REJECTED",
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
  },

  // Cập nhật trạng thái bảng lương (vd: APPROVED, PAID)
  updateSalaryStatus: async (salaryIds, status) => {
    try {
      const response = await api.post(
        `/salaries/update-status`,
        {
          salaryIds: Array.isArray(salaryIds) ? salaryIds : [salaryIds],
          status,
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
        "Error updating salary status";
      console.error("Error updating salary status:", errMsg);
      throw new Error(errMsg);
    }
  },

  // Lấy QR code thanh toán lương cho một bảng lương cụ thể
  getSalaryPaymentQr: async (salaryId) => {
    try {
      const response = await api.get(`/salaries/qr/${salaryId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // backend trả { code, message, data }, trong đó data là URL ảnh QR
      return response.data.data || response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching salary payment QR";
      console.error("Error fetching salary payment QR:", errMsg);
      throw new Error(errMsg);
    }
  },
  filterCandidates: async (filterRequest = {}, pageRequest = {}) => {
    try {
      // Build query params
      const params = {
        // Filter params
        ...(filterRequest.fullName && { fullName: filterRequest.fullName }),
        ...(filterRequest.email && { email: filterRequest.email }),
        ...(filterRequest.positionId && {
          positionId: filterRequest.positionId,
        }),
        ...(filterRequest.status && { status: filterRequest.status }),

        // Pagination params
        page: pageRequest.page ?? 0,
        size: pageRequest.size ?? 10,
        sortBy: pageRequest.sortBy ?? "createdAt",
        direction: pageRequest.direction ?? "DESC",
      };

      const response = await api.get(`/candidates`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Filtered candidates:", response);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error filtering candidates";
      console.error("Error filtering candidates:", errMsg);
      throw new Error(errMsg);
    }
  },
  createCandidate: async (candidateData) => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("fullName", candidateData.fullName);
      formData.append("email", candidateData.email);
      formData.append("gender", candidateData.gender);
      formData.append("phone", candidateData.phone);
      formData.append("address", candidateData.address);
      formData.append("birthDate", candidateData.birthDate); // Format:  YYYY-MM-DD
      formData.append("positionId", candidateData.positionId);

      // Append CV file if exists
      if (candidateData.cv) {
        formData.append("cv", candidateData.cv);
      }

      const response = await api.post(`/candidates`, formData, {
        headers: {},
      });

      console.log("Candidate created:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error creating candidate";
      console.error("Error creating candidate:", errMsg);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },

  updateCandidate: async (candidateId, candidateData) => {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("fullName", candidateData.fullName);
      formData.append("email", candidateData.email);
      formData.append("gender", candidateData.gender);
      formData.append("phone", candidateData.phone);
      formData.append("address", candidateData.address);
      formData.append("birthDate", candidateData.birthDate); // Format: YYYY-MM-DD
      formData.append("positionId", candidateData.positionId);

      // Append CV file if exists (only if user uploads new CV)
      if (candidateData.cv && candidateData.cv instanceof File) {
        formData.append("cv", candidateData.cv);
      }

      // Send PATCH request
      const response = await api.patch(`/candidates/${candidateId}`, formData, {
        headers: {
          // Don't set Content-Type, axios will auto-set with boundary
        },
      });

      console.log("Candidate updated:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error updating candidate";
      console.error("Error updating candidate:", errMsg);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },
  getCandidateById: async (candidateId) => {
    try {
      const response = await api.get(`/candidates/${candidateId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Fetched candidate:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching candidate";
      console.error("Error fetching candidate:", errMsg);
      throw new Error(errMsg);
    }
  },
  markInterviewResult: async (candidateId, passed) => {
    try {
      const response = await api.post(
        `/candidates/interview-result/${candidateId}`,
        null,
        {
          params: {
            passed: passed,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Interview result marked:", response.data);
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error marking interview result";
      console.error("Error marking interview result:", errMsg);
      throw new Error(errMsg);
    }
  },
  hireCandidate: async (candidateId) => {
    try {
      const response = await api.post(
        `/candidates/hire/${candidateId}`,
        null, // No body
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Candidate hired:", response.data);
      return response.data.data; // Return employee data
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error hiring candidate";
      console.error("Error hiring candidate:", errMsg);
      throw new Error(errMsg);
    }
  },
  //----------------schedule
  createSchedule: async (scheduleData) => {
    try {
      const response = await api.post(
        `/schedules`,
        {
          date: scheduleData.date, // Format: "YYYY-MM-DD"
          timeSlot: scheduleData.timeSlot, // "MORNING" | "AFTERNOON"
          location: scheduleData.location,
          positionId: scheduleData.positionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Schedule created:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error creating schedule";
      console.error("Error creating schedule:", errMsg);

      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },
  filterSchedules: async (filters = {}, pagination = {}) => {
    try {
      const params = {
        // Filter params
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.positionId && { positionId: filters.positionId }),
        ...(filters.timeSlot && { timeSlot: filters.timeSlot }),
        ...(filters.status && { status: filters.status }),
        ...(filters.location && { location: filters.location }),

        // Pagination params
        page: pagination.page ?? 0,
        size: pagination.size ?? 10,
        sortBy: pagination.sortBy ?? "date",
        direction: pagination.direction ?? "ASC",
      };

      const response = await api.get(`/schedules`, {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Filtered schedules:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error filtering schedules";
      console.error("Error filtering schedules:", errMsg);
      throw new Error(errMsg);
    }
  },
  updateSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.patch(
        `/schedules/${scheduleId}`,
        {
          date: scheduleData.date, // Format: "YYYY-MM-DD"
          timeSlot: scheduleData.timeSlot, // "MORNING" | "AFTERNOON" | "EVENING"
          location: scheduleData.location,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Schedule updated:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error updating schedule";
      console.error("Error updating schedule:", errMsg);

      // Parse validation errors if exists
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },
  getScheduleById: async (scheduleId) => {
    try {
      const response = await api.get(`/schedules/${scheduleId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Fetched schedule:", response.data);
      return response.data.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching schedule";
      console.error("Error fetching schedule:", errMsg);
      throw new Error(errMsg);
    }
  },
  cancelSchedule: async (scheduleId, reason) => {
    try {
      const response = await api.delete(`/schedules/${scheduleId}`, {
        data: { reason: reason },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Schedule cancelled:", response.data);
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error cancelling schedule";
      console.error("Error cancelling schedule:", errMsg);
      throw new Error(errMsg);
    }
  },
  getCandidatesByPosition: async (positionId) => {
    try {
      const response = await api.get(`/candidates/position/${positionId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `Fetched candidates for position ${positionId}:`,
        response.data
      );
      return response.data.data || [];
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error fetching candidates by position";
      console.error("Error fetching candidates by position:", errMsg);
      throw new Error(errMsg);
    }
  },
  addCandidatesToSchedule: async (scheduleId, candidateIds) => {
    try {
      const response = await api.post(
        `/schedules/add-candidates`,
        {
          scheduleId: scheduleId,
          candidateIds: candidateIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `✅ Added ${candidateIds.length} candidates to schedule ${scheduleId}`
      );
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error adding candidates to schedule";
      console.error("❌ Error adding candidates:", errMsg);

      // Parse validation errors if exists
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },
  removeCandidateFromSchedule: async (candidateId, reason) => {
    try {
      const response = await api.delete(
        `/schedules/candidates/${candidateId}`,
        {
          data: {
            reason: reason,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`✅ Removed candidate ${candidateId} from schedule`);
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Error removing candidate from schedule";
      console.error("❌ Error removing candidate:", errMsg);

      // Parse validation errors if exists
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        throw new Error(Object.values(validationErrors).join(", "));
      }

      throw new Error(errMsg);
    }
  },
};
