import { createHandler } from '../../../lib/api-utils';
import { validateMeasurement } from '../../../lib/validation';

const PLACEHOLDER_VALUES = new Set([undefined, '', 'YOUR_API_KEY_HERE']);
const AI_TIMEOUT_MS = 8000;

function isFetchAIConfigured() {
  return !PLACEHOLDER_VALUES.has(process.env.AGENTVERSE_API_KEY);
}

// Rule-based fallback so an insight is always available — used whenever
// Fetch AI isn't configured, times out, or errors (measurement save must
// never depend on this call succeeding).
function generateFallbackInsight(reading, fastingHours) {
  const isFasting = fastingHours >= 8;

  if (reading < 70) {
    return 'القراءة منخفضة، يُنصح بتناول شيء يحتوي على سكر سريع ومراقبة الأعراض. استشر الطبيب إذا تكرر ذلك.';
  }

  const highThreshold = isFasting ? 126 : 200;
  const elevatedThreshold = isFasting ? 100 : 140;

  if (reading >= highThreshold) {
    return 'القراءة مرتفعة، يُنصح بمراجعة الطبيب في أقرب وقت.';
  }
  if (reading >= elevatedThreshold) {
    return 'القراءة أعلى من الطبيعي قليلاً، يُفضل مراجعة الطبيب لمتابعة الحالة.';
  }
  return 'القراءة طبيعية، استمر في المتابعة الجيدة.';
}

async function pollForAgentMessage(session, attempts = 10, delayMs = 500) {
  for (let i = 0; i < attempts; i++) {
    const messages = await session.getMessages();
    const agentMessage = messages.find((m) => m.type === 'agent');
    if (agentMessage) return agentMessage.text;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return null;
}

async function getAgentInsight(reading, fastingHours) {
  const { AiEngine } = await import('@fetchai/ai-engine-sdk');
  const aiEngine = new AiEngine(process.env.AGENTVERSE_API_KEY);

  const functionGroups = await aiEngine.getFunctionGroups();
  const functionGroup = functionGroups[0];
  if (!functionGroup) return null;

  const session = await aiEngine.createSession(functionGroup.uuid);
  try {
    await session.start(
      `Give a short, plain-language health insight in Arabic for a blood sugar reading of ${reading} mg/dL after ${fastingHours} hours of fasting.`
    );
    return await pollForAgentMessage(session);
  } finally {
    await session.delete();
  }
}

export default createHandler('POST', async (req, res) => {
  const { reading, fastingHours } = req.body || {};

  const { valid, errors } = validateMeasurement({ reading, fastingHours });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const readingNum = Number(reading);
  const fastingNum = Number(fastingHours);

  if (!isFetchAIConfigured()) {
    return res.status(200).json({
      insight: generateFallbackInsight(readingNum, fastingNum),
      source: 'rules',
    });
  }

  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Fetch AI request timed out')), AI_TIMEOUT_MS)
    );
    const insight = await Promise.race([getAgentInsight(readingNum, fastingNum), timeout]);

    if (!insight) throw new Error('Fetch AI returned no insight');

    return res.status(200).json({ insight, source: 'fetchai' });
  } catch (error) {
    console.error('Fetch AI insight failed, falling back to rules:', error);
    return res.status(200).json({
      insight: generateFallbackInsight(readingNum, fastingNum),
      source: 'rules',
    });
  }
});
