// app/utils/coneControl.ts

export async function triggerPattern(patternNum: number) {
  // For now, just log to the console.
  console.log(`[MOCK] Would send: pattern ${patternNum}, state: true`);

  // Simulate a delay to represent network latency
  await new Promise(res => setTimeout(res, 500));

  // Return a mock result (success)
  return { ok: true, pattern: patternNum };
}
