import { interpretWithGemini } from '../server/geminiService.js';

export async function POST(request: Request) {
  let data;
  try { data = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!data || !Array.isArray(data.conversation) || data.conversation.length > 50 ||
      data.conversation.some((m: {role?: unknown; text?: unknown} | null) => !m || !['user', 'assistant'].includes(String(m.role)) || typeof m.text !== 'string' || m.text.length > 10000) ||
      (data.currentRequirements != null && (typeof data.currentRequirements !== 'object' || Array.isArray(data.currentRequirements)))) {
    return Response.json({ error: 'Invalid conversation or requirements' }, { status: 400 });
  }
  try {
    return Response.json(await interpretWithGemini(data.conversation, data.currentRequirements), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Unable to interpret request' }, { status: 500 });
  }
}
