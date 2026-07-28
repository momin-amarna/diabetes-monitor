const PAIN_POINTS = [
  { icon: '📝', text: 'قراءات السكري مدوّنة على ورق متناثر يسهل فقدانه' },
  { icon: '📵', text: 'صعوبة متابعة صحة الوالدين عن بُعد يوميًا' },
  { icon: '😕', text: 'لا توجد طريقة سهلة لمعرفة إن كانت القراءة طبيعية أم لا' },
  { icon: '👴', text: 'تطبيقات المتابعة الحالية معقدة وغير مناسبة لكبار السن' },
];

export default function Problem() {
  return (
    <section className="px-6 py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-heading font-bold text-gray-900 mb-4">
          متابعة صحة الوالدين ليست سهلة كما ينبغي
        </h2>
        <p className="text-lg sm:text-2xl text-gray-600 mb-12">
          الأبناء الذين يعتنون بوالديهم كبار السن يواجهون تحديات حقيقية كل يوم
        </p>
      </div>
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {PAIN_POINTS.map((point) => (
          <div
            key={point.text}
            className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-200"
          >
            <span className="text-3xl flex-shrink-0">{point.icon}</span>
            <p className="text-lg text-gray-700">{point.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
