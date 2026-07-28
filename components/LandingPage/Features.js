const FEATURES = [
  { icon: '🩸', title: 'قراءات السكري', text: 'تسجيل سريع مع ساعات الصيام والملاحظات' },
  { icon: '⚖️', title: 'متابعة الوزن', text: 'تتبع الوزن أسبوعيًا مع تذكيرات تلقائية' },
  { icon: '🤖', title: 'تحليل ذكي', text: 'تحليل فوري لكل قراءة بلغة بسيطة وواضحة' },
  { icon: '👥', title: 'عدة مرضى', text: 'أضف عددًا غير محدود من الأشخاص، عائلة أو من تقدّم لهم الرعاية' },
  { icon: '📴', title: 'يعمل بدون إنترنت', text: 'تعمل كل الميزات الأساسية حتى بدون اتصال' },
  { icon: '🔠', title: 'مصمم لكبار السن', text: 'أزرار كبيرة، خط واضح، وتباين قابل للتخصيص' },
];

export default function Features() {
  return (
    <section className="px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl sm:text-heading font-bold text-gray-900">كل ما تحتاجه في مكان واحد</h2>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-2 p-6 rounded-2xl border border-gray-200 shadow-sm
              hover:shadow-md transition-shadow duration-200"
          >
            <span className="text-4xl">{feature.icon}</span>
            <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
            <p className="text-lg text-gray-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
