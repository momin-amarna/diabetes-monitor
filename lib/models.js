/**
 * @typedef {Object} Patient
 * @property {string} id - Unique patient identifier (UUID)
 * @property {string} name - Patient name
 * @property {string} emoji - Patient emoji (e.g., "👨")
 * @property {string} color - Hex color for patient card (e.g., "#10b981")
 * @property {boolean} active - Whether patient is active (soft-delete support)
 * @property {number} createdAt - Timestamp of patient creation
 */

/**
 * @typedef {Object} Measurement
 * @property {string} id - Unique measurement identifier
 * @property {string} patientId - Reference to patient
 * @property {number} reading - Blood sugar reading (mg/dL)
 * @property {number} fastingHours - Hours fasted before measurement
 * @property {number} timestamp - When measurement was taken
 * @property {string} [notes] - Optional notes about the measurement
 * @property {boolean} [synced] - Whether synced to Google Sheets
 * @property {number} createdAt - Timestamp of record creation
 */

/**
 * @typedef {Object} WeightRecord
 * @property {string} id - Unique weight record identifier
 * @property {string} patientId - Reference to patient
 * @property {number} weight - Weight in kg
 * @property {number} timestamp - When weight was recorded
 * @property {boolean} [synced] - Whether synced to Google Sheets
 * @property {number} createdAt - Timestamp of record creation
 */

/**
 * @typedef {Object} Settings
 * @property {boolean} showNotes - Whether to show notes input in measurement form
 * @property {string} timeInputMethod - 'arrows' or 'manual' for time input
 * @property {string} fontSize - 'normal' | 'large' | 'xlarge'
 * @property {string} spacing - 'normal' | 'large' | 'xlarge'
 * @property {boolean} highContrast - Enable high contrast mode
 * @property {boolean} hideLandingButton - Hide landing page button
 * @property {string} [reminderDay] - Day of week for reminder (e.g., 'Monday')
 * @property {string} [reminderTime] - Time for reminder (e.g., '09:00')
 * @property {number} updatedAt - Last updated timestamp
 */

export const createPatient = (name, emoji, color = '#10b981') => ({
  id: generateId(),
  name,
  emoji,
  color,
  active: true,
  createdAt: Date.now(),
});

export const createMeasurement = (patientId, reading, fastingHours, timestamp, notes = '') => ({
  id: generateId(),
  patientId,
  reading,
  fastingHours,
  timestamp,
  notes,
  synced: false,
  createdAt: Date.now(),
});

export const createWeightRecord = (patientId, weight, timestamp) => ({
  id: generateId(),
  patientId,
  weight,
  timestamp,
  synced: false,
  createdAt: Date.now(),
});

export const createSettings = () => ({
  showNotes: true,
  timeInputMethod: 'arrows',
  fontSize: 'normal',
  spacing: 'normal',
  highContrast: false,
  hideLandingButton: false,
  reminderDay: null,
  reminderTime: null,
  updatedAt: Date.now(),
});

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
