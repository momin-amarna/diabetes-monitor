import { formatTimeAgo, getPatientInitial } from '../../lib/utils';

export default function PatientCard({
  patient,
  lastRecord,
  emptyLabel,
  actionLabel,
  onAction,
  onTap,
}) {
  return (
    <div
      onClick={onTap ? () => onTap(patient) : undefined}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={
        onTap
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onTap(patient);
            }
          : undefined
      }
      className={`rounded-2xl p-5 text-white shadow-md select-none ${onTap ? 'cursor-pointer' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${patient.color}, ${patient.color}cc)`,
      }}
    >
      <div className="flex items-center gap-4">
        {patient.emoji ? (
          <div className="text-5xl">{patient.emoji}</div>
        ) : (
          <div
            className="w-14 h-14 rounded-full bg-white/25 flex items-center justify-center
              text-2xl font-bold flex-shrink-0"
          >
            {getPatientInitial(patient.name)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-subheading font-bold truncate">{patient.name}</h3>
          {lastRecord ? (
            <p className="text-base opacity-90">
              {lastRecord.value}
              {lastRecord.unit ? ` ${lastRecord.unit}` : ''} · {formatTimeAgo(lastRecord.timestamp)}
            </p>
          ) : (
            <p className="text-base opacity-90">{emptyLabel}</p>
          )}
        </div>
      </div>

      {onAction && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction(patient);
          }}
          className="w-full min-h-touch mt-4 bg-white/20 hover:bg-white/30 rounded-lg
            font-medium text-lg transition-colors duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
