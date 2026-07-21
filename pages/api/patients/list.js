import { isSheetsConfigured } from '../../../lib/sheets-api';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // localStorage is the source of truth for offline-first reads; this route
  // exists for a future Sheets-backed backup/restore path and is a no-op
  // until Sheets OAuth is configured.
  return res.status(200).json({ patients: [], synced: isSheetsConfigured() });
}
