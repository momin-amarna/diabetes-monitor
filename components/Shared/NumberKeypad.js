export default function NumberKeypad({ value, onChange, maxLength = 3, allowDecimal = false }) {
  const press = (digit) => {
    if (value.length >= maxLength) return;
    if (digit === '.' && value.includes('.')) return;
    onChange(value + digit);
  };

  const backspace = () => onChange(value.slice(0, -1));

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => press(digit)}
          className="min-h-[96px] bg-white border-2 border-gray-200 rounded-2xl text-4xl font-semibold
            shadow-sm hover:bg-gray-50 active:scale-95 active:bg-gray-100 transition-transform duration-150"
        >
          {digit}
        </button>
      ))}
      <button
        type="button"
        onClick={backspace}
        className="min-h-[96px] bg-gray-100 border-2 border-gray-200 rounded-2xl text-4xl
          shadow-sm hover:bg-gray-200 active:scale-95 transition-transform duration-150"
      >
        ⌫
      </button>
      <button
        type="button"
        onClick={() => press('0')}
        className="min-h-[96px] bg-white border-2 border-gray-200 rounded-2xl text-4xl font-semibold
          shadow-sm hover:bg-gray-50 active:scale-95 active:bg-gray-100 transition-transform duration-150"
      >
        0
      </button>
      {allowDecimal ? (
        <button
          type="button"
          onClick={() => press('.')}
          className="min-h-[96px] bg-white border-2 border-gray-200 rounded-2xl text-4xl font-semibold
            shadow-sm hover:bg-gray-50 active:scale-95 active:bg-gray-100 transition-transform duration-150"
        >
          .
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onChange('')}
          className="min-h-[96px] bg-gray-100 border-2 border-gray-200 rounded-2xl text-2xl
            shadow-sm hover:bg-gray-200 active:scale-95 transition-transform duration-150"
        >
          مسح
        </button>
      )}
    </div>
  );
}
