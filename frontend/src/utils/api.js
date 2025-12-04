// API client for communicating with backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class APIClient {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Create new participant
  async createParticipant() {
    return this.request('/api/participants/create', {
      method: 'POST',
    });
  }

  // Submit demographics
  async submitDemographics(participantId, demographics) {
    return this.request(`/api/participants/${participantId}/demographics`, {
      method: 'POST',
      body: JSON.stringify({ demographics }),
    });
  }

  // Submit trial data (batch)
  async submitTrials(participantId, trials) {
    return this.request('/api/trials/submit', {
      method: 'POST',
      body: JSON.stringify({ participantId, trials }),
    });
  }

  // Complete experiment
  async completeExperiment(participantId, postSurvey, completedAt) {
    return this.request(`/api/participants/${participantId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ postSurvey, completedAt }),
    });
  }

  // Get participant stats
  async getParticipantStats(participantId) {
    return this.request(`/api/trials/${participantId}/stats`);
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

// Retry logic for failed requests
export async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
}

export default new APIClient();
