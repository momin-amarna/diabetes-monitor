import { useState } from 'react';
import ColorPicker from './ColorPicker';
import ModalShell from '../Shared/ModalShell';
import { validatePatient } from '../../lib/validation';

const EMOJI_OPTIONS = ['👨', '👩', '👴', '👵', '🧑', '👦', '👧', '👶', '🧓', '👨‍🦳', '👩‍🦳', '🧔'];

export default function AddEditPatient({ patient, onSave, onCancel }) {
  const [name, setName] = useState(patient?.name || '');
  const [emoji, setEmoji] = useState(patient?.emoji || '');
  const [color, setColor] = useState(patient?.color || '');
  const [error, setError] = useState('');

  const isEditing = Boolean(patient);

  const handleSave = () => {
    const { valid, errors } = validatePatient({ name, emoji, color });
    if (!valid) {
      setError(errors.name || errors.emoji || errors.color);
      return;
    }
    setError('');
    onSave({ name: name.trim(), emoji, color });
  };

  return (
    <ModalShell
      title={isEditing ? 'تعديل مريض' : 'إضافة مريض'}
      onClose={onCancel}
      closeLabel="إلغاء"
      footer={
        <>
          <button
            onClick={onCancel}
            className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
              text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="flex-1 min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-lg
              text-lg font-medium transition-colors duration-200"
          >
            حفظ
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6 px-6 py-8">
        <div>
          <label htmlFor="patient-name" className="block text-lg text-gray-600 mb-2">
            الاسم
          </label>
          <input
            id="patient-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المريض"
            className="w-full min-h-touch px-4 py-3 text-lg border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <p className="text-lg text-gray-600 mb-2">الرمز</p>
          <div className="grid grid-cols-4 gap-3">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmoji(option)}
                aria-pressed={emoji === option}
                className={`min-h-touch min-w-touch text-3xl rounded-lg border-2 ${
                  emoji === option ? 'border-green-600 bg-green-50' : 'border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-lg text-gray-600 mb-2">اللون</p>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {error && (
          <p className="text-danger text-base" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalShell>
  );
}
