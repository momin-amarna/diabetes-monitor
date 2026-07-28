import Link from 'next/link';

export default function CTA() {
  return (
    <section
      className="px-6 py-16 sm:py-24 text-center text-white"
      style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
    >
      <h2 className="text-2xl sm:text-heading font-bold mb-4">ابدأ متابعة صحة والديك اليوم</h2>
      <p className="text-lg sm:text-2xl opacity-90 mb-8 max-w-xl mx-auto">
        مجاني بالكامل، ولا يحتاج إلى أي إعداد معقد
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
