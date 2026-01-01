import api from "../api/axios";

export const ManagerService = {
    getEmployeesByManager: async (managerId, page, size, sortBy, direction) => {
        try {
            const response = await api.get(
                `/employees/by-manager/${managerId}`,
                {
                    params: {
                        page,
                        size,
                        sortBy,
                        direction
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    getProjectsByDepartment: async (departmentId, params = {}) => {
        try {
            const response = await api.get(`/projects/department/${departmentId}`, { params });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    getProjectsByManager: async (managerId, params = {}) => {
        try {
            const response = await api.get(`/projects/by-manager/${managerId}`,
            { params });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    getProjectMembers: async (projectId, params = {}) => {
        try {
            const response = await api.get(`/projects/${projectId}/members`, { params });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    addProjectMember: async (projectId, employeeId, role) => {
        try {
            const payload = { employeeId, role };
            const response = await api.post(`/projects/${projectId}/members`, payload, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    updateProjectMemberRole: async (projectId, employeeId, role) => {
        try {
            const payload = { role };
            const response = await api.put(`/projects/${projectId}/members/${employeeId}`, payload, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    getRequestsByManager: async (params) => {
        try {
            const response = await api.get(
                `/requests/by-manager`,
                {
                    params: {
                        ...params
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            const errMsg = error.response?.data?.message || error.message;
            throw new Error(errMsg);
        }
    },
    approveRequest: async (requestId, requestType) => {
        const response = await api.put(
          `/requests/${requestId}/approve`,
          null,
          { params: { requestType } }
        );
        return response.data.data;
      },
      
      rejectRequest: async (requestId, requestType) => {
        const response = await api.put(
          `/requests/${requestId}/reject`,
          null,
          { params: { requestType } }
        );
        return response.data.data;
    
    }      
};