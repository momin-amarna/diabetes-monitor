import { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import PatientCard from '../components/Dashboard/PatientCard';
import EmptyState from '../components/Dashboard/EmptyState';
import TabNavigation from '../components/Dashboard/TabNavigation';
import MeasurementForm from '../components/Dashboard/MeasurementForm';
import WeightForm from '../components/Dashboard/WeightForm';
import HistoryList from '../components/Dashboard/HistoryList';
import AIInsights from '../components/Dashboard/AIInsights';
import PatientList from '../components/PatientManagement/PatientList';
import AddEditPatient from '../components/PatientManagement/AddEditPatient';
import SettingsPage from '../components/Settings/SettingsPage';
import { userStorage, patientStorage, measurementStorage, weightStorage, settingsStorage } from '../lib/storage';
import { createMeasurement, createWeightRecord, createPatient, createSettings } from '../lib/models';
import { shouldShowReminderBanner, dismissReminderForToday } from '../lib/reminders';

const FONT_SIZE_CLASSES = { normal: '', large: 'text-lg', xlarge: 'text-xl' };
const SPACING_CLASSES = { normal: '', large: 'space-y-2', xlarge: 'space-y-4' };
const HIGH_CONTRAST_CLASSES = 'bg-black text-white';

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
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [weightPatient, setWeightPatient] = useState(null);
  const [editingWeight, setEditingWeight] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncError, setSyncError] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [settings, setSettings] = useState(createSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  // Which patient-management overlay is open, if any:
  //   null                                        — none
  //   { screen: 'list' }                           — the manage-patients list
  //   { screen: 'form', mode, patient, returnToList } — add/edit form
  const [patientOverlay, setPatientOverlay] = useState(null);

  const loadSettings = () => {
    let stored = settingsStorage.get();
    if (!stored) {
      stored = createSettings();
      settingsStorage.save(stored);
    }
    setSettings(stored);
    setShowReminder(shouldShowReminderBanner(stored));
    return stored;
  };

  useEffect(() => {
    const storedEmail = userStorage.getEmail();
    if (storedEmail) {
      patientStorage.seedDefaults();
      setPatients(patientStorage.getActive());
      setEmail(storedEmail);
      loadSettings();
    }
    setReady(true);
  }, []);

  const handleLogin = (loggedInEmail) => {
    patientStorage.seedDefaults();
    setPatients(patientStorage.getActive());
    setEmail(loggedInEmail);
    loadSettings();
  };

  const handleLogout = () => {
    userStorage.clearEmail();
    setEmail(null);
    setPatients([]);
  };

  const handleUpdateSettings = (changes) => {
    const updated = settingsStorage.update(changes);
    if (updated) setSettings(updated);
  };

  const handleDismissReminder = () => {
    dismissReminderForToday();
    setShowReminder(false);
  };

  const handleSaveMeasurement = async (data) => {
    const isEdit = Boolean(data.id);
    const measurement = isEdit
      ? { ...editingMeasurement, ...data }
      : createMeasurement(data.patientId, data.reading, data.fastingHours, data.timestamp, data.notes);

    measurementStorage.save(measurement);
    setAiInsight({ patient: measurementPatient, measurement });
    setMeasurementPatient(null);
    setEditingMeasurement(null);
    setRefreshKey((key) => key + 1);
    setSyncError(null);

    try {
      await postJson(isEdit ? '/api/measurements/edit' : '/api/measurements/add', measurement);
    } catch (error) {
      console.error('Measurement sync failed:', error);
      setSyncError('تعذر مزامنة القراءة مع الخادم، لكن تم حفظها على جهازك.');
    }
  };

  const handleSaveWeight = async (data) => {
    const isEdit = Boolean(data.id);
    const weightRecord = isEdit
      ? { ...editingWeight, ...data }
      : createWeightRecord(data.patientId, data.weight, data.timestamp);

    weightStorage.save(weightRecord);
    setWeightPatient(null);
    setEditingWeight(null);
    setRefreshKey((key) => key + 1);
    setSyncError(null);

    try {
      await postJson(isEdit ? '/api/weights/edit' : '/api/weights/add', weightRecord);
    } catch (error) {
      console.error('Weight sync failed:', error);
      setSyncError('تعذر مزامنة الوزن مع الخادم، لكن تم حفظه على جهازك.');
    }
  };

  const handleDeleteMeasurement = async (record) => {
    measurementStorage.delete(record.id);
    setRefreshKey((key) => key + 1);
    setSyncError(null);

    try {
      await postJson('/api/measurements/delete', { id: record.id });
    } catch (error) {
      console.error('Measurement delete sync failed:', error);
      setSyncError('تعذر مزامنة الحذف مع الخادم، لكن تم حذفه من جهازك.');
    }
  };

  const handleDeleteWeight = async (record) => {
    weightStorage.delete(record.id);
    setRefreshKey((key) => key + 1);
    setSyncError(null);

    try {
      await postJson('/api/weights/delete', { id: record.id });
    } catch (error) {
      console.error('Weight delete sync failed:', error);
      setSyncError('تعذر مزامنة الحذف مع الخادم، لكن تم حذفه من جهازك.');
    }
  };

  const openEditMeasurement = (record) => {
    const patient = patientStorage.getById(record.patientId);
    setEditingMeasurement(record);
    setMeasurementPatient(patient || { id: record.patientId, name: 'مريض محذوف', emoji: '❓', color: '#6b7280' });
    setShowHistory(false);
  };

  const openEditWeight = (record) => {
    const patient = patientStorage.getById(record.patientId);
    setEditingWeight(record);
    setWeightPatient(patient || { id: record.patientId, name: 'مريض محذوف', emoji: '❓', color: '#6b7280' });
    setShowHistory(false);
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

  const rootClassName = [
    'min-h-screen',
    settings.highContrast ? HIGH_CONTRAST_CLASSES : 'bg-bg-light',
    FONT_SIZE_CLASSES[settings.fontSize] || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <header className="flex items-center justify-between px-6 py-5 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-subheading font-bold text-gray-900">مراقب السكري الذكي</h1>
        <div className="flex items-center gap-4">
          {activeTab !== 'statistics' && (
            <button
              onClick={() => setShowHistory(true)}
              aria-label="سجل القراءات"
              className="min-h-touch min-w-touch text-2xl text-gray-600 hover:text-gray-900"
            >
              📋
            </button>
          )}
          <button
            onClick={openPatientList}
            aria-label="إدارة المرضى"
            className="min-h-touch min-w-touch text-2xl text-gray-600 hover:text-gray-900"
          >
            👥
          </button>
          <button
            onClick={() => setShowSettings(true)}
            aria-label="الإعدادات"
            className="min-h-touch min-w-touch text-2xl text-gray-600 hover:text-gray-900"
          >
            ⚙️
          </button>
          <button
            onClick={handleLogout}
            className="min-h-touch px-4 text-base text-gray-600 hover:text-gray-900"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {showReminder && (
        <div className="flex items-center justify-between gap-3 bg-blue-50 border-b border-blue-200 px-4 py-2">
          <p className="text-base text-blue-800">تذكير: حان وقت تسجيل الوزن الأسبوعي 🗓️</p>
          <button
            onClick={handleDismissReminder}
            aria-label="إغلاق"
            className="min-h-touch min-w-touch text-xl text-blue-800"
          >
            ✕
          </button>
        </div>
      )}

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

      {aiInsight && (
        <AIInsights
          patient={aiInsight.patient}
          measurement={aiInsight.measurement}
          onDismiss={() => setAiInsight(null)}
        />
      )}

      <TabNavigation onTabChange={setActiveTab} />

      <main className={`p-4 flex flex-col gap-4 ${SPACING_CLASSES[settings.spacing] || ''}`}>
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
          initialData={editingMeasurement}
          onSave={handleSaveMeasurement}
          onCancel={() => {
            setMeasurementPatient(null);
            setEditingMeasurement(null);
          }}
        />
      )}

      {weightPatient && (
        <WeightForm
          patient={weightPatient}
          initialData={editingWeight}
          onSave={handleSaveWeight}
          onCancel={() => {
            setWeightPatient(null);
            setEditingWeight(null);
          }}
        />
      )}

      {showHistory && activeTab === 'weight' && (
        <HistoryList
          title="سجل الوزن"
          patients={patients}
          records={weightStorage.getAll()}
          formatValue={(record) => `${record.weight} كجم`}
          onEdit={openEditWeight}
          onDelete={handleDeleteWeight}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showHistory && activeTab !== 'weight' && activeTab !== 'statistics' && (
        <HistoryList
          title="سجل القراءات"
          patients={patients}
          records={measurementStorage.getAll()}
          formatValue={(record) => `${record.reading} mg/dL · صيام ${record.fastingHours} س`}
          onEdit={openEditMeasurement}
          onDelete={handleDeleteMeasurement}
          onClose={() => setShowHistory(false)}
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

      {showSettings && (
        <SettingsPage
          settings={settings}
          email={email}
          onUpdate={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
