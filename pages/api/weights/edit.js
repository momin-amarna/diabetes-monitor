import { createHandler } from '../../../lib/api-utils';
import { validateWeight } from '../../../lib/validation';
import { isSheetsConfigured } from '../../../lib/sheets-api';

export default createHandler('POST', async (req, res) => {
  const { id, weight, timestamp } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const { valid, errors } = validateWeight({ weight });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  if (!timestamp) {
    return res.status(400).json({ error: 'timestamp is required' });
  }

  const synced = isSheetsConfigured();

  return res.status(200).json({ success: true, synced });
});
