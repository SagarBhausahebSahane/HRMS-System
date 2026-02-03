import api from './api';

export const employeeService = {
  // Get employees with pagination (skip and limit)
  getEmployees: async (skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/employees/?skip=${skip}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      const response = await api.get('/employees/stats/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single employee
  getEmployee: async (employeeId) => {
    try {
      const response = await api.get(`/employees/${employeeId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employees/', employeeData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/employees/${employeeId}/`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
