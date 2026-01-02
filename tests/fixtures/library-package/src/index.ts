/**
 * Format a date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse JSON safely
 */
export function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
