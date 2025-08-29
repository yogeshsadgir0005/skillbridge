import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
});


api.interceptors.request.use(
  (config) => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const { token } = JSON.parse(storedData);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;