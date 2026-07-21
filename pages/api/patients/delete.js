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
  // This route is a no-op sync stub until Sheets OAuth is configured.
  const synced = false;

  return res.status(200).json({ success: true, synced });
}
