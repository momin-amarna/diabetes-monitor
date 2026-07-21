import { useState } from 'react';

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

export default function MeasurementForm({ patient, onCancel }) {
  const [step, setStep] = useState(1);
  const [reading, setReading] = useState('');
  const [fastingHours, setFastingHours] = useState('');

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
