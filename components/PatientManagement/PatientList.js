import { useState } from 'react';

export default function PatientList({ patients, onAdd, onEdit, onDelete, onClose }) {
  const [pendingDelete, setPendingDelete] = useState(null);

  const confirmDelete = () => {
    onDelete(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="min-h-touch min-w-touch text-2xl text-gray-500"
          aria-label="إغلاق"
        >
          ✕
        </button>
        <h2 className="text-subheading font-bold text-gray-900">إدارة المرضى</h2>
        <span className="w-touch" />
      </header>

      <main className="flex-1 flex flex-col gap-3 px-4 py-4 overflow-y-auto">
        {patients.length === 0 && (
          <p className="text-lg text-gray-600 text-center mt-8">لا يوجد مرضى بعد</p>
        )}

        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl text-white flex-shrink-0"
              style={{ backgroundColor: patient.color }}
            >
              {patient.emoji}
            </div>
            <span className="flex-1 text-lg font-medium text-gray-900 truncate">
              {patient.name}
            </span>
            <button
              onClick={() => onEdit(patient)}
              aria-label={`تعديل ${patient.name}`}
              className="min-h-touch min-w-touch text-2xl text-gray-500 hover:text-gray-800"
            >
              ✏️
            </button>
            <button
              onClick={() => setPendingDelete(patient)}
              aria-label={`حذف ${patient.name}`}
              className="min-h-touch min-w-touch text-2xl text-danger hover:opacity-75"
            >
              🗑️
            </button>
          </div>
        ))}
      </main>

      <footer className="px-6 py-4 border-t border-gray-200">
        <button
          onClick={onAdd}
          className="w-full min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-lg
            text-lg font-medium transition-colors duration-200"
        >
          + إضافة مريض
        </button>
      </footer>

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <p className="text-lg text-gray-900 text-center">
              هل أنت متأكد من حذف {pendingDelete.name}؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
                  text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 min-h-touch bg-danger hover:opacity-90 text-white rounded-lg
                  text-lg font-medium transition-colors duration-200"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
