import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-xl text-center space-y-4">
        <div className="text-6xl">🧭</div>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-foreground opacity-70">
          We couldn&apos;t find the page you&apos;re looking for. Use the links below to get back on
          track or explore the most popular areas of the site.
        </p>
        <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-button rounded-lg hover:bg-primary-hover transition-colors"
          >
            Return home
          </Link>
          <Link
            href="/catalog"
            className="px-4 py-2 border border-divider text-foreground rounded-lg hover:bg-card"
          >
            Browse drills
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 border border-divider text-foreground rounded-lg hover:bg-card"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
