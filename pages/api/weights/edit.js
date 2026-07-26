import { validateWeight } from '../../../lib/validation';
import { isSheetsConfigured } from '../../../lib/sheets-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
