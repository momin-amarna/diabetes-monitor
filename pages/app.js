import { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import PatientCard from '../components/Dashboard/PatientCard';
import EmptyState from '../components/Dashboard/EmptyState';
import TabNavigation from '../components/Dashboard/TabNavigation';
import MeasurementForm from '../components/Dashboard/MeasurementForm';
import WeightForm from '../components/Dashboard/WeightForm';
import PatientList from '../components/PatientManagement/PatientList';
import AddEditPatient from '../components/PatientManagement/AddEditPatient';
import { userStorage, patientStorage, measurementStorage, weightStorage } from '../lib/storage';
import { createMeasurement, createWeightRecord, createPatient } from '../lib/models';

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('blood-sugar');
  const [measurementPatient, setMeasurementPatient] = useState(null);
  const [weightPatient, setWeightPatient] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncError, setSyncError] = useState(null);

  // Which patient-management overlay is open, if any:
  //   null                                        — none
  //   { screen: 'list' }                           — the manage-patients list
  //   { screen: 'form', mode, patient, returnToList } — add/edit form
  const [patientOverlay, setPatientOverlay] = useState(null);

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
    setSyncError(null);

    try {
      await postJson('/api/measurements/add', measurement);
    } catch (error) {
      console.error('Measurement sync failed:', error);
      setSyncError('تعذر مزامنة القراءة مع الخادم، لكن تم حفظها على جهازك.');
    }
  };

  const handleSaveWeight = async (data) => {
    const weightRecord = createWeightRecord(data.patientId, data.weight, data.timestamp);

    weightStorage.save(weightRecord);
    setWeightPatient(null);
    setRefreshKey((key) => key + 1);
    setSyncError(null);

    try {
      await postJson('/api/weights/add', weightRecord);
    } catch (error) {
      console.error('Weight sync failed:', error);
      setSyncError('تعذر مزامنة الوزن مع الخادم، لكن تم حفظه على جهازك.');
    }
  };

  const openPatientList = () => setPatientOverlay({ screen: 'list' });

  const openAddPatient = () => {
    setPatientOverlay((prev) => ({
      screen: 'form',
      mode: 'add',
      patient: null,
      returnToList: prev?.screen === 'list',
    }));
  };

  const openEditPatient = (patient) => {
    setPatientOverlay((prev) => ({
      screen: 'form',
      mode: 'edit',
      patient,
      returnToList: prev?.screen === 'list',
    }));
  };

  const closePatientForm = () => {
    setPatientOverlay((prev) => (prev?.returnToList ? { screen: 'list' } : null));
  };

  const handleSavePatient = async (data) => {
    const editingPatient = patientOverlay?.mode === 'edit' ? patientOverlay.patient : null;

    const patient = editingPatient
      ? patientStorage.update(editingPatient.id, {
          name: data.name,
          emoji: data.emoji,
          color: data.color,
        })
      : createPatient(data.name, data.emoji, data.color);

    if (!editingPatient) {
      patientStorage.save(patient);
    }
    setPatients(patientStorage.getActive());
    closePatientForm();
    setSyncError(null);

    try {
      await postJson(editingPatient ? '/api/patients/edit' : '/api/patients/add', patient);
    } catch (error) {
      console.error('Patient sync failed:', error);
      setSyncError('تعذر مزامنة بيانات المريض مع الخادم، لكن تم حفظها على جهازك.');
    }
  };

  const handleDeletePatient = async (patient) => {
    patientStorage.delete(patient.id);
    setPatients(patientStorage.getActive());
    setSyncError(null);

    try {
      await postJson('/api/patients/delete', { id: patient.id });
    } catch (error) {
      console.error('Patient delete sync failed:', error);
      setSyncError('تعذر مزامنة الحذف مع الخادم، لكن تم حذفه من جهازك.');
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
            onClick={openPatientList}
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

      {syncError && (
        <div className="flex items-center justify-between gap-3 bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-base text-yellow-800">{syncError}</p>
          <button
            onClick={() => setSyncError(null)}
            aria-label="إغلاق"
            className="min-h-touch min-w-touch text-xl text-yellow-800"
          >
            ✕
          </button>
        </div>
      )}

      <TabNavigation onTabChange={setActiveTab} />

      <main className="p-4 flex flex-col gap-4">
        {activeTab === 'statistics' ? (
          <p className="text-lg text-gray-600 text-center mt-8">قريبًا</p>
        ) : patients.length === 0 ? (
          <EmptyState
            icon="👨‍👩‍👧"
            title="لا يوجد مرضى بعد"
            description="أضف مريضًا للبدء بتسجيل قراءات السكري"
            action={openAddPatient}
            actionLabel="+ إضافة مريض"
          />
        ) : activeTab === 'weight' ? (
          patients.map((patient) => {
            const latest = weightStorage.getLatest(patient.id);
            return (
              <PatientCard
                key={`${patient.id}-${refreshKey}`}
                patient={patient}
                lastRecord={latest ? { value: latest.weight, unit: 'كجم', timestamp: latest.timestamp } : null}
                emptyLabel="لا يوجد وزن مسجل بعد"
                actionLabel="+ إضافة وزن"
                onAction={setWeightPatient}
              />
            );
          })
        ) : (
          patients.map((patient) => {
            const latest = measurementStorage.getLatest(patient.id);
            return (
              <PatientCard
                key={`${patient.id}-${refreshKey}`}
                patient={patient}
                lastRecord={latest ? { value: latest.reading, unit: 'mg/dL', timestamp: latest.timestamp } : null}
                emptyLabel="لا توجد قراءات بعد"
                actionLabel="+ قراءة جديدة"
                onAction={setMeasurementPatient}
              />
            );
          })
        )}
      </main>

      {measurementPatient && (
        <MeasurementForm
          patient={measurementPatient}
          onSave={handleSaveMeasurement}
          onCancel={() => setMeasurementPatient(null)}
        />
      )}

      {weightPatient && (
        <WeightForm
          patient={weightPatient}
          onSave={handleSaveWeight}
          onCancel={() => setWeightPatient(null)}
        />
      )}

      {patientOverlay?.screen === 'list' && (
        <PatientList
          patients={patients}
          onAdd={openAddPatient}
          onEdit={openEditPatient}
          onDelete={handleDeletePatient}
          onClose={() => setPatientOverlay(null)}
        />
      )}

      {patientOverlay?.screen === 'form' && (
        <AddEditPatient
          patient={patientOverlay.patient}
          onSave={handleSavePatient}
          onCancel={closePatientForm}
        />
      )}
    </div>
  );
}
