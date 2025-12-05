// app/utils/sessionCode.ts
// Encode and decode session pattern codes using base-71 packing and base-36 output.

const BASE36_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const PATTERN_MIN = 1;
const PATTERN_MAX = 70;
const SESSION_SLOTS = 5;
const BASE = 71; // 0 = none, 1-70 = pattern numbers
const BASE71_POWERS = [BASE ** 4, BASE ** 3, BASE ** 2, BASE, 1] as const;
const CODE_LENGTH = 6; // always pad base-36 output to 6 characters

function assertSafeInteger(value: number, message: string) {
  if (!Number.isSafeInteger(value)) {
    throw new Error(message);
  }
}

/**
 * Convert a non-negative integer to a base-36 string using digits 0-9 and a-z.
 */
export function toBase36(value: number): string {
  assertSafeInteger(value, "Value must be a safe integer for base-36 conversion");
  if (value < 0) throw new Error("Value must be non-negative");
  if (value === 0) return "0";

  let current = value;
  let result = "";

  while (current > 0) {
    const digit = current % 36;
    result = BASE36_DIGITS[digit] + result;
    current = Math.floor(current / 36);
  }

  return result;
}

function fromBase36(code: string): number {
  let value = 0;
  for (const char of code) {
    const digit = BASE36_DIGITS.indexOf(char);
    if (digit === -1) {
      throw new Error("Invalid character in code");
    }
    value = value * 36 + digit;
  }
  assertSafeInteger(value, "Decoded value exceeds safe integer range");
  return value;
}

function parsePatternString(input: string): number[] {
  if (typeof input !== "string" || input.length === 0) {
    throw new Error("Provide between 1 and 5 pattern numbers");
  }
  if (input.length % 2 !== 0) {
    throw new Error("Patterns must be provided as 2-digit numbers");
  }

  const patterns: number[] = [];
  for (let i = 0; i < input.length; i += 2) {
    const pair = input.slice(i, i + 2);
    const num = Number.parseInt(pair, 10);
    if (!Number.isInteger(num) || num < PATTERN_MIN || num > PATTERN_MAX) {
      throw new Error("Pattern numbers must be between 01 and 70");
    }
    patterns.push(num);
  }

  if (patterns.length === 0 || patterns.length > SESSION_SLOTS) {
    throw new Error("Session must contain 1 to 5 patterns");
  }
  if (new Set(patterns).size !== patterns.length) {
    throw new Error("Patterns must be unique");
  }

  return patterns.sort((a, b) => a - b);
}

function padPatterns(patterns: number[]): number[] {
  const padded = [...patterns];
  while (padded.length < SESSION_SLOTS) padded.push(0);
  return padded;
}

function toBase71Value(patterns: number[]): number {
  return patterns.reduce((acc, id, idx) => acc + id * BASE71_POWERS[idx], 0);
}

/**
 * Encode a concatenated pattern string (e.g. "01020304") into a 6-character code.
 */
export function encodeSessionCode(patternString: string): string {
  const sorted = parsePatternString(patternString);
  const padded = padPatterns(sorted);

  const value = toBase71Value(padded);
  const base36 = toBase36(value).toLowerCase();

  if (base36.length > CODE_LENGTH) {
    throw new Error("Encoded value exceeds 6-character limit");
  }

  return base36.padStart(CODE_LENGTH, "0");
}

/**
 * Decode a 6-character code back into a concatenated pattern string.
 */
export function decodeSessionCode(code: string): string {
  if (typeof code !== "string") {
    throw new Error("Code must be a string");
  }

  const normalized = code.trim().toLowerCase();
  if (!/^[0-9a-z]{6}$/.test(normalized)) {
    throw new Error("Code must be exactly 6 characters using 0-9 or a-z");
  }

  const value = fromBase36(normalized);

  const digits: number[] = [];
  let remainder = value;
  BASE71_POWERS.forEach((power) => {
    const digit = Math.floor(remainder / power);
    digits.push(digit);
    remainder -= digit * power;
  });

  if (remainder !== 0) {
    throw new Error("Code represents an invalid session");
  }

  // remove trailing zeros (no pattern in that slot)
  while (digits.length > 0 && digits[digits.length - 1] === 0) {
    digits.pop();
  }

  const nonZero = digits;

  if (nonZero.length === 0) {
    throw new Error("Code does not contain any patterns");
  }

  // validate range and formatting
  nonZero.forEach((id) => {
    if (id < PATTERN_MIN || id > PATTERN_MAX) {
      throw new Error("Code contains an invalid pattern number");
    }
  });

  const asPairs = nonZero.map((id) => id.toString().padStart(2, "0"));
  return asPairs.join("");
}

/*
Example usage:

// Order independence
const codeA = encodeSessionCode("0504030201");
const codeB = encodeSessionCode("0102030405");
// codeA === codeB

// Round trip
const encoded = encodeSessionCode("0102030405"); // "0fkc03"
const decoded = decodeSessionCode(encoded); // "0102030405"
*/
