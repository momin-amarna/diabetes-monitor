export const fetchaiClient = {
  async getInsight(reading, fastingHours) {
    try {
      const response = await fetch('/api/health/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reading,
          fastingHours,
        }),
      });

      if (!response.ok) {
        console.error('Error getting insight:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.insight || null;
    } catch (error) {
      console.error('Error calling Fetch AI:', error);
      return null;
    }
  },

  async createSession() {
    try {
      const response = await fetch('/api/health/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error creating session:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.sessionId || null;
    } catch (error) {
      console.error('Error creating Fetch AI session:', error);
      return null;
    }
  },

  async sendMessage(sessionId, message) {
    try {
      const response = await fetch('/api/health/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
        }),
      });

      if (!response.ok) {
        console.error('Error sending message:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.response || null;
    } catch (error) {
      console.error('Error sending message to Fetch AI:', error);
      return null;
    }
  },

  parseResponse(response) {
    try {
      if (typeof response === 'string') {
        return response;
      }
      if (response && response.text) {
        return response.text;
      }
      return null;
    } catch (error) {
      console.error('Error parsing Fetch AI response:', error);
      return null;
    }
  },
};

export default fetchaiClient;
