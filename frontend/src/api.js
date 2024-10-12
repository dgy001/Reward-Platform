// src/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});


// 请求拦截器，添加 token 到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
