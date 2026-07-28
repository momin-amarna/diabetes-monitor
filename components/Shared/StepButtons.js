export default function StepButtons({ showBack, onBack, onNext, nextLabel = 'التالي' }) {
  return (
    <div className="flex gap-3 w-full max-w-sm mt-4 sm:mt-8">
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 min-h-touch border-2 border-gray-300 rounded-2xl text-lg font-medium
            text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform duration-150"
        >
          رجوع
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="flex-1 min-h-touch bg-green-600 hover:bg-green-700 text-white rounded-2xl
          text-lg font-semibold shadow-sm active:scale-95 transition-transform duration-150"
      >
        {nextLabel}
      </button>
    </div>
  );
}
