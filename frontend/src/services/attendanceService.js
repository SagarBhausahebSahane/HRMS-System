import api from './api';

export const attendanceService = {
  // Get attendance records with pagination (skip and limit)
  getAttendance: async (skip = 0, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ skip, limit, ...filters });
      const response = await api.get(`/attendance/?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get attendance statistics
  getAttendanceStats: async () => {
    try {
      const response = await api.get('/attendance/stats/');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get employee attendance with pagination
  getEmployeeAttendance: async (employeeId, skip = 0, limit = 10) => {
    try {
      const response = await api.get(`/attendance/employee/${employeeId}/?skip=${skip}&limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark attendance
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/attendance/', attendanceData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};
