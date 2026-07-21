import { useState } from 'react';
import { settingsStorage } from '../../lib/storage';
import { createSettings } from '../../lib/models';
import { validateMeasurement } from '../../lib/validation';

const DAYS_IN_MONTH = (month, year) => new Date(year, month, 0).getDate();

function NumberKeypad({ value, onChange, maxLength = 3 }) {
  const press = (digit) => {
    if (value.length >= maxLength) return;
    onChange(value + digit);
  };

  const backspace = () => onChange(value.slice(0, -1));

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => press(digit)}
          className="min-h-touch bg-white border border-gray-300 rounded-lg text-2xl font-medium
            hover:bg-gray-50 active:bg-gray-100"
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        onClick={backspace}
        className="min-h-touch bg-gray-100 border border-gray-300 rounded-lg text-2xl
          hover:bg-gray-200"
      >
        ⌫
      </button>
      <button
        type="button"
        onClick={() => press('0')}
        className="min-h-touch bg-white border border-gray-300 rounded-lg text-2xl font-medium
          hover:bg-gray-50 active:bg-gray-100"
      >
        0
      </button>
      <button
        type="button"
        onClick={() => onChange('')}
        className="min-h-touch bg-gray-100 border border-gray-300 rounded-lg text-lg
          hover:bg-gray-200"
      >
        مسح
      </button>
    </div>
  );
}

function Spinner({ label, value, onChange, min, max }) {
  const step = (delta) => {
    let next = value + delta;
    if (next > max) next = min;
    if (next < min) next = max;
    onChange(next);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-base text-gray-600">{label}</span>
      <button
        type="button"
        onClick={() => step(1)}
        className="min-h-touch min-w-touch bg-gray-100 rounded-lg text-xl hover:bg-gray-200"
      >
        ▲
      </button>
      <span className="text-2xl font-bold w-12 text-center">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        className="min-h-touch min-w-touch bg-gray-100 rounded-lg text-xl hover:bg-gray-200"
      >
        ▼
      </button>
    </div>
  );
}

export default function MeasurementForm({ patient, onSave, onCancel }) {
  const settings = settingsStorage.get() || createSettings();

  const now = new Date();
  const [step, setStep] = useState(1);
  const [reading, setReading] = useState('');
  const [fastingHours, setFastingHours] = useState('');
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());
  const [manualTime, setManualTime] = useState(
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  );
  const [wantsNotes, setWantsNotes] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const year = now.getFullYear();

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    setDay((currentDay) => Math.min(currentDay, DAYS_IN_MONTH(newMonth, year)));
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

  const getTimestamp = () => {
    if (settings.timeInputMethod === 'manual') {
      const [h, m] = manualTime.split(':').map(Number);
      return new Date(year, month - 1, day, h || 0, m || 0).getTime();
    }
    return new Date(year, month - 1, day, hour, minute).getTime();
  };

  const handleConfirm = () => {
    const measurement = {
      patientId: patient.id,
      reading: Number(reading),
      fastingHours: Number(fastingHours),
      timestamp: getTimestamp(),
      notes: wantsNotes ? notes.trim() : '',
    };
    onSave(measurement);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onCancel}
          className="min-h-touch min-w-touch text-2xl text-gray-500"
          aria-label="إلغاء"
        >
          ✕
        </button>
        <h2 className="text-subheading font-bold text-gray-900">
          قراءة جديدة · {patient.name}
        </h2>
        <span className="w-touch" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-8 overflow-y-auto">
        {step === 1 && (
          <>
            <p className="text-lg text-gray-600">أدخل قراءة السكر (mg/dL)</p>
            <p className="text-6xl font-bold text-gray-900 min-h-[4rem]">{reading || '—'}</p>
            <NumberKeypad value={reading} onChange={setReading} maxLength={3} />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-lg text-gray-600">كم عدد ساعات الصيام؟</p>
            <p className="text-6xl font-bold text-gray-900 min-h-[4rem]">{fastingHours || '—'}</p>
            <NumberKeypad value={fastingHours} onChange={setFastingHours} maxLength={2} />
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-lg text-gray-600">تاريخ ووقت القراءة</p>
            <div className="flex gap-4">
              <Spinner label="اليوم" value={day} onChange={setDay} min={1} max={DAYS_IN_MONTH(month, year)} />
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
                className="min-h-touch px-4 py-2 text-2xl border border-gray-300 rounded-lg text-center"
              />
            )}
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-lg text-gray-600">هل تريد إضافة ملاحظات؟</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWantsNotes(true)}
                className={`min-h-touch px-8 rounded-lg text-lg font-medium border-2 ${
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
                className={`min-h-touch px-8 rounded-lg text-lg font-medium border-2 ${
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
                className="w-full max-w-sm px-4 py-3 text-lg border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            )}
          </>
        )}

        {step === 5 && (
          <div className="w-full max-w-sm flex flex-col gap-3">
            <h3 className="text-subheading font-bold text-gray-900 text-center mb-2">ملخص القراءة</h3>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">القراءة</span>
              <span className="font-bold">{reading} mg/dL</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">ساعات الصيام</span>
              <span className="font-bold">{fastingHours}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">التاريخ والوقت</span>
              <span className="font-bold">
                {new Date(getTimestamp()).toLocaleString('ar-EG')}
              </span>
            </div>
            {wantsNotes && notes && (
              <div className="text-lg">
                <span className="text-gray-600 block mb-1">ملاحظات</span>
                <p className="font-medium">{notes}</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-danger text-base" role="alert">
            {error}
          </p>
        )}
      </main>

      <footer className="flex gap-3 px-6 py-4 border-t border-gray-200">
        {step > 1 && (
          <button
            onClick={goBack}
            className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
              text-gray-700 hover:bg-gray-50"
          >
            رجوع
          </button>
        )}
        {step < 5 ? (
          <button
            onClick={goNext}
            className="flex-1 min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-lg
              text-lg font-medium transition-colors duration-200"
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="flex-1 min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-lg
              text-lg font-medium transition-colors duration-200"
          >
            تأكيد
          </button>
        )}
      </footer>
    </div>
  );
}
