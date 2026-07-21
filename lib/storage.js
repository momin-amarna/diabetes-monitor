const STORAGE_KEYS = {
  USER_EMAIL: 'smartdiabetes:userEmail',
  PATIENTS: 'smartdiabetes:patients',
  MEASUREMENTS: 'smartdiabetes:measurements',
  WEIGHTS: 'smartdiabetes:weights',
  SETTINGS: 'smartdiabetes:settings',
};

export const storage = {
  get(key) {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return null;
    }
  },

  set(key, value) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
    }
  },

  remove(key) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  },

  clear() {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        window.localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export const userStorage = {
  setEmail(email) {
    storage.set(STORAGE_KEYS.USER_EMAIL, email);
  },

  getEmail() {
    return storage.get(STORAGE_KEYS.USER_EMAIL);
  },

  clearEmail() {
    storage.remove(STORAGE_KEYS.USER_EMAIL);
  },
};

export const patientStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.PATIENTS) || [];
  },

  getActive() {
    const patients = this.getAll();
    return patients.filter(p => p.active !== false);
  },

  getById(id) {
    const patients = this.getAll();
    return patients.find(p => p.id === id);
  },

  save(patient) {
    const patients = this.getAll();
    const index = patients.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }
    storage.set(STORAGE_KEYS.PATIENTS, patients);
  },

  delete(id) {
    const patients = this.getAll();
    const index = patients.findIndex(p => p.id === id);
    if (index >= 0) {
      patients[index].active = false;
      storage.set(STORAGE_KEYS.PATIENTS, patients);
    }
  },

  restore(id) {
    const patients = this.getAll();
    const patient = patients.find(p => p.id === id);
    if (patient) {
      patient.active = true;
      storage.set(STORAGE_KEYS.PATIENTS, patients);
    }
  },

  seedDefaults() {
    if (this.getAll().length === 0) {
      const defaultPatients = [
        { id: 'father', name: 'الأب', emoji: '👨', color: '#3b82f6', active: true, createdAt: Date.now() },
        { id: 'mother', name: 'الأم', emoji: '👩', color: '#ec4899', active: true, createdAt: Date.now() },
      ];
      storage.set(STORAGE_KEYS.PATIENTS, defaultPatients);
    }
  },
};

export const measurementStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.MEASUREMENTS) || [];
  },

  getByPatient(patientId) {
    const measurements = this.getAll();
    return measurements.filter(m => m.patientId === patientId).sort((a, b) => b.timestamp - a.timestamp);
  },

  getLatest(patientId) {
    const measurements = this.getByPatient(patientId);
    return measurements[0] || null;
  },

  save(measurement) {
    const measurements = this.getAll();
    const index = measurements.findIndex(m => m.id === measurement.id);
    if (index >= 0) {
      measurements[index] = measurement;
    } else {
      measurements.push(measurement);
    }
    storage.set(STORAGE_KEYS.MEASUREMENTS, measurements);
  },

  delete(id) {
    const measurements = this.getAll().filter(m => m.id !== id);
    storage.set(STORAGE_KEYS.MEASUREMENTS, measurements);
  },
};

export const weightStorage = {
  getAll() {
    return storage.get(STORAGE_KEYS.WEIGHTS) || [];
  },

  getByPatient(patientId) {
    const weights = this.getAll();
    return weights.filter(w => w.patientId === patientId).sort((a, b) => b.timestamp - a.timestamp);
  },

  getLatest(patientId) {
    const weights = this.getByPatient(patientId);
    return weights[0] || null;
  },

  save(weight) {
    const weights = this.getAll();
    const index = weights.findIndex(w => w.id === weight.id);
    if (index >= 0) {
      weights[index] = weight;
    } else {
      weights.push(weight);
    }
    storage.set(STORAGE_KEYS.WEIGHTS, weights);
  },

  delete(id) {
    const weights = this.getAll().filter(w => w.id !== id);
    storage.set(STORAGE_KEYS.WEIGHTS, weights);
  },
};

export const settingsStorage = {
  get() {
    return storage.get(STORAGE_KEYS.SETTINGS) || null;
  },

  save(settings) {
    storage.set(STORAGE_KEYS.SETTINGS, settings);
  },

  update(updates) {
    const current = this.get();
    if (current) {
      const updated = { ...current, ...updates, updatedAt: Date.now() };
      this.save(updated);
      return updated;
    }
  },
};

export const exportData = () => {
  return {
    email: userStorage.getEmail(),
    patients: patientStorage.getAll(),
    measurements: measurementStorage.getAll(),
    weights: weightStorage.getAll(),
    settings: settingsStorage.get(),
    exportedAt: new Date().toISOString(),
  };
};

export const importData = (data) => {
  try {
    if (data.email) userStorage.setEmail(data.email);
    if (data.patients) storage.set(STORAGE_KEYS.PATIENTS, data.patients);
    if (data.measurements) storage.set(STORAGE_KEYS.MEASUREMENTS, data.measurements);
    if (data.weights) storage.set(STORAGE_KEYS.WEIGHTS, data.weights);
    if (data.settings) settingsStorage.save(data.settings);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
