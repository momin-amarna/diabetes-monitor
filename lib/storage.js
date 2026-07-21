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

  // Compare-and-swap read-modify-write: guards against lost updates when the
  // same key is written from another tab between our read and our write.
  updateList(key, updater, fallback = []) {
    if (typeof window === 'undefined') return updater(fallback);

    for (let attempt = 0; attempt < 5; attempt++) {
      const before = window.localStorage.getItem(key);
      let current;
      try {
        current = before ? JSON.parse(before) : fallback;
      } catch (error) {
        console.error(`Error reading storage key "${key}":`, error);
        current = fallback;
      }

      const updated = updater(current);

      try {
        const stillCurrent = window.localStorage.getItem(key);
        if (stillCurrent === before) {
          window.localStorage.setItem(key, JSON.stringify(updated));
          return updated;
        }
      } catch (error) {
        console.error(`Error writing storage key "${key}":`, error);
        return updated;
      }
    }

    // Repeated concurrent writes from another tab — write best-effort with
    // the latest data rather than failing the user's action.
    const current = this.get(key) || fallback;
    const updated = updater(current);
    this.set(key, updated);
    return updated;
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
    storage.updateList(STORAGE_KEYS.PATIENTS, (patients) => {
      const index = patients.findIndex(p => p.id === patient.id);
      if (index >= 0) {
        const next = [...patients];
        next[index] = patient;
        return next;
      }
      return [...patients, patient];
    });
  },

  delete(id) {
    storage.updateList(STORAGE_KEYS.PATIENTS, (patients) =>
      patients.map(p => (p.id === id ? { ...p, active: false } : p))
    );
  },

  restore(id) {
    storage.updateList(STORAGE_KEYS.PATIENTS, (patients) =>
      patients.map(p => (p.id === id ? { ...p, active: true } : p))
    );
  },

  seedDefaults() {
    storage.updateList(STORAGE_KEYS.PATIENTS, (patients) => {
      if (patients.length > 0) return patients;
      return [
        { id: 'father', name: 'الأب', emoji: '👨', color: '#3b82f6', active: true, createdAt: Date.now() },
        { id: 'mother', name: 'الأم', emoji: '👩', color: '#ec4899', active: true, createdAt: Date.now() },
      ];
    });
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
    storage.updateList(STORAGE_KEYS.MEASUREMENTS, (measurements) => {
      const index = measurements.findIndex(m => m.id === measurement.id);
      if (index >= 0) {
        const next = [...measurements];
        next[index] = measurement;
        return next;
      }
      return [...measurements, measurement];
    });
  },

  delete(id) {
    storage.updateList(STORAGE_KEYS.MEASUREMENTS, (measurements) =>
      measurements.filter(m => m.id !== id)
    );
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
    storage.updateList(STORAGE_KEYS.WEIGHTS, (weights) => {
      const index = weights.findIndex(w => w.id === weight.id);
      if (index >= 0) {
        const next = [...weights];
        next[index] = weight;
        return next;
      }
      return [...weights, weight];
    });
  },

  delete(id) {
    storage.updateList(STORAGE_KEYS.WEIGHTS, (weights) =>
      weights.filter(w => w.id !== id)
    );
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
