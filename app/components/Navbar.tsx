'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
  { href: "/planner", label: "Planner" },
  { href: "/cones", label: "Cones" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex gap-8 shadow mb-8">
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`hover:underline transition ${
            pathname === href ? "font-bold underline text-blue-400" : ""
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
