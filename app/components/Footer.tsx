"use client";
import Link from "next/link";
import { aboutLinks, coreLinks, learnLinks, pricingLink, supportLinks } from "./navigation";
import { useTranslations } from "./LocalizationProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const footerColumns = [
  {
    titleKey: "footer.trainingTools",
    fallback: "Training Tools",
    links: coreLinks,
  },
  {
    titleKey: "footer.learn",
    fallback: "Learn",
    links: learnLinks,
  },
  {
    titleKey: "footer.about",
    fallback: "About",
    links: aboutLinks,
  },
  {
    titleKey: "footer.support",
    fallback: "Support",
    links: [...supportLinks, pricingLink],
  },
];

export default function Footer() {
  const { t, formatNumber } = useTranslations();
  const getLinkLabel = (link: { labelKey: string; fallback: string }) => t(link.labelKey, link.fallback);
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {t(column.titleKey, column.fallback)}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition text-sm"
                    >
                      {getLinkLabel(link)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <img src="/brand/logo-icon.png" alt={t("common.siteName")}
              className="h-6 w-auto opacity-80" />
            <span className="text-white font-semibold">{t("common.siteName")}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <LanguageSwitcher />
            <p className="text-gray-500 text-sm">
              &copy; {formatNumber(new Date().getFullYear())} {t("common.siteName")}. {t("footer.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
