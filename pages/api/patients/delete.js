import { isSheetsConfigured } from '../../../lib/sheets-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  // Soft-delete happens client-side (patientStorage.delete marks inactive).
  // See add.js: `synced` reports whether Sheets appears configured, not
  // whether a real write happened — no OAuth write exists yet either way.
  const synced = isSheetsConfigured();

  return res.status(200).json({ success: true, synced });
}
