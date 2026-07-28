import { createHandler } from '../../../lib/api-utils';
import { validateMeasurement } from '../../../lib/validation';
import { isSheetsConfigured } from '../../../lib/sheets-api';

export default createHandler('POST', async (req, res) => {
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
  // must never block or fail the save. No OAuth write actually happens yet
  // regardless of config — `synced` just reports whether Sheets appears
  // configured, matching the /list routes, until a real write is added.
  const synced = isSheetsConfigured();

  return res.status(200).json({ success: true, synced });
});
