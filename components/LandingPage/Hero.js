import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="flex flex-col items-center justify-center text-center text-white px-6 py-20 sm:py-28"
      style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
    >
      <div className="text-6xl sm:text-7xl mb-6">🩺</div>
      <h1 className="text-3xl sm:text-heading font-bold mb-4 max-w-2xl">
        مراقب السكري الذكي
      </h1>
      <p className="text-lg sm:text-2xl opacity-90 max-w-xl mb-10">
        تابع قراءات السكري والوزن لوالديك بسهولة، مع تحليلات ذكية تساعدك على
        الاطمئنان عليهم أينما كنت
      </p>
      <Link
        href="/app"
        className="min-h-touch inline-flex items-center justify-center px-10 bg-white text-green-700
          rounded-2xl text-lg sm:text-2xl font-bold shadow-lg hover:bg-gray-50 active:scale-95
          transition-transform duration-150"
      >
        ابدأ الآن مجانًا
      </Link>
    </section>
  );
}
