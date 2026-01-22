import axios from 'axios';
import { API_URL } from '../../constants';

const api = axios.create({
  baseURL: API_URL,
});

// Tự động đính kèm Token vào mỗi yêu cầu nếu người dùng đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;