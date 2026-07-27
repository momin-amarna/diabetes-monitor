import { useState } from 'react';
import { settingsStorage } from '../../lib/storage';
import { createSettings } from '../../lib/models';
import { validateMeasurement } from '../../lib/validation';
import ModalShell from '../Shared/ModalShell';
import NumberKeypad from '../Shared/NumberKeypad';
import Spinner from '../Shared/Spinner';
import StepButtons from '../Shared/StepButtons';
import { daysInMonth, isFutureTimestamp } from '../../lib/utils';

export default function MeasurementForm({ patient, initialData, onSave, onCancel }) {
  const settings = settingsStorage.get() || createSettings();
  const isEdit = Boolean(initialData);

  const now = new Date();
  const initialDate = initialData ? new Date(initialData.timestamp) : now;
  const [step, setStep] = useState(1);
  const [reading, setReading] = useState(initialData ? String(initialData.reading) : '');
  const [fastingHours, setFastingHours] = useState(initialData ? String(initialData.fastingHours) : '');
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(initialDate.getMinutes());
  const [manualTime, setManualTime] = useState(
    `${String(initialDate.getHours()).padStart(2, '0')}:${String(initialDate.getMinutes()).padStart(2, '0')}`
  );
  const [wantsNotes, setWantsNotes] = useState(initialData?.notes ? true : null);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState('');

  const year = initialDate.getFullYear();

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    setDay((currentDay) => Math.min(currentDay, daysInMonth(newMonth, year)));
  };

  const getTimestamp = () => {
    if (settings.timeInputMethod === 'manual') {
      const [h, m] = manualTime.split(':').map(Number);
      return new Date(year, month - 1, day, h || 0, m || 0).getTime();
    }
    return new Date(year, month - 1, day, hour, minute).getTime();
  };

  const goNext = () => {
    setError('');

    if (step === 1) {
      const { valid, errors } = validateMeasurement({ reading, fastingHours: '0' });
      if (!valid && errors.reading) {
        setError(errors.reading);
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const { valid, errors } = validateMeasurement({ reading, fastingHours });
      if (!valid && errors.fastingHours) {
        setError(errors.fastingHours);
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (isFutureTimestamp(getTimestamp())) {
        setError('لا يمكن اختيار تاريخ أو وقت في المستقبل');
        return;
      }
      setStep(settings.showNotes ? 4 : 5);
      return;
    }

    if (step === 4) {
      setStep(5);
    }
  };

  const goBack = () => {
    setError('');
    if (step === 5 && !settings.showNotes) {
      setStep(3);
      return;
    }
    setStep(Math.max(1, step - 1));
  };

  const handleConfirm = () => {
    if (isFutureTimestamp(getTimestamp())) {
      setError('لا يمكن اختيار تاريخ أو وقت في المستقبل');
      setStep(3);
      return;
    }

    const measurement = {
      ...(isEdit ? { id: initialData.id } : {}),
      patientId: patient.id,
      reading: Number(reading),
      fastingHours: Number(fastingHours),
      timestamp: getTimestamp(),
      notes: wantsNotes ? notes.trim() : '',
    };
    onSave(measurement);
  };

  return (
    <ModalShell
      title={isEdit ? `تعديل القراءة · ${patient.name}` : `قراءة جديدة · ${patient.name}`}
      onClose={onCancel}
      closeLabel="إلغاء"
    >
      <div className="flex flex-col items-center justify-center gap-8 px-6 py-10 min-h-full">
        {step === 1 && (
          <>
            <p className="text-2xl text-gray-600">أدخل قراءة السكر (mg/dL)</p>
            <p className="text-7xl font-bold text-gray-900 min-h-[5rem]">{reading || '—'}</p>
            <NumberKeypad value={reading} onChange={setReading} maxLength={3} />
            <StepButtons showBack={false} onNext={goNext} />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-2xl text-gray-600">كم عدد ساعات الصيام؟</p>
            <p className="text-7xl font-bold text-gray-900 min-h-[5rem]">{fastingHours || '—'}</p>
            <NumberKeypad value={fastingHours} onChange={setFastingHours} maxLength={2} />
            <StepButtons showBack onBack={goBack} onNext={goNext} />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-2xl text-gray-600">تاريخ ووقت القراءة</p>
            <div className="flex gap-8">
              <Spinner label="اليوم" value={day} onChange={setDay} min={1} max={daysInMonth(month, year)} />
              <Spinner label="الشهر" value={month} onChange={handleMonthChange} min={1} max={12} />
              {settings.timeInputMethod === 'arrows' && (
                <>
                  <Spinner label="الساعة" value={hour} onChange={setHour} min={0} max={23} />
                  <Spinner label="الدقيقة" value={minute} onChange={setMinute} min={0} max={59} />
                </>
              )}
            </div>
            {settings.timeInputMethod === 'manual' && (
              <input
                type="time"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
                className="min-h-touch px-6 py-3 text-4xl border-2 border-gray-200 rounded-2xl text-center
                  shadow-sm"
              />
            )}
            <StepButtons showBack onBack={goBack} onNext={goNext} />
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-2xl text-gray-600">هل تريد إضافة ملاحظات؟</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWantsNotes(true)}
                className={`min-h-touch px-8 rounded-2xl text-2xl font-medium border-2 transition-colors duration-150 ${
                  wantsNotes === true
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                نعم
              </button>
              <button
                type="button"
                onClick={() => {
                  setWantsNotes(false);
                  setNotes('');
                }}
                className={`min-h-touch px-8 rounded-2xl text-2xl font-medium border-2 transition-colors duration-150 ${
                  wantsNotes === false
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                لا
              </button>
            </div>
            {wantsNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اكتب ملاحظاتك هنا..."
                rows={4}
                className="w-full max-w-sm px-4 py-3 text-xl border-2 border-gray-200 rounded-2xl
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}
            <StepButtons showBack onBack={goBack} onNext={goNext} />
          </>
        )}

        {step === 5 && (
          <div className="w-full max-w-sm flex flex-col gap-6">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">ملخص القراءة</h3>
            <div className="flex justify-between text-2xl">
              <span className="text-gray-600">القراءة</span>
              <span className="font-bold">{reading} mg/dL</span>
            </div>
            <div className="flex justify-between text-2xl">
              <span className="text-gray-600">ساعات الصيام</span>
              <span className="font-bold">{fastingHours}</span>
            </div>
            <div className="flex justify-between text-2xl">
              <span className="text-gray-600">التاريخ والوقت</span>
              <span className="font-bold">
                {new Date(getTimestamp()).toLocaleString('ar-EG')}
              </span>
            </div>
            {wantsNotes && notes && (
              <div className="text-2xl">
                <span className="text-gray-600 block mb-1">ملاحظات</span>
                <p className="font-medium">{notes}</p>
              </div>
            )}
            <StepButtons showBack onBack={goBack} onNext={handleConfirm} nextLabel="تأكيد" />
          </div>
        )}

        {error && (
          <p className="text-danger text-lg" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
