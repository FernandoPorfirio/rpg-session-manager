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

    const contentType = response.headers.get("content-type");
    const hasJsonContent =
      contentType && contentType.includes("application/json");

    let data = null;

    if (hasJsonContent && response.status !== 204) {
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
    }

    if (!response.ok) {
      throw new Error(data?.message || "Erro na requisição");
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

  async getClasses() {
    return await this.request("/class");
  }

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

  async getConfirmedPlayersBySession(sessionId) {
    return await this.request(
      `/session_player_confirmation/session/${sessionId}/players`
    );
  }

  async addPlayerToSession(sessionId, playerId) {
    return await this.request("/session_player_confirmation", {
      method: "POST",
      body: JSON.stringify({ sessionId, playerId }),
    });
  }

  async removePlayerFromSession(confirmationId) {
    return await this.request(
      `/session_player_confirmation/${confirmationId}`,
      {
        method: "DELETE",
      }
    );
  }

  async getSessionPlayerConfirmations(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return await this.request(`/session_player_confirmation?${queryString}`);
  }

  async getGuilds() {
    return await this.request("/guild");
  }

  async getGuild(id) {
    return await this.request(`/guild/${id}`);
  }

  async createGuild(guildData) {
    return await this.request("/guild", {
      method: "POST",
      body: JSON.stringify(guildData),
    });
  }

  async updateGuild(id, guildData) {
    return await this.request(`/guild/${id}`, {
      method: "PUT",
      body: JSON.stringify(guildData),
    });
  }

  async deleteGuild(id) {
    return await this.request(`/guild/${id}`, {
      method: "DELETE",
    });
  }

  async formGuildsAutomatically(sessionId, numberOfGuilds) {
    return await this.request("/guild/form-automatically", {
      method: "POST",
      body: JSON.stringify({ sessionId, numberOfGuilds }),
    });
  }

  async getGuildsBySession(sessionId) {
    return await this.request(`/guild/session/${sessionId}`);
  }
}

export default new ApiService();
