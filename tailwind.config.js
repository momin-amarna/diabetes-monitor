/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'body': ['1rem', '1.5'],
        'heading': ['1.75rem', '1.2'],
        'subheading': ['1.25rem', '1.3'],
      },
      spacing: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      minHeight: {
        'touch': '48px',
      },
      colors: {
        'primary': '#10b981',
        'secondary': '#3b82f6',
        'danger': '#ef4444',
        'warning': '#f59e0b',
        'success': '#10b981',
        'bg-light': '#f9fafb',
        'text-dark': '#1f2937',
      },
    },
  },
  plugins: [],
};
