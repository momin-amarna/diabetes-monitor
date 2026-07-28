const LOCAL_DEMO_VIDEO = '/demo.mp4';

export default function Demo() {
  const embedUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL;

  return (
    <section className="px-6 py-16 sm:py-24 bg-bg-light">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl sm:text-heading font-bold text-gray-900">شاهد التطبيق أثناء العمل</h2>
      </div>
      <div className="max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-900">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="عرض توضيحي لتطبيق مراقب السكري الذكي"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video controls className="w-full h-full" preload="metadata">
            <source src={LOCAL_DEMO_VIDEO} type="video/mp4" />
          </video>
        )}
      </div>
    </section>
  );
}
