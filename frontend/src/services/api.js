import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5002/api", // Your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;