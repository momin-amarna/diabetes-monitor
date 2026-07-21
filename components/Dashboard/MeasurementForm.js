import { useState } from 'react';
import { settingsStorage } from '../../lib/storage';
import { createSettings } from '../../lib/models';

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

export default function MeasurementForm({ patient, onCancel }) {
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

  const year = now.getFullYear();

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
              <Spinner label="الشهر" value={month} onChange={setMonth} min={1} max={12} />
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
      </main>

      <footer className="flex gap-3 px-6 py-4 border-t border-gray-200">
        <button
          onClick={() => setStep((s) => s + 1)}
          className="flex-1 min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-lg
            text-lg font-medium transition-colors duration-200"
        >
          التالي
        </button>
      </footer>
    </div>
  );
}
