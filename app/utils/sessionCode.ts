// app/utils/sessionCode.ts
// Utility functions for generating and decoding compact session codes.

const BASE71 = 71;
const BASE36_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

/**
 * Convert a non-negative integer to a base-36 string using digits 0-9 and a-z.
 */
export function toBase36(value: number): string {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("Value must be a non-negative safe integer");
  }

  if (value === 0) return "0";

  let result = "";
  let current = value;

  while (current > 0) {
    const digit = current % 36;
    result = BASE36_DIGITS[digit] + result;
    current = Math.floor(current / 36);
  }

  return result;
}

/**
 * Generate a 6-character session code for up to five exercise IDs.
 *
 * Steps:
 * 1. Validate IDs (1-70) and keep only the first five entries.
 * 2. Pad with zeros to always have five digits.
 * 3. Pack the five base-71 digits into a single integer.
 * 4. Convert to base-36 and left-pad to six characters.
 */
export function generateSessionCode(exerciseIds: number[]): string {
  if (!Array.isArray(exerciseIds)) {
    throw new Error("exerciseIds must be an array");
  }

  const trimmed = exerciseIds.slice(0, 5);

  trimmed.forEach(id => {
    if (!Number.isInteger(id) || id < 1 || id > 70) {
      throw new Error("Exercise IDs must be integers between 1 and 70");
    }
  });

  const padded: number[] = [...trimmed];
  while (padded.length < 5) {
    padded.push(0);
  }

  // Combine into a single integer using base-71 positional notation.
  const packedValue = padded.reduce((acc, id) => acc * BASE71 + id, 0);

  const base36 = toBase36(packedValue);
  return base36.padStart(6, "0");
}

/**
 * Decode a 6-character session code back into five exercise IDs.
 * Returns the padded array; callers can remove trailing zeros if desired.
 */
export function decodeSessionCode(code: string): number[] {
  if (typeof code !== "string") {
    throw new Error("Code must be a string");
  }

  const normalized = code.trim().toLowerCase();
  if (!/^[0-9a-z]{6}$/.test(normalized)) {
    throw new Error("Code must be exactly 6 characters of 0-9 or a-z");
  }

  // Convert base-36 string to an integer.
  let value = 0;
  for (const char of normalized) {
    const digit = BASE36_DIGITS.indexOf(char);
    if (digit === -1) {
      throw new Error("Invalid character in code");
    }
    value = value * 36 + digit;
  }

  // Extract five base-71 digits (id1..id5) from most significant to least.
  const ids = new Array<number>(5).fill(0);
  for (let i = 4; i >= 0; i -= 1) {
    ids[i] = value % BASE71;
    value = Math.floor(value / BASE71);
  }

  return ids;
}

/*
Example usage:

const codeA = generateSessionCode([5, 12]);
console.log(codeA, decodeSessionCode(codeA)); // [5, 12, 0, 0, 0]

const codeB = generateSessionCode([3, 9, 21, 7, 2]);
console.log(codeB, decodeSessionCode(codeB)); // [3, 9, 21, 7, 2]
*/
