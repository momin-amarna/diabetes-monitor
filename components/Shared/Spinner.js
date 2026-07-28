export default function Spinner({ label, value, onChange, min, max }) {
  const step = (delta) => {
    let next = value + delta;
    if (next > max) next = min;
    if (next < min) next = max;
    onChange(next);
  };

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <span className="text-base sm:text-lg text-gray-600">{label}</span>
      <button
        type="button"
        onClick={() => step(1)}
        className="h-11 w-11 sm:h-16 sm:w-16 bg-gray-100 rounded-2xl text-xl sm:text-3xl shadow-sm
          hover:bg-gray-200 active:scale-95 transition-transform duration-150"
      >
        ▲
      </button>
      <span className="text-3xl sm:text-5xl font-bold w-14 sm:w-20 text-center">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => step(-1)}
        className="h-11 w-11 sm:h-16 sm:w-16 bg-gray-100 rounded-2xl text-xl sm:text-3xl shadow-sm
          hover:bg-gray-200 active:scale-95 transition-transform duration-150"
      >
        ▼
      </button>
    </div>
  );
}
