import { validateMeasurement } from '../../../lib/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { patientId, reading, fastingHours, timestamp } = req.body || {};

  if (!patientId) {
    return res.status(400).json({ error: 'patientId is required' });
  }

  const { valid, errors } = validateMeasurement({ reading, fastingHours });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  if (!timestamp) {
    return res.status(400).json({ error: 'timestamp is required' });
  }

  // The client already persisted the measurement to localStorage (source of
  // truth for offline-first behavior). Sheets sync is best-effort only and
  // must never block or fail the save — Sheets OAuth isn't wired up yet, so
  // sync is always reported as pending until that's implemented.
  const synced = false;

  return res.status(200).json({ success: true, synced });
}
