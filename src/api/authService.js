import apiClient from './apiClient';

const AUTH_BASE = '/auth';

const register = async (userData) => {
  const response = await apiClient.post(`${AUTH_BASE}/register`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await apiClient.post(`${AUTH_BASE}/login`, credentials);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;