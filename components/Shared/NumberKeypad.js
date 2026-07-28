export default function NumberKeypad({ value, onChange, maxLength = 3, allowDecimal = false }) {
  const press = (digit) => {
    if (value.length >= maxLength) return;
    if (digit === '.' && value.includes('.')) return;
    onChange(value + digit);
  };

  const backspace = () => onChange(value.slice(0, -1));

  const baseButtonClass =
    'min-h-[64px] sm:min-h-[96px] border-2 border-gray-200 rounded-2xl shadow-sm ' +
    'active:scale-95 transition-transform duration-150';
  const buttonClass = `${baseButtonClass} bg-white text-2xl sm:text-4xl font-semibold hover:bg-gray-50 active:bg-gray-100`;
  const mutedButtonClass = `${baseButtonClass} bg-gray-100 text-2xl sm:text-4xl hover:bg-gray-200`;
  const clearButtonClass = `${baseButtonClass} bg-gray-100 text-lg sm:text-2xl hover:bg-gray-200`;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button key={digit} type="button" onClick={() => press(digit)} className={buttonClass}>
          {digit}
        </button>
      ))}
      <button type="button" onClick={backspace} className={mutedButtonClass}>
        ⌫
      </button>
      <button type="button" onClick={() => press('0')} className={buttonClass}>
        0
      </button>
      {allowDecimal ? (
        <button type="button" onClick={() => press('.')} className={buttonClass}>
          .
        </button>
      ) : (
        <button type="button" onClick={() => onChange('')} className={clearButtonClass}>
          مسح
        </button>
      )}
    </div>
  );
}
