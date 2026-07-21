export default function EmptyState({ title, description, icon, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 px-6 py-12 text-center">
      <div className="text-6xl mb-6">{icon}</div>

      <h2 className="text-heading text-gray-900 mb-2">
        {title}
      </h2>

      <p className="text-lg text-gray-600 mb-8 max-w-xs">
        {description}
      </p>

      {action && actionLabel && (
        <button
          onClick={action}
          className="
            bg-green-600 hover:bg-green-700 text-white
            px-6 py-3 rounded-lg font-medium text-lg
            min-h-touch min-w-touch transition-colors duration-200
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
