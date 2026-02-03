
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle success responses
    const { result, status, msg, data } = response.data;

    if (status === false) {
      toast.error(msg || 'Request failed');
      return Promise.reject(new Error(msg));
    }

    if (msg && result === 200) {
      toast.success(msg);
    }

    return response.data;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      const { result, msg } = error.response.data || {};
      const errorMessage = msg || error.response.statusText || 'An error occurred';

      toast.error(errorMessage);

      // Return consistent error format
      return Promise.reject({
        result: result || error.response.status,
        status: false,
        msg: errorMessage,
        data: null
      });
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
      return Promise.reject({
        result: 503,
        status: false,
        msg: 'Network error. Please check your connection.',
        data: null
      });
    } else {
      toast.error('Request configuration error');
      return Promise.reject({
        result: 400,
        status: false,
        msg: 'Request configuration error',
        data: null
      });
    }
  }
);

export default api;
