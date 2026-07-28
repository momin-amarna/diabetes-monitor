import { useState } from 'react';
import { validateWeight } from '../../lib/validation';
import { daysInMonth, isFutureTimestamp } from '../../lib/utils';
import ModalShell from '../Shared/ModalShell';
import NumberKeypad from '../Shared/NumberKeypad';
import Spinner from '../Shared/Spinner';
import StepButtons from '../Shared/StepButtons';

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

  const getTimestamp = () =>
    new Date(year, month - 1, day, initialDate.getHours(), initialDate.getMinutes()).getTime();

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

  const handleConfirm = () => {
    if (isFutureTimestamp(getTimestamp())) {
      setError('لا يمكن اختيار تاريخ في المستقبل');
      return;
    }

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
    >
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-8 px-4 py-6 sm:px-6 sm:py-10 min-h-full">
        {step === 1 && (
          <>
            <p className="text-lg sm:text-2xl text-gray-600">أدخل الوزن (كجم)</p>
            <p className="text-5xl sm:text-7xl font-bold text-gray-900 min-h-[3.5rem] sm:min-h-[5rem]">
              {weight || '—'}
            </p>
            <NumberKeypad value={weight} onChange={setWeight} maxLength={5} allowDecimal />
            <StepButtons showBack={false} onNext={goNext} />
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-lg sm:text-2xl text-gray-600">تاريخ الوزن</p>
            <div className="flex gap-3 sm:gap-8">
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
            <StepButtons showBack onBack={goBack} onNext={handleConfirm} nextLabel="تأكيد" />
          </>
        )}

        {error && (
          <p className="text-danger text-base sm:text-lg" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
