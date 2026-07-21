export const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ec4899', // pink
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#6b7280', // gray
];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={`اختر اللون ${color}`}
          aria-pressed={value === color}
          className={`min-h-touch min-w-touch rounded-full border-4 ${
            value === color ? 'border-gray-900' : 'border-transparent'
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
