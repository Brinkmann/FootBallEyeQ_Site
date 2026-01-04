"use client";
import Link from "next/link";
import Image from "next/image";
import { aboutLinks, coreLinks, learnLinks, pricingLink, supportLinks } from "./navigation";
import CookiePreferences from "./CookiePreferences";

const footerColumns = [
  {
    title: "Training Tools",
    links: coreLinks,
  },
  {
    title: "Learn",
    links: learnLinks,
  },
  {
    title: "About",
    links: aboutLinks,
  },
  {
    title: "Support",
    links: [...supportLinks, pricingLink, { label: "Have a Club Code?", href: "/join-club" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/brand/logo-icon.png"
              alt="Football EyeQ"
              width={114}
              height={114}
              className="h-6 w-auto opacity-80"
            />
            <span className="text-white font-semibold">Football EyeQ</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 text-gray-500 text-sm">
            <CookiePreferences />
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Football EyeQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
