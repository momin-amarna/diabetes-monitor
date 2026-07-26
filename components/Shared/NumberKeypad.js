export default function NumberKeypad({ value, onChange, maxLength = 3, allowDecimal = false }) {
  const press = (digit) => {
    if (value.length >= maxLength) return;
    if (digit === '.' && value.includes('.')) return;
    onChange(value + digit);
  };

  const backspace = () => onChange(value.slice(0, -1));

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => press(digit)}
          className="min-h-touch bg-white border border-gray-300 rounded-lg text-2xl font-medium
            hover:bg-gray-50 active:bg-gray-100"
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        onClick={backspace}
        className="min-h-touch bg-gray-100 border border-gray-300 rounded-lg text-2xl
          hover:bg-gray-200"
      >
        ⌫
      </button>
      <button
        type="button"
        onClick={() => press('0')}
        className="min-h-touch bg-white border border-gray-300 rounded-lg text-2xl font-medium
          hover:bg-gray-50 active:bg-gray-100"
      >
        0
      </button>
      {allowDecimal ? (
        <button
          type="button"
          onClick={() => press('.')}
          className="min-h-touch bg-white border border-gray-300 rounded-lg text-2xl font-medium
            hover:bg-gray-50 active:bg-gray-100"
        >
          .
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onChange('')}
          className="min-h-touch bg-gray-100 border border-gray-300 rounded-lg text-lg
            hover:bg-gray-200"
        >
          مسح
        </button>
      )}
    </div>
  );
}
