export default function ModalShell({ title, onClose, closeLabel = 'إغلاق', footer, children }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-200 shadow-sm">
        <button
          onClick={onClose}
          className="min-h-touch min-w-touch text-2xl text-gray-500 rounded-full hover:bg-gray-100
            transition-colors duration-150"
          aria-label={closeLabel}
        >
          ✕
        </button>
        <h2 className="text-subheading font-bold text-gray-900">{title}</h2>
        <span className="w-touch" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>

      {footer && (
        <footer className="flex gap-3 px-6 pt-4 pb-6 border-t border-gray-200">{footer}</footer>
      )}
    </div>
  );
}
