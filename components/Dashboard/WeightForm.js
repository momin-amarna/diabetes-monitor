import { useState } from 'react';
import { validateWeight } from '../../lib/validation';
import ModalShell from '../Shared/ModalShell';
import NumberKeypad from '../Shared/NumberKeypad';

export default function WeightForm({ patient, onSave, onCancel }) {
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

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
    onSave({ patientId: patient.id, weight: Number(weight), timestamp: Date.now() });
  };

  return (
    <ModalShell
      title={`وزن جديد · ${patient.name}`}
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

        {error && (
          <p className="text-danger text-base" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
