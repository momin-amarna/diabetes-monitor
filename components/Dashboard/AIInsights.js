import { useEffect, useState } from 'react';
import { fetchaiClient } from '../../lib/fetchai-client';

const FALLBACK_MESSAGE = 'تعذر الحصول على تحليل ذكي لهذه القراءة حاليًا.';

export default function AIInsights({ patient, measurement, onDismiss }) {
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState(null);
  const { reading, fastingHours } = measurement;

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setInsight(null);

    fetchaiClient.getInsight(reading, fastingHours).then((result) => {
      if (cancelled) return;
      setInsight(result || FALLBACK_MESSAGE);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [reading, fastingHours]);

  return (
    <div className="flex items-start gap-3 bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="text-2xl flex-shrink-0">🩺</div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-blue-900">{patient.name}</p>
        {loading ? (
          <p className="text-base text-blue-700">جاري تحليل القراءة...</p>
        ) : (
          <p className="text-base text-blue-700">{insight}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="إغلاق"
        className="min-h-touch min-w-touch text-xl text-blue-700"
      >
        ✕
      </button>
    </div>
  );
}
