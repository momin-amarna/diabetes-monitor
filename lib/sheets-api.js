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
