'use client';

import { useState } from "react";
import { triggerPattern } from '../utils/coneControl';

export default function ConesPage() {
  const [pattern, setPattern] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleActivate() {
    setLoading(true);
    setMessage('');
    const result = await triggerPattern(pattern);
    setLoading(false);
    if (result.ok) {
      setMessage(`Pattern ${pattern} "sent" to cones (mocked)`);
    } else {
      setMessage('Error sending pattern');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cone Control (Mocked)</h1>
      <div className="flex items-center gap-4 mb-4">
        <label>
          Pattern Number:
          <input
            type="number"
            min={1}
            max={20}
            value={pattern}
            onChange={e => setPattern(Number(e.target.value))}
            className="ml-2 p-1 rounded bg-gray-800 border border-gray-700 w-20"
          />
        </label>
        <button
          onClick={handleActivate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Sending...' : 'Activate Pattern'}
        </button>
      </div>
      {message && <div className="text-green-400">{message}</div>}
    </div>
  );
}

////Ready for Real Hardware?
////When we get the controller, just replace the function in coneControl.ts with:
//export async function triggerPattern(patternNum: number) {
//  const response = await fetch("http://192.168.4.1/patterns", {
//    method: "POST",
//    headers: { "Content-Type": "application/json" },
//    body: JSON.stringify({ pattern: patternNum, state: true }),
//  });
//  return response.ok;
//}

