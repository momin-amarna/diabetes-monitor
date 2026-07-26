export default function ModalShell({ title, onClose, closeLabel = 'إغلاق', footer, children }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="min-h-touch min-w-touch text-2xl text-gray-500"
          aria-label={closeLabel}
        >
          ✕
        </button>
        <h2 className="text-subheading font-bold text-gray-900">{title}</h2>
        <span className="w-touch" />
      </header>

      <main className="flex-1 overflow-y-auto">{children}</main>

      {footer && (
        <footer className="flex gap-3 px-6 py-4 border-t border-gray-200">{footer}</footer>
      )}
    </div>
  );
}
