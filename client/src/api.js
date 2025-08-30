import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skillbridge-7x1l.onrender.com/api', 
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
