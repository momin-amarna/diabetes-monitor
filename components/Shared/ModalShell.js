export default function ModalShell({ title, onClose, closeLabel = 'إغلاق', footer, children }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 border-b border-gray-200 shadow-sm">
        <button
          onClick={onClose}
          className="min-h-touch min-w-touch text-2xl text-gray-500 rounded-full hover:bg-gray-100
            transition-colors duration-150"
          aria-label={closeLabel}
        >
          ✕
        </button>
        <h2 className="flex-1 min-w-0 text-lg sm:text-subheading font-bold text-gray-900 truncate text-center px-2">
          {title}
        </h2>
        <span className="w-touch flex-shrink-0" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>

      {footer && (
        <footer className="flex gap-3 px-6 pt-4 pb-6 border-t border-gray-200">{footer}</footer>
      )}
    </div>
  );
}
