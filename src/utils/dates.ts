/**
 * Runtime date helper using Africa/Nairobi time (EAT, UTC+3)
 * Ensures sample dates never become stale.
 */

export function getNairobiNow(): Date {
  // Use Intl to get current Nairobi time
  const now = new Date();
  const nairobiStr = now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
  return new Date(nairobiStr);
}

export function getTomorrowAfternoonLabel(): string {
  const nairobi = getNairobiNow();
  const tomorrow = new Date(nairobi);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekday = tomorrow.toLocaleDateString('en-US', { weekday: 'short' });
  const month = tomorrow.toLocaleDateString('en-US', { month: 'short' });
  const day = tomorrow.getDate();

  return `Tomorrow (${weekday}, ${month} ${day}), 2:00 PM – 5:00 PM`;
}

export function getTomorrowShortLabel(): string {
  return 'Tomorrow, 2:00 PM – 5:00 PM';
}

export function getNextSaturdayLabel(): string {
  const nairobi = getNairobiNow();
  const currentDay = nairobi.getDay(); // 0 is Sunday, 6 is Saturday
  let daysUntilSaturday = (6 - currentDay + 7) % 7;
  if (daysUntilSaturday === 0) {
    daysUntilSaturday = 7; // Next upcoming Saturday if today is Saturday
  }

  const saturday = new Date(nairobi);
  saturday.setDate(saturday.getDate() + daysUntilSaturday);

  const month = saturday.toLocaleDateString('en-US', { month: 'short' });
  const day = saturday.getDate();

  return `This Saturday (${month} ${day}), 7:00 AM – 5:00 PM`;
}

export function getNextSaturdayShortLabel(): string {
  const nairobi = getNairobiNow();
  const currentDay = nairobi.getDay();
  let daysUntilSaturday = (6 - currentDay + 7) % 7;
  if (daysUntilSaturday === 0) {
    daysUntilSaturday = 7;
  }
  const saturday = new Date(nairobi);
  saturday.setDate(saturday.getDate() + daysUntilSaturday);
  const month = saturday.toLocaleDateString('en-US', { month: 'short' });
  const day = saturday.getDate();

  return `Saturday, ${month} ${day} (One day)`;
}
