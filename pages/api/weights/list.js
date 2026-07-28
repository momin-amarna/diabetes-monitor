import { createHandler } from '../../../lib/api-utils';
import { isSheetsConfigured } from '../../../lib/sheets-api';

export default createHandler('GET', async (req, res) => {
  // localStorage is the source of truth for offline-first reads; this route
  // exists for a future Sheets-backed backup/restore path and is a no-op
  // until Sheets OAuth is configured.
  return res.status(200).json({ weights: [], synced: isSheetsConfigured() });
});
