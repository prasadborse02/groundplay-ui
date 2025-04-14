import apiClient from './apiClient';

const API_BASE = '/v1';

const getMyProfile = async () => {
  const response = await apiClient.get(`${API_BASE}/my-profile`);
  return response.data;
};

const updateMyProfile = async (profileData) => {
  const response = await apiClient.post(`${API_BASE}/my-profile`, profileData);
  return response.data;
};

const getPlayerProfile = async (playerId) => {
  const response = await apiClient.get(`${API_BASE}/players/${playerId}`);
  return response.data;
};

const updatePlayerProfile = async (playerId, profileData) => {
  const response = await apiClient.post(`${API_BASE}/players/${playerId}`, profileData);
  return response.data;
};

const getPlayerEnrollments = async (playerId, activeOnly = true) => {
  const response = await apiClient.get(`${API_BASE}/players/${playerId}/enrollments?activeOnly=${activeOnly}`);
  return response.data;
};

const playerService = {
  getMyProfile,
  updateMyProfile,
  getPlayerProfile,
  updatePlayerProfile,
  getPlayerEnrollments,
};

export default playerService;