import { useState } from 'react';
import ModalShell from '../Shared/ModalShell';
import ReminderSettings from './ReminderSettings';
import BackupRestore from './BackupRestore';
import { storage } from '../../lib/storage';

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 min-h-touch px-3 rounded-lg text-base font-medium border-2 ${
            value === option.value
              ? 'border-green-600 bg-green-50 text-green-700'
              : 'border-gray-300 text-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3 pb-6 border-b border-gray-200">
      {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
      {children}
    </div>
  );
}

export default function SettingsPage({ settings, email, onUpdate, onClose, onLogout }) {
  const [pendingClear, setPendingClear] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying email:', error);
    }
  };

  const handleClearData = () => {
    storage.clear();
    setPendingClear(false);
    onLogout();
  };

  return (
    <ModalShell title="الإعدادات" onClose={onClose}>
      <div className="flex flex-col gap-6 px-4 py-4">
        <Section title="شاشة القراءة">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">إظهار خطوة الملاحظات</span>
            <SegmentedControl
              value={settings.showNotes}
              onChange={(value) => onUpdate({ showNotes: value })}
              options={[
                { value: true, label: 'نعم' },
                { value: false, label: 'لا' },
              ]}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">إدخال الوقت</span>
            <SegmentedControl
              value={settings.timeInputMethod}
              onChange={(value) => onUpdate({ timeInputMethod: value })}
              options={[
                { value: 'arrows', label: 'أسهم' },
                { value: 'manual', label: 'يدوي' },
              ]}
            />
          </div>
        </Section>

        <Section title="المظهر">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">حجم الخط</span>
            <SegmentedControl
              value={settings.fontSize}
              onChange={(value) => onUpdate({ fontSize: value })}
              options={[
                { value: 'normal', label: 'عادي' },
                { value: 'large', label: 'كبير' },
                { value: 'xlarge', label: 'أكبر' },
              ]}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">التباعد</span>
            <SegmentedControl
              value={settings.spacing}
              onChange={(value) => onUpdate({ spacing: value })}
              options={[
                { value: 'normal', label: 'عادي' },
                { value: 'large', label: 'كبير' },
                { value: 'xlarge', label: 'أكبر' },
              ]}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">تباين عالٍ</span>
            <SegmentedControl
              value={settings.highContrast}
              onChange={(value) => onUpdate({ highContrast: value })}
              options={[
                { value: true, label: 'نعم' },
                { value: false, label: 'لا' },
              ]}
            />
          </div>
        </Section>

        <Section title="الصفحة الرئيسية">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700">إخفاء زر الصفحة الرئيسية</span>
            <SegmentedControl
              value={settings.hideLandingButton}
              onChange={(value) => onUpdate({ hideLandingButton: value })}
              options={[
                { value: true, label: 'نعم' },
                { value: false, label: 'لا' },
              ]}
            />
          </div>
        </Section>

        <Section>
          <ReminderSettings
            reminderDay={settings.reminderDay}
            reminderTime={settings.reminderTime}
            onChange={onUpdate}
          />
        </Section>

        <Section>
          <BackupRestore onRestored={onClose} />
        </Section>

        <Section title="البيانات">
          <button
            onClick={() => setPendingClear(true)}
            className="min-h-touch border-2 border-danger text-danger rounded-lg text-lg font-medium hover:bg-red-50"
          >
            حذف كل البيانات
          </button>
        </Section>

        <Section title="الحساب">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base text-gray-700 truncate">{email}</span>
            <button
              onClick={handleCopyEmail}
              className="min-h-touch px-4 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              {copied ? 'تم النسخ' : 'نسخ'}
            </button>
          </div>
          <button
            onClick={onLogout}
            className="min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            تسجيل الخروج
          </button>
        </Section>
      </div>

      {pendingClear && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
            <p className="text-lg text-gray-900 text-center">
              هل أنت متأكد من حذف كل البيانات؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPendingClear(false)}
                className="flex-1 min-h-touch border-2 border-gray-300 rounded-lg text-lg font-medium
                  text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleClearData}
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
