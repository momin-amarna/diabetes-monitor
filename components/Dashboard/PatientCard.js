import { formatTimeAgo } from '../../lib/utils';

export default function PatientCard({ patient, lastMeasurement, onTap, onNewMeasurement }) {
  return (
    <div
      onClick={() => onTap && onTap(patient)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onTap) onTap(patient);
      }}
      className="rounded-2xl p-5 text-white shadow-md cursor-pointer select-none"
      style={{
        background: `linear-gradient(135deg, ${patient.color}, ${patient.color}cc)`,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="text-5xl">{patient.emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-subheading font-bold truncate">{patient.name}</h3>
          {lastMeasurement ? (
            <p className="text-base opacity-90">
              {lastMeasurement.reading} mg/dL · {formatTimeAgo(lastMeasurement.timestamp)}
            </p>
          ) : (
            <p className="text-base opacity-90">لا توجد قراءات بعد</p>
          )}
        </div>
      </div>

      {onNewMeasurement && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewMeasurement(patient);
          }}
          className="w-full min-h-touch mt-4 bg-white/20 hover:bg-white/30 rounded-lg
            font-medium text-lg transition-colors duration-200"
        >
          + قراءة جديدة
        </button>
      )}
    </div>
  );
}
