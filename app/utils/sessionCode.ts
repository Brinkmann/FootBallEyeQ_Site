// app/utils/sessionCode.ts
// Utilities for encoding and decoding unordered exercise sessions into a
// compact, reversible base-36 code.

const BASE36_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const MIN_EXERCISE = 1;
const MAX_EXERCISE = 70;
const MAX_EXERCISES = 5;

// Offsets[k] = sum_{i=1}^{k-1} C(70, i) for locating the range by cardinality
const OFFSETS = [0, 0, 70, 2485, 57225, 974120];

// cumulative upper bounds (exclusive) for locating the correct k from the index
const BOUNDARIES = [70, 2485, 57225, 974120, 13077134];

const TOTAL_COMBINATIONS = BOUNDARIES[BOUNDARIES.length - 1];

/**
 * Compute a binomial coefficient C(n, k) with small integer inputs.
 */
function choose(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  const kEff = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= kEff; i += 1) {
    result = (result * (n - (kEff - i))) / i;
  }
  return Math.round(result);
}

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
 * Validate and sort the provided exercise IDs.
 */
function normalizeExercises(exerciseIds: number[]): number[] {
  if (!Array.isArray(exerciseIds) || exerciseIds.length === 0) {
    throw new Error("Provide between 1 and 5 exercise IDs");
  }
  if (exerciseIds.length > MAX_EXERCISES) {
    throw new Error("A session can contain at most 5 exercises");
  }

  const sorted = [...exerciseIds].sort((a, b) => a - b);

  sorted.forEach((id, idx) => {
    if (!Number.isInteger(id) || id < MIN_EXERCISE || id > MAX_EXERCISE) {
      throw new Error("Exercise IDs must be integers between 1 and 70");
    }
    if (idx > 0 && id === sorted[idx - 1]) {
      throw new Error("Exercises must be distinct");
    }
  });

  return sorted;
}

/**
 * Map a sorted combination of exercise IDs to a unique integer index using the
 * combinatorial number system (lexicographic ranking).
 */
function combinationIndex(sortedIds: number[]): number {
  let index = 0;
  sortedIds.forEach((id, idx) => {
    const rank = idx + 1; // 1-based rank for binomial
    index += choose(id - 1, rank);
  });

  const k = sortedIds.length;
  return OFFSETS[k] + index;
}

/**
 * Recover a sorted combination from its index for a given size k.
 */
function combinationFromIndex(index: number, k: number): number[] {
  const ids: number[] = [];
  let remaining = index;
  let maxCandidate = MAX_EXERCISE - 1; // 0-based in binomial terms

  for (let rank = k; rank >= 1; rank -= 1) {
    for (let candidate = maxCandidate; candidate >= rank - 1; candidate -= 1) {
      const comb = choose(candidate, rank);
      if (comb <= remaining) {
        ids.unshift(candidate + 1); // convert back to 1-based exercise ID
        remaining -= comb;
        maxCandidate = candidate - 1;
        break;
      }
    }
  }

  if (ids.length !== k || remaining !== 0) {
    throw new Error("Code represents an invalid session payload");
  }

  return ids;
}

/**
 * Generate a 5-character session code for 1–5 unordered exercise IDs.
 */
export function generateSessionCode(exerciseIds: number[]): string {
  const sorted = normalizeExercises(exerciseIds);
  const index = combinationIndex(sorted);

  if (index >= TOTAL_COMBINATIONS) {
    throw new Error("Session combination exceeds supported range");
  }

  const base36 = toBase36(index);
  return base36.padStart(5, "0");
}

/**
 * Decode a 5-character session code back into sorted exercise IDs.
 */
export function decodeSessionCode(code: string): number[] {
  if (typeof code !== "string") {
    throw new Error("Code must be a string");
  }

  const normalized = code.trim().toLowerCase();
  if (!/^[0-9a-z]{5}$/.test(normalized)) {
    throw new Error("Code must be exactly 5 characters of 0-9 or a-z");
  }

  const value = fromBase36(normalized);
  if (!Number.isSafeInteger(value) || value < 0 || value >= TOTAL_COMBINATIONS) {
    throw new Error("Code represents an invalid session payload");
  }

  let k = 0;
  for (let i = 0; i < BOUNDARIES.length; i += 1) {
    if (value < BOUNDARIES[i]) {
      k = i + 1;
      break;
    }
  }

  if (k === 0) {
    throw new Error("Code represents an invalid session payload");
  }

  const offset = OFFSETS[k];
  const indexForK = value - offset;

  return combinationFromIndex(indexForK, k);
}

/*
Example usage:

const codeA = generateSessionCode([1, 13, 9, 65, 22]);
console.log(codeA); // "5kxgh"
console.log(decodeSessionCode(codeA)); // [1, 9, 13, 22, 65]

const codeB = generateSessionCode([3]);
console.log(codeB); // "0000c" (example)
console.log(decodeSessionCode(codeB)); // [3]
*/
