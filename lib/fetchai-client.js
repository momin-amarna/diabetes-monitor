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
};

export default fetchaiClient;
