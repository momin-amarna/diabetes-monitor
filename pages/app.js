import { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import PatientCard from '../components/Dashboard/PatientCard';
import EmptyState from '../components/Dashboard/EmptyState';
import TabNavigation from '../components/Dashboard/TabNavigation';
import MeasurementForm from '../components/Dashboard/MeasurementForm';
import PatientList from '../components/PatientManagement/PatientList';
import AddEditPatient from '../components/PatientManagement/AddEditPatient';
import { userStorage, patientStorage, measurementStorage } from '../lib/storage';
import { createMeasurement, createPatient } from '../lib/models';

export default function App() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [patients, setPatients] = useState([]);
  const [measurementPatient, setMeasurementPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPatientList, setShowPatientList] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showAddEditPatient, setShowAddEditPatient] = useState(false);

  useEffect(() => {
    const storedEmail = userStorage.getEmail();
    if (storedEmail) {
      patientStorage.seedDefaults();
      setPatients(patientStorage.getActive());
      setEmail(storedEmail);
    }
    setReady(true);
  }, []);

  const handleLogin = (loggedInEmail) => {
    patientStorage.seedDefaults();
    setPatients(patientStorage.getActive());
    setEmail(loggedInEmail);
  };

  const handleLogout = () => {
    userStorage.clearEmail();
    setEmail(null);
    setPatients([]);
  };

  const handleSaveMeasurement = async (data) => {
    const measurement = createMeasurement(
      data.patientId,
      data.reading,
      data.fastingHours,
      data.timestamp,
      data.notes
    );

    measurementStorage.save(measurement);
    setMeasurementPatient(null);
    setRefreshKey((key) => key + 1);

    try {
      await fetch('/api/measurements/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement),
      });
    } catch (error) {
      console.error('Measurement sync failed:', error);
    }
  };

  const openAddPatient = () => {
    setShowPatientList(false);
    setEditingPatient(null);
    setShowAddEditPatient(true);
  };

  const openEditPatient = (patient) => {
    setShowPatientList(false);
    setEditingPatient(patient);
    setShowAddEditPatient(true);
  };

  const handleSavePatient = async (data) => {
    const patient = editingPatient
      ? { ...editingPatient, name: data.name, emoji: data.emoji, color: data.color }
      : createPatient(data.name, data.emoji, data.color);

    patientStorage.save(patient);
    setPatients(patientStorage.getActive());
    setShowAddEditPatient(false);
    setEditingPatient(null);

    try {
      await fetch(editingPatient ? '/api/patients/edit' : '/api/patients/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
    } catch (error) {
      console.error('Patient sync failed:', error);
    }
  };

  const handleDeletePatient = async (patient) => {
    patientStorage.delete(patient.id);
    setPatients(patientStorage.getActive());

    try {
      await fetch('/api/patients/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: patient.id }),
      });
    } catch (error) {
      console.error('Patient delete sync failed:', error);
    }
  };

  if (!ready) {
    return null;
  }

  if (!email) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-subheading font-bold text-gray-900">مراقب السكري الذكي</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPatientList(true)}
            aria-label="إدارة المرضى"
            className="min-h-touch min-w-touch text-2xl text-gray-600 hover:text-gray-900"
          >
            👥
          </button>
          <button
            onClick={handleLogout}
            className="min-h-touch px-4 text-base text-gray-600 hover:text-gray-900"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <TabNavigation onTabChange={() => {}} />

      <main className="p-4 flex flex-col gap-4">
        {patients.length === 0 ? (
          <EmptyState
            icon="👨‍👩‍👧"
            title="لا يوجد مرضى بعد"
            description="أضف مريضًا للبدء بتسجيل قراءات السكري"
            action={openAddPatient}
            actionLabel="+ إضافة مريض"
          />
        ) : (
          patients.map((patient) => (
            <PatientCard
              key={`${patient.id}-${refreshKey}`}
              patient={patient}
              lastMeasurement={measurementStorage.getLatest(patient.id)}
              onNewMeasurement={setMeasurementPatient}
            />
          ))
        )}
      </main>

      {measurementPatient && (
        <MeasurementForm
          patient={measurementPatient}
          onSave={handleSaveMeasurement}
          onCancel={() => setMeasurementPatient(null)}
        />
      )}

      {showPatientList && (
        <PatientList
          patients={patients}
          onAdd={openAddPatient}
          onEdit={openEditPatient}
          onDelete={handleDeletePatient}
          onClose={() => setShowPatientList(false)}
        />
      )}

      {showAddEditPatient && (
        <AddEditPatient
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setShowAddEditPatient(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
}
