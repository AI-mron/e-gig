import type { GeminiInterpretation, JobRequirements, ServiceCategory } from '../src/types/index.js';

/**
 * Deterministic intent extractor for zero-latency fallback and guided demo
 */
export function deterministicParse(
  userMessage: string,
  currentReq?: Partial<JobRequirements>
): { interpretation: GeminiInterpretation; explanationMessage?: string } {
  const text = userMessage.toLowerCase();

  // Category detection
  let category: ServiceCategory | null = currentReq?.category || null;
  if (text.includes('tv') || text.includes('television') || text.includes('appliance') || text.includes('screen') || text.includes('samsung') || text.includes('lg')) {
    category = 'tv_repair';
  } else if (text.includes('harvest') || text.includes('farm') || text.includes('maize') || text.includes('crop') || text.includes('picking') || text.includes('crew')) {
    category = 'harvesting';
  }

  // Location detection
  let location: string | null = currentReq?.location || null;
  if (text.includes('kilimani')) {
    location = 'Kilimani';
  } else if (text.includes('nakuru')) {
    location = 'Nakuru';
  } else if (text.includes('nairobi')) {
    location = 'Nairobi';
  } else if (text.includes('westlands')) {
    location = 'Westlands';
  } else if (text.includes('njoro')) {
    location = 'Njoro';
  } else if (text.includes('mombasa')) {
    location = 'Mombasa';
  } else if (text.includes('kisumu')) {
    location = 'Kisumu';
  }

  // Budget detection (e.g. KSh 3,000, 3000, 6000, 2,500)
  let budgetKes: number | null = currentReq?.budgetKes || null;
  const budgetMatch = text.match(/(?:budget|ksh|kes|shs?\.?|cost)?\s*(?:is|of|under|around|approx)?\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,6})/i);
  if (budgetMatch && budgetMatch[1]) {
    const rawNum = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawNum) && rawNum > 100) {
      budgetKes = rawNum;
    }
  }

  // Worker count detection
  let workerCount: number | null = currentReq?.workerCount || null;
  if (category === 'tv_repair') {
    workerCount = 1; // TV default to 1 technician
  } else {
    const countMatch = text.match(/([0-9]+)\s*(?:harvesting\s*)?(?:workers?|people|hands?|labourers?|team)/i);
    if (countMatch && countMatch[1]) {
      const parsedCount = parseInt(countMatch[1], 10);
      if (!isNaN(parsedCount) && parsedCount > 0) {
        workerCount = parsedCount;
      }
    } else if (text.includes('single') || text.includes('one worker') || text.includes('1 worker')) {
      workerCount = 1;
    } else if (!workerCount && category === 'harvesting') {
      workerCount = 4; // default demo crew
    }
  }

  // Date and Time detection
  let requestedDate: string | null = currentReq?.requestedDate || null;
  let requestedTime: string | null = currentReq?.requestedTime || null;

  if (text.includes('tomorrow')) {
    requestedDate = 'Tomorrow';
  } else if (text.includes('saturday')) {
    requestedDate = 'Saturday';
  } else if (text.includes('today')) {
    requestedDate = 'Today';
  }

  if (text.includes('afternoon') || text.includes('pm') || text.includes('2pm') || text.includes('2 pm')) {
    requestedTime = 'Afternoon (2:00 PM – 5:00 PM)';
  } else if (text.includes('morning') || text.includes('am')) {
    requestedTime = 'Morning (8:00 AM – 12:00 PM)';
  } else if (category === 'harvesting' && !requestedTime) {
    requestedTime = 'Full Day (7:00 AM – 5:00 PM)';
  }

  // Duration
  let durationDays = 1;
  if (text.includes('day') && (text.includes('2 day') || text.includes('3 day') || text.includes('week'))) {
    durationDays = 1; // Limit to 1 day for demo
  }

  // Network preference
  let preferNetwork: boolean | null = currentReq?.preferNetwork ?? null;
  if (text.includes('network') || text.includes('recommend') || text.includes('friends') || text.includes('connection')) {
    preferNetwork = true;
  }

  // Task details
  const taskDetails = currentReq?.taskDetails || userMessage;

  // Follow-up question logic (one concise question at a time)
  let clarificationQuestion: string | null = null;
  let explanationMessage = '';

  if (!category) {
    clarificationQuestion = 'Could you specify the service you need? We currently support TV & appliance repair and farm harvesting.';
  } else if (!location) {
    clarificationQuestion = category === 'tv_repair'
      ? 'Which neighbourhood or town in Nairobi is the TV located in? (e.g. Kilimani)'
      : 'Which farming area or town is the work located in? (e.g. Nakuru)';
  } else if (!budgetKes) {
    clarificationQuestion = category === 'tv_repair'
      ? 'What is your estimated total budget in KSh? (Our diagnostic visits start around KSh 600–800).'
      : 'What is your total budget for the crew in KSh? (e.g. KSh 6,000 for 4 workers).';
  }

  // Explanatory messages for Kenyan demo scope
  if (category === 'tv_repair') {
    explanationMessage = 'I found suitable technicians. Diagnosis is priced separately from repairs — you will receive a transparent quote before any additional parts or labour are approved.';
  } else if (category === 'harvesting') {
    explanationMessage = 'I have assembled available harvesting workers in Nakuru. Rates cover one-day labour with a designated crew leader. Tools and transport are arranged separately.';
  }

  const interpretation: GeminiInterpretation = {
    category,
    location,
    requestedDate: requestedDate || (category === 'tv_repair' ? 'Tomorrow' : 'Saturday'),
    requestedTime: requestedTime || (category === 'tv_repair' ? 'Afternoon (2:00 PM – 5:00 PM)' : 'Full Day (7:00 AM – 5:00 PM)'),
    workerCount: workerCount || (category === 'tv_repair' ? 1 : 4),
    budgetKes,
    durationDays,
    taskDetails,
    preferNetwork: preferNetwork ?? false,
    clarificationQuestion
  };

  return { interpretation, explanationMessage };
}

