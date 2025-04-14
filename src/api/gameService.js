import apiClient from './apiClient';

const API_BASE = '/v1';

const createGame = async (gameData) => {
  const response = await apiClient.post(`${API_BASE}/game`, gameData);
  return response.data;
};

const getMyGames = async () => {
  const response = await apiClient.get(`${API_BASE}/my-games`);
  return response.data;
};

const getMyEnrolledGames = async (activeOnly = true) => {
  const response = await apiClient.get(`${API_BASE}/my-enrolled-games?activeOnly=${activeOnly}`);
  return response.data;
};

const getNearbyGames = async (lat, lon, radiusKm = 10) => {
  const response = await apiClient.get(`${API_BASE}/games/nearby?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`);
  return response.data;
};

const getGameDetails = async (gameId) => {
  const response = await apiClient.get(`${API_BASE}/gameDetails/${gameId}`);
  return response.data;
};

const updateGame = async (gameId, gameData) => {
  const response = await apiClient.post(`${API_BASE}/updateGame/${gameId}`, gameData);
  return response.data;
};

const enrollInGame = async (gameId) => {
  const response = await apiClient.post(`${API_BASE}/games/${gameId}/enroll`);
  return response.data;
};

const unenrollFromGame = async (gameId) => {
  const response = await apiClient.post(`${API_BASE}/games/${gameId}/unenroll`);
  return response.data;
};

const getPlayersInGame = async (gameId, status) => {
  const response = await apiClient.get(`${API_BASE}/games/${gameId}/players/${status}`);
  return response.data;
};

const gameService = {
  createGame,
  getMyGames,
  getMyEnrolledGames,
  getNearbyGames,
  getGameDetails,
  updateGame,
  enrollInGame,
  unenrollFromGame,
  getPlayersInGame,
};

export default gameService;