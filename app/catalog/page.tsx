"use client";

import { useEffect, useState } from "react";

interface Exercise {
  id: string;
  title: string;
  overview: string;
  exerciseType: string;
  difficulty: string;
}

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog("✅ CatalogPage component mounted");
    addLog("🔄 Starting drill fetch...");

    async function loadDrills() {
      try {
        addLog("📡 Calling fetch('/api/exercises')");
        const response = await fetch("/api/exercises", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        addLog(`📊 Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorText = await response.text();
          addLog(`❌ API Error: ${errorText}`);
          throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        addLog(`✅ Received data with ${data?.exercises?.length || 0} exercises`);

        if (data?.exercises && Array.isArray(data.exercises)) {
          setExercises(data.exercises);
          addLog(`🎉 Successfully loaded ${data.exercises.length} drills!`);
        } else {
          addLog(`❌ Invalid response format: ${JSON.stringify(data).substring(0, 100)}`);
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        addLog(`💥 Fetch error: ${errorMsg}`);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
        addLog("✋ Loading complete");
      }
    }

    loadDrills();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Drill Catalogue Debug Mode</h1>
        <p className="text-gray-600 mb-8">Testing drill loading with full diagnostics</p>

        {/* Debug Logs */}
        <div className="mb-8 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-xs overflow-auto max-h-60">
          <div className="font-bold mb-2">🔍 Debug Log:</div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">Waiting for logs...</div>}
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-2xl font-bold">
              {isLoading ? "🔄 Loading" : error ? "❌ Error" : "✅ Loaded"}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Drills Found</div>
            <div className="text-2xl font-bold">{exercises.length}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Logs</div>
            <div className="text-2xl font-bold">{logs.length}</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="text-xl font-bold text-red-800 mb-2">❌ Error Occurred</div>
            <div className="text-red-700 font-mono text-sm">{error}</div>
          </div>
        )}

        {/* Loading Display */}
        {isLoading && !error && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading drills...</p>
            <p className="text-gray-500 mt-2">Check the debug log above for details</p>
          </div>
        )}

        {/* Drills Display */}
        {!isLoading && exercises.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              ✅ Success! Loaded {exercises.length} Drills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.slice(0, 12).map((exercise) => (
                <div key={exercise.id} className="border-2 border-green-200 rounded-lg p-4 bg-green-50 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{exercise.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{exercise.overview?.substring(0, 150)}...</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{exercise.exerciseType}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">{exercise.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
            {exercises.length > 12 && (
              <p className="text-center mt-6 text-gray-600">
                Showing 12 of {exercises.length} drills
              </p>
            )}
          </div>
        )}

        {/* No Drills Display */}
        {!isLoading && !error && exercises.length === 0 && (
          <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-xl font-semibold text-gray-700">No drills found</p>
            <p className="text-gray-600 mt-2">The API returned successfully but with 0 drills</p>
          </div>
        )}
      </div>
    </div>
  );
}
