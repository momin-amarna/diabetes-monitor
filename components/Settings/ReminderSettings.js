import { WEEKDAYS, WEEKDAY_LABELS } from '../../lib/reminders';

export default function ReminderSettings({ reminderDay, reminderTime, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-gray-900">تذكير أسبوعي بالوزن</h3>
      <div className="flex gap-3">
        <select
          value={reminderDay || ''}
          onChange={(e) => onChange({ reminderDay: e.target.value || null })}
          className="min-h-touch px-3 py-2 text-lg border border-gray-300 rounded-lg flex-1"
        >
          <option value="">بدون تذكير</option>
          {WEEKDAYS.map((day) => (
            <option key={day} value={day}>
              {WEEKDAY_LABELS[day]}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={reminderTime || '09:00'}
          onChange={(e) => onChange({ reminderTime: e.target.value })}
          disabled={!reminderDay}
          className="min-h-touch px-3 py-2 text-lg border border-gray-300 rounded-lg flex-1 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
