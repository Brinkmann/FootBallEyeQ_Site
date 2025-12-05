// app/utils/sessionCode.ts
// Utility functions for generating and decoding compact session codes.

const BASE71 = 71;
const BASE36_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const MAX_EXERCISES = 5;

const MAX_PACKED_VALUE = 70 * (BASE71 ** 4 + BASE71 ** 3 + BASE71 ** 2 + BASE71 + 1);

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
 * Convert a base-36 string (0-9, a-z) back to a number.
 */
function fromBase36(code: string): number {
  let value = 0;
  for (const char of code) {
    const digit = BASE36_DIGITS.indexOf(char);
    if (digit === -1) {
      throw new Error("Invalid character in code");
    }
    value = value * 36 + digit;
  }
  return value;
}

/**
 * Ensure we have exactly five base-71 digits, validating each exercise ID.
 */
function normalizeExercises(exerciseIds: number[]): number[] {
  if (!Array.isArray(exerciseIds)) {
    throw new Error("exerciseIds must be an array");
  }

  const trimmed = exerciseIds.slice(0, MAX_EXERCISES);

  trimmed.forEach(id => {
    if (!Number.isInteger(id) || id < 1 || id > 70) {
      throw new Error("Exercise IDs must be integers between 1 and 70");
    }
  });

  const padded: number[] = [...trimmed];
  while (padded.length < MAX_EXERCISES) {
    padded.push(0);
  }

  return padded;
}

/**
 * Convert five base-71 digits into a single integer using positional notation.
 */
function packBase71(digits: number[]): number {
  return digits.reduce((acc, id) => acc * BASE71 + id, 0);
}

/**
 * Expand a packed integer back into five base-71 digits.
 */
function unpackBase71(value: number): number[] {
  const ids = new Array<number>(MAX_EXERCISES).fill(0);
  for (let i = MAX_EXERCISES - 1; i >= 0; i -= 1) {
    ids[i] = value % BASE71;
    value = Math.floor(value / BASE71);
  }
  return ids;
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
  const padded = normalizeExercises(exerciseIds);

  const packedValue = packBase71(padded);
  if (packedValue > MAX_PACKED_VALUE) {
    throw new Error("Packed session value exceeds allowed range");
  }

  const base36 = toBase36(packedValue);
  return base36.padStart(6, "0");
}

/**
 * Provide a human-friendly representation of the five base-71 digits
 * (e.g., "01 02 03 04 05" for exercises [1,2,3,4,5]).
 */
export function formatBase71Digits(exerciseIds: number[]): string {
  const padded = normalizeExercises(exerciseIds);
  return padded
    .map(id => id.toString().padStart(2, "0"))
    .join(" ");
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

  const value = fromBase36(normalized);
  if (value > MAX_PACKED_VALUE) {
    throw new Error("Code represents an invalid session payload");
  }

  return unpackBase71(value);
}

/*
Example usage:

const codeA = generateSessionCode([5, 12]);
// formatBase71Digits([5, 12]) => "05 12 00 00 00"
console.log(codeA, decodeSessionCode(codeA)); // [5, 12, 0, 0, 0]

const codeB = generateSessionCode([3, 9, 21, 7, 2]);
// formatBase71Digits([3, 9, 21, 7, 2]) => "03 09 21 07 02"
console.log(codeB, decodeSessionCode(codeB)); // [3, 9, 21, 7, 2]
*/
