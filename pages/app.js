import { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import PatientCard from '../components/Dashboard/PatientCard';
import EmptyState from '../components/Dashboard/EmptyState';
import TabNavigation from '../components/Dashboard/TabNavigation';
import MeasurementForm from '../components/Dashboard/MeasurementForm';
import { userStorage, patientStorage, measurementStorage } from '../lib/storage';
import { createMeasurement } from '../lib/models';

export default function App() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [patients, setPatients] = useState([]);
  const [measurementPatient, setMeasurementPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
        <button
          onClick={handleLogout}
          className="min-h-touch px-4 text-base text-gray-600 hover:text-gray-900"
        >
          تسجيل الخروج
        </button>
      </header>

      <TabNavigation onTabChange={() => {}} />

      <main className="p-4 flex flex-col gap-4">
        {patients.length === 0 ? (
          <EmptyState
            icon="👨‍👩‍👧"
            title="لا يوجد مرضى بعد"
            description="أضف مريضًا للبدء بتسجيل قراءات السكري"
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
    </div>
  );
}
