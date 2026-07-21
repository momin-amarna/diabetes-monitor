const PLACEHOLDER_VALUES = new Set([
  undefined,
  '',
  'YOUR_API_KEY_HERE',
  'YOUR_CLIENT_ID_HERE',
  'YOUR_SPREADSHEET_ID_HERE',
]);

export function isSheetsConfigured() {
  return (
    !PLACEHOLDER_VALUES.has(process.env.GOOGLE_SHEETS_API_KEY) &&
    !PLACEHOLDER_VALUES.has(process.env.GOOGLE_SHEETS_SPREADSHEET_ID)
  );
}

export const sheetsAPI = {
  async getAuthToken() {
    try {
      const response = await fetch('/api/sheets/auth');
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async listSheets(spreadsheetId, accessToken) {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${process.env.GOOGLE_SHEETS_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.sheets || [];
    } catch (error) {
      console.error('Error listing sheets:', error);
      return [];
    }
  },

  async readSheet(spreadsheetId, range, accessToken) {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${process.env.GOOGLE_SHEETS_API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error reading sheet:', error);
      return [];
    }
  },

  async appendToSheet(spreadsheetId, range, values, accessToken) {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${process.env.GOOGLE_SHEETS_API_KEY}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [values],
          }),
        }
      );
      const data = await response.json();
      return data.updates || null;
    } catch (error) {
      console.error('Error appending to sheet:', error);
      return null;
    }
  },

  async updateSheet(spreadsheetId, range, values, accessToken) {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${process.env.GOOGLE_SHEETS_API_KEY}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [values],
          }),
        }
      );
      const data = await response.json();
      return data.updatedRows > 0;
    } catch (error) {
      console.error('Error updating sheet:', error);
      return false;
    }
  },
};

export default sheetsAPI;
