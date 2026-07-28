import { useMemo, useState } from 'react';
import ModalShell from '../Shared/ModalShell';
import { getPatientInitial } from '../../lib/utils';

export default function HistoryList({ title, patients, records, formatValue, onEdit, onDelete, onClose }) {
  const [patientFilter, setPatientFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const patientsById = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => map.set(p.id, p));
    return map;
  }, [patients]);

  const filtered = useMemo(() => {
    const fromTime = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toTime = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return records
      .filter((record) => (patientFilter === 'all' ? true : record.patientId === patientFilter))
      .filter((record) => (fromTime ? record.timestamp >= fromTime : true))
      .filter((record) => (toTime ? record.timestamp <= toTime : true))
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [records, patientFilter, fromDate, toDate]);

  const confirmDelete = () => {
    onDelete(pendingDelete);
    setPendingDelete(null);
  };

  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="min-h-touch px-3 py-2 text-lg border border-gray-300 rounded-lg flex-1"
          >
            <option value="all">كل المرضى</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.emoji ? `${patient.emoji} ` : ''}{patient.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="من تاريخ"
            className="min-h-touch px-3 py-2 text-lg border border-gray-300 rounded-lg flex-1"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="إلى تاريخ"
            className="min-h-touch px-3 py-2 text-lg border border-gray-300 rounded-lg flex-1"
          />
        </div>

        {filtered.length === 0 && (
          <p className="text-lg text-gray-600 text-center mt-8">لا توجد سجلات مطابقة</p>
        )}

        {filtered.map((record) => {
          const patient = patientsById.get(record.patientId);
          return (
            <div
              key={record.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
            >
              <div className="text-2xl flex-shrink-0">
                {patient ? patient.emoji || getPatientInitial(patient.name) : '❓'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-medium text-gray-900 truncate">
                  {patient?.name || 'مريض محذوف'}
                </p>
                <p className="text-base text-gray-600">
                  {formatValue(record)} · {new Date(record.timestamp).toLocaleString('ar-EG')}
                </p>
              </div>
              <button
                onClick={() => onEdit(record)}
                aria-label="تعديل السجل"
                className="min-h-touch min-w-touch text-2xl text-gray-500 hover:text-gray-800"
              >
                ✏️
              </button>
              <button
                onClick={() => setPendingDelete(record)}
                aria-label="حذف السجل"
                className="min-h-touch min-w-touch text-2xl text-danger hover:opacity-75"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <p className="text-lg text-gray-900 text-center">هل أنت متأكد من حذف هذا السجل؟</p>
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
    </ModalShell>
  );
}
