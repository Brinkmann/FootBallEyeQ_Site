import type { Metadata } from "next";
import Link from "next/link";

const dataPractices = [
  {
    title: "Data we collect",
    content:
      "We collect account details you provide (such as name and email), activity logs related to session planning, and limited technical data like device type and browser version.",
  },
  {
    title: "How we use data",
    content:
      "Data helps us deliver training tools, personalize content, process payments, and troubleshoot reliability issues.",
  },
  {
    title: "Analytics and cookies",
    content:
      "With your permission, we record privacy-safe analytics events for key actions like signups, purchases, sharing, and errors. You can change this preference at any time using Cookie Preferences.",
  },
  {
    title: "Sharing",
    content:
      "We do not sell personal data. Limited data may be shared with service providers (for example, payment and hosting) under contracts that require safeguarding your information.",
  },
  {
    title: "Retention",
    content:
      "We keep data only as long as needed to provide the service or comply with legal obligations. You may request deletion of your account where applicable.",
  },
  {
    title: "Your choices",
    content:
      "You can review cookie preferences, opt out of analytics, and request access or deletion of your data by contacting support@footballeyeq.com.",
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | Football EyeQ",
  description: "Learn how Football EyeQ collects, uses, and safeguards your information.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Legal</p>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-lg text-foreground/80">
            We prioritize player privacy and transparent data practices. Review this policy alongside our <Link className="text-primary underline" href="/terms">Terms of Service</Link>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataPractices.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl border border-divider bg-card shadow-sm space-y-2">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-foreground/80 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-divider bg-card shadow-sm space-y-2">
          <h2 className="text-xl font-semibold">Children and regional requirements</h2>
          <p className="text-foreground/80 leading-relaxed">
            Football EyeQ is designed for coaches and teams. If your region requires parental consent or age verification,
            please obtain it before allowing minors to use the service. Contact us if you need additional assurances for your
            locality.
          </p>
        </div>
      </div>
    </div>
  );
}
