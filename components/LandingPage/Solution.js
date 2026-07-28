const STEPS = [
  {
    icon: '👨‍👩‍👧',
    title: 'أضف والديك',
    text: 'أنشئ بطاقة لكل والد باسمه ورمزه ولونه المفضل خلال ثوانٍ',
  },
  {
    icon: '🩸',
    title: 'سجّل القراءة',
    text: 'أدخل قراءة السكري أو الوزن بلمسات كبيرة وواضحة مناسبة لكبار السن',
  },
  {
    icon: '🤖',
    title: 'احصل على تحليل فوري',
    text: 'يخبرك التطبيق مباشرة إن كانت القراءة طبيعية أم تحتاج لمراجعة الطبيب',
  },
];

export default function Solution() {
  return (
    <section className="px-6 py-16 sm:py-24 bg-bg-light">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl sm:text-heading font-bold text-gray-900 mb-4">
          مراقب السكري الذكي يبسّط كل ذلك
        </h2>
        <p className="text-lg sm:text-2xl text-gray-600">ثلاث خطوات فقط، بدون تعقيد</p>
      </div>
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {STEPS.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center text-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
            >
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {index + 1}. {step.title}
            </h3>
            <p className="text-lg text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
