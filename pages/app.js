import { useEffect, useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { userStorage } from '../lib/storage';

export default function App() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const storedEmail = userStorage.getEmail();
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setReady(true);
  }, []);

  const handleLogin = (loggedInEmail) => {
    setEmail(loggedInEmail);
  };

  const handleLogout = () => {
    userStorage.clearEmail();
    setEmail(null);
  };

  if (!ready) {
    return null;
  }

  if (!email) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h1 className="text-subheading font-bold text-gray-900">مراقب السكري الذكي</h1>
        <button
          onClick={handleLogout}
          className="min-h-touch px-4 text-base text-gray-600 hover:text-gray-900"
        >
          تسجيل الخروج
        </button>
      </header>
    </div>
  );
}
