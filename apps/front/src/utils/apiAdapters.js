import api from "../services/api";

export const sessionApiAdapter = {
  getAll: () => api.getSessions(),
  get: (id) => api.getSession(id),
  create: (data) => api.createSession(data),
  update: (id, data) => api.updateSession(id, data),
  delete: (id) => api.deleteSession(id),
};

export const playerApiAdapter = {
  getAll: (params) => api.getPlayers(params),
  get: (id) => api.getPlayer(id),
  create: (data) => api.createPlayer(data),
  update: (id, data) => api.updatePlayer(id, data),
  delete: (id) => api.deletePlayer(id),
};
