export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Welcome to Football EyeQ!
      </h1>
      <p className="mb-6 text-lg">
        Your smart soccer exercise catalogue and session planner.
      </p>
      <ul className="list-disc ml-6 text-white/90">
        <li>Browse 100+ football training exercises</li>
        <li>Build and manage weekly session plans</li>
        <li>Control smart LED cones from the web</li>
        <li>Export plans to PDF and add coach notes</li>
      </ul>
      <p className="mt-10 text-sm text-gray-400">
        Use the navigation bar above to get started.
      </p>
    </div>
  );
}
