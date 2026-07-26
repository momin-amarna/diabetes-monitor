export default function Spinner({ label, value, onChange, min, max }) {
  const step = (delta) => {
    let next = value + delta;
    if (next > max) next = min;
    if (next < min) next = max;
    onChange(next);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-base text-gray-600">{label}</span>
      <button
        type="button"
        onClick={() => step(1)}
        className="min-h-touch min-w-touch bg-gray-100 rounded-lg text-xl hover:bg-gray-200"
      >
        ▲
      </button>
      <span className="text-2xl font-bold w-12 text-center">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        className="min-h-touch min-w-touch bg-gray-100 rounded-lg text-xl hover:bg-gray-200"
      >
        ▼
      </button>
    </div>
  );
}
