import { useRef, useState } from 'react';
import { exportData, importData } from '../../lib/storage';

export default function BackupRestore({ onRestored }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartdiabetes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const success = importData(data);
        setMessage(success ? 'تم استعادة البيانات بنجاح' : 'تعذرت استعادة البيانات');
        if (success) onRestored?.();
      } catch (error) {
        console.error('Error parsing backup file:', error);
        setMessage('ملف غير صالح');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-gray-900">النسخ الاحتياطي</h3>
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
            text-gray-700 hover:bg-gray-50"
        >
          تصدير البيانات
        </button>
        <button
          onClick={handleImportClick}
          className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
            text-gray-700 hover:bg-gray-50"
        >
          استيراد البيانات
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {message && <p className="text-base text-gray-600">{message}</p>}
    </div>
  );
}
