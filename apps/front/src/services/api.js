const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("authToken");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição");
    }

    return data;
  }

  async signUp(userData) {
    return await this.request("/game_master", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async signIn(credentials) {
    return await this.request("/game_master/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(id) {
    return await this.request(`/game_master/${id}`);
  }

  async getPlayers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/player?${queryString}`);
  }

  async getPlayer(id) {
    return await this.request(`/player/${id}`);
  }

  async createPlayer(playerData) {
    return await this.request("/player", {
      method: "POST",
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(id, playerData) {
    return await this.request(`/player/${id}`, {
      method: "PUT",
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(id) {
    return await this.request(`/player/${id}`, {
      method: "DELETE",
    });
  }

  // Classes
  async getClasses() {
    return await this.request("/class");
  }

  // Sessions
  async getSessions() {
    return await this.request("/session");
  }

  async getSession(id) {
    return await this.request(`/session/${id}`);
  }

  async createSession(sessionData) {
    return await this.request("/session", {
      method: "POST",
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(id, sessionData) {
    return await this.request(`/session/${id}`, {
      method: "PUT",
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id) {
    return await this.request(`/session/${id}`, {
      method: "DELETE",
    });
  }
}

export default new ApiService();
