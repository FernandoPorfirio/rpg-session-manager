const API_BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }

    return data;
  }

  async signUp(userData) {
    return await this.request('/game_master', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signIn(credentials) {
    return await this.request('/game_master/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(id) {
    return await this.request(`/game_master/${id}`);
  }
}

export default new ApiService();
