// Explicit counts override model guesses; bare numbers are counts only in count context.
export function explicitWorkerCount(text: string, allowBare = false): number | null {
  const words: Record<string, number> = {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
  const token = '(\\d+|one|two|three|four|five|six|seven|eight|nine|ten)';
  const normalized = text.toLowerCase().trim();
  const match = normalized.match(new RegExp(token + '\\s*(?:harvesting\\s+)?(?:harvesters?|workers?|people|persons?|labou?rers?|technicians?|cleaners?|gardeners?)\\b'))
    || normalized.match(new RegExp('(?:make (?:it|that)|change (?:it|that) to|i need|i want|only|just)\\s+' + token + '(?:\\s*(?:please|instead))?[.!]?$'))
    || (allowBare ? normalized.match(new RegExp('^' + token + '[.!]?$')) : null);
  if (!match) return null;
  const n = words[match[1]] ?? Number(match[1]);
  return Number.isSafeInteger(n) && n > 0 && n <= 1000 ? n : null;
}
