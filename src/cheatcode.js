export function getWeeklyCheatCode() {
  // Get current week number (ISO 8601)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNum = Math.floor(diff / oneWeek) + 1;
  
  // Deterministic code: changes weekly, always 1-100
  const code = ((weekNum * 37) % 100) + 1;
  return Math.floor(code);
}

export function isCheatCodeEntered(input) {
  return Number(input) === getWeeklyCheatCode();
}
