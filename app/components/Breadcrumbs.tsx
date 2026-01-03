"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const formatSegment = (segment: string) =>
  segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const NON_LINKABLE_SEGMENTS = ["club", "admin", "learn"];

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 2) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLinkable = !NON_LINKABLE_SEGMENTS.includes(segment.toLowerCase());
    return { label: formatSegment(segment), href, isLinkable };
  });

  return (
    <nav className="px-4 sm:px-6 py-3 text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="text-[#e63946] hover:underline font-medium">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {index === crumbs.length - 1 || !crumb.isLinkable ? (
              <span className="text-gray-800 font-medium">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-[#e63946] hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
