import { useState } from 'react';
import { validateWeight } from '../../lib/validation';
import { daysInMonth } from '../../lib/utils';
import ModalShell from '../Shared/ModalShell';
import NumberKeypad from '../Shared/NumberKeypad';
import Spinner from '../Shared/Spinner';

export default function WeightForm({ patient, initialData, onSave, onCancel }) {
  const isEdit = Boolean(initialData);
  const now = new Date();
  const initialDate = initialData ? new Date(initialData.timestamp) : now;
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState(initialData ? String(initialData.weight) : '');
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [year, setYear] = useState(initialDate.getFullYear());
  const [error, setError] = useState('');

  const clampDay = (newMonth, newYear) => {
    setDay((currentDay) => Math.min(currentDay, daysInMonth(newMonth, newYear)));
  };

  const handleMonthChange = (newMonth) => {
    setMonth(newMonth);
    clampDay(newMonth, year);
  };

  const handleYearChange = (newYear) => {
    setYear(newYear);
    clampDay(month, newYear);
  };

  const goNext = () => {
    setError('');

    if (step === 1) {
      const { valid, errors } = validateWeight({ weight });
      if (!valid) {
        setError(errors.weight);
        return;
      }
      setStep(2);
    }
  };

  const goBack = () => {
    setError('');
    setStep(1);
  };

  const getTimestamp = () =>
    new Date(year, month - 1, day, initialDate.getHours(), initialDate.getMinutes()).getTime();

  const handleConfirm = () => {
    onSave({
      ...(isEdit ? { id: initialData.id } : {}),
      patientId: patient.id,
      weight: Number(weight),
      timestamp: getTimestamp(),
    });
  };

  return (
    <ModalShell
      title={isEdit ? `تعديل الوزن · ${patient.name}` : `وزن جديد · ${patient.name}`}
      onClose={onCancel}
      closeLabel="إلغاء"
      footer={
        <>
          {step > 1 && (
            <button
              onClick={goBack}
              className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
                text-gray-700 hover:bg-gray-50"
            >
              رجوع
            </button>
          )}
          {step < 2 ? (
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
        </>
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-8 min-h-full">
        {step === 1 && (
          <>
            <p className="text-lg text-gray-600">أدخل الوزن (كجم)</p>
            <p className="text-6xl font-bold text-gray-900 min-h-[4rem]">{weight || '—'}</p>
            <NumberKeypad value={weight} onChange={setWeight} maxLength={5} allowDecimal />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-lg text-gray-600">تاريخ الوزن</p>
            <div className="flex gap-4">
              <Spinner label="اليوم" value={day} onChange={setDay} min={1} max={daysInMonth(month, year)} />
              <Spinner label="الشهر" value={month} onChange={handleMonthChange} min={1} max={12} />
              <Spinner
                label="السنة"
                value={year}
                onChange={handleYearChange}
                min={now.getFullYear() - 100}
                max={now.getFullYear()}
              />
            </div>
          </>
        )}

        {error && (
          <p className="text-danger text-base" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
