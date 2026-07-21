import { validatePatient } from '../../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, name, emoji, color } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  const { valid, errors } = validatePatient({ name, emoji, color });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const synced = false;

  return res.status(200).json({ success: true, synced });
}