/**
 * Server-side Gemini API call with structured output
 */
export async function interpretWithGemini(
  conversation: { role: 'user' | 'assistant'; text: string }[],
  currentReq?: Partial<JobRequirements>
): Promise<{ interpretation: GeminiInterpretation; explanationMessage?: string; source: 'gemini' | 'fallback' }> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey || apiKey.trim() === '') {
    const latestUserMsg = conversation.filter(c => c.role === 'user').pop()?.text || '';
    const res = deterministicParse(latestUserMsg, currentReq);
    return { ...res, source: 'fallback' };
  }

  try {
    const prompt = `
You are the e-gig hiring assistant for a local Kenyan service platform.
Extract structured hiring requirements from the conversation.

Categories supported: "tv_repair" or "harvesting".
Locations supported in demo: Nairobi areas (Kilimani, Westlands, etc.) for TV repair; Nakuru areas (Njoro, Rongai, etc.) for harvesting.

Rules:
1. For TV repair, default workerCount to 1. TV quotes only cover diagnosis (inspection).
2. For harvesting, support 1-day assignments. Rates are per day.
3. If essential fields (category, location, budgetKes) are missing, provide ONE polite, concise clarificationQuestion.
4. Total budget must be an integer in Kenyan Shillings (KES).
5. Output ONLY valid JSON matching this schema:
{
  "category": "tv_repair" | "harvesting" | null,
  "location": string | null,
  "requestedDate": string | null,
  "requestedTime": string | null,
  "workerCount": number | null,
  "budgetKes": number | null,
  "durationDays": number | null,
  "taskDetails": string | null,
  "preferNetwork": boolean | null,
  "clarificationQuestion": string | null,
  "friendlyAssistantReply": string | null
}
`;

    const contents = [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { text: `Current state: ${JSON.stringify(currentReq || {})}` },
          ...conversation.map(c => ({ text: `${c.role.toUpperCase()}: ${c.text}` }))
        ]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(8000) // 8s timeout
      }
    );

    if (!response.ok) {
      console.warn(`Gemini API error ${response.status}. Falling back to deterministic parser.`);
      const latestUserMsg = conversation.filter(c => c.role === 'user').pop()?.text || '';
      const res = deterministicParse(latestUserMsg, currentReq);
      return { ...res, source: 'fallback' };
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No candidate content returned');
    }

    const parsed = JSON.parse(candidateText);

    // Validate structured fields
    const validCategory = parsed.category === 'tv_repair' || parsed.category === 'harvesting' ? parsed.category : null;
    const validWorkerCount = typeof parsed.workerCount === 'number' && parsed.workerCount > 0 ? Math.round(parsed.workerCount) : null;
    const validBudget = typeof parsed.budgetKes === 'number' && parsed.budgetKes > 0 ? Math.round(parsed.budgetKes) : null;

    const interpretation: GeminiInterpretation = {
      category: validCategory,
      location: typeof parsed.location === 'string' && parsed.location.trim() ? parsed.location.trim() : (currentReq?.location || null),
      requestedDate: typeof parsed.requestedDate === 'string' ? parsed.requestedDate : (currentReq?.requestedDate || null),
      requestedTime: typeof parsed.requestedTime === 'string' ? parsed.requestedTime : (currentReq?.requestedTime || null),
      workerCount: validCategory === 'tv_repair' ? 1 : (validWorkerCount || currentReq?.workerCount || 4),
      budgetKes: validBudget || currentReq?.budgetKes || null,
      durationDays: 1, // enforce 1-day demo scope
      taskDetails: typeof parsed.taskDetails === 'string' ? parsed.taskDetails : (currentReq?.taskDetails || ''),
      preferNetwork: typeof parsed.preferNetwork === 'boolean' ? parsed.preferNetwork : (currentReq?.preferNetwork ?? false),
      clarificationQuestion: parsed.clarificationQuestion || null
    };

    return {
      interpretation,
      explanationMessage: parsed.friendlyAssistantReply || (
        validCategory === 'tv_repair'
          ? 'I found suitable technicians. Diagnosis is priced separately from repairs.'
          : 'I have found available harvesting workers in Nakuru.'
      ),
      source: 'gemini'
    };
  } catch (err) {
    console.warn('Gemini request failed or timed out:', err);
    const latestUserMsg = conversation.filter(c => c.role === 'user').pop()?.text || '';
    const res = deterministicParse(latestUserMsg, currentReq);
    return { ...res, source: 'fallback' };
  }
}
