import { createHandler } from '../../../lib/api-utils';
import { isSheetsConfigured } from '../../../lib/sheets-api';

export default createHandler('POST', async (req, res) => {
  const { id } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const synced = isSheetsConfigured();

  return res.status(200).json({ success: true, synced });
});
