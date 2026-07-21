import { useState } from 'react';
import { userStorage } from '../../lib/storage';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }

    userStorage.setEmail(trimmed);
    setError('');
    onLogin(trimmed);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="text-6xl mb-6">🩺</div>

      <h1 className="text-heading text-gray-900 mb-2 text-center">
        مراقب السكري الذكي
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-xs">
        أدخل بريدك الإلكتروني للمتابعة
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label htmlFor="email" className="sr-only">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full min-h-touch px-4 py-3 text-lg border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-green-600 text-left"
          dir="ltr"
        />

        {error && (
          <p className="text-danger text-base mt-2" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full min-h-touch mt-6 bg-green-600 hover:bg-green-700 text-white
            px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-200"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
