export function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY?.trim());
  return Response.json({ geminiAvailable: hasKey, model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', mode: hasKey ? 'gemini' : 'fallback' }, { headers: { 'Cache-Control': 'no-store' } });
}
