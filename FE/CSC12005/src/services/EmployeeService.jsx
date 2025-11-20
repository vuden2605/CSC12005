const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const EmployeeService = {
    getEmployees: async () => {
        const response = await fetch(`${API_URL}/employees`);
        return response.json();
    },
    createEmployee: async (employee) => {
        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            body: JSON.stringify(employee),
        });
        return response.json();
    },
    updateEmployee: async (employee) => {
        const response = await fetch(`${API_URL}/employees/${employee.id}`, {
            method: 'PUT',
            body: JSON.stringify(employee),
        });
        return response.json();
    },
    deleteEmployee: async (id) => {
        const response = await fetch(`${API_URL}/employees/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    }
}