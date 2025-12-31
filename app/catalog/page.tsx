import CatalogPageClient from "./CatalogPageClient";
import { headers } from "next/headers";
import { Exercise } from "../types/exercise";

async function fetchInitialExercises(): Promise<Exercise[]> {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const forwardedProto = hdrs.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host?.includes("localhost") ? "http" : "https");
  const origin = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_SITE_URL;

  if (!origin) return [];

  try {
    const res = await fetch(`${origin}/api/exercises`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (Array.isArray(data?.exercises)) {
      return data.exercises as Exercise[];
    }
  } catch (error) {
    console.error("Failed to prefetch exercises:", error);
  }

  return [];
}

export default async function CatalogPage() {
  const initialExercises = await fetchInitialExercises();
  return <CatalogPageClient initialExercises={initialExercises} />;
}
