import type { Metadata } from "next";
import Link from "next/link";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing Football EyeQ, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please discontinue use immediately.",
  },
  {
    title: "Use of the Service",
    content:
      "You may use the platform to browse drills, plan sessions, and collaborate with your team. You agree not to misuse the service, interfere with other users, or attempt to reverse engineer protected features.",
  },
  {
    title: "Accounts and Security",
    content:
      "You are responsible for safeguarding login credentials and ensuring that anyone accessing your account is authorized. Notify us of unauthorized access so we can investigate and help secure your account.",
  },
  {
    title: "Payments and Subscriptions",
    content:
      "Premium features may require a subscription. Fees, renewal periods, and cancellation timing are disclosed at checkout. Refunds may be limited by applicable consumer laws in your region.",
  },
  {
    title: "Content and Intellectual Property",
    content:
      "All brand assets, training materials, and platform features are owned by Football EyeQ or its licensors. You may not reproduce or redistribute protected content without permission.",
  },
  {
    title: "Limitation of Liability",
    content:
      "The service is provided \"as is\" without warranties. To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from use of the platform.",
  },
  {
    title: "Changes to These Terms",
    content:
      "We may update these Terms to reflect product, security, or regulatory changes. Material updates will be highlighted in-app or via email when possible.",
  },
  {
    title: "Contact",
    content:
      "Questions? Reach us at support@footballeyeq.com or via the Contact page.",
  },
];

export const metadata: Metadata = {
  title: "Terms of Service | Football EyeQ",
  description: "Terms governing your use of the Football EyeQ platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Legal</p>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-lg text-foreground/80">
            These terms explain how you can use Football EyeQ. Please review them alongside our <Link className="text-primary underline" href="/privacy">Privacy Policy</Link>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.title} className="p-6 rounded-2xl border border-divider bg-card shadow-sm space-y-2">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="text-foreground/80 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-divider bg-card shadow-sm space-y-2">
          <h2 className="text-xl font-semibold">Regional considerations</h2>
          <p className="text-foreground/80 leading-relaxed">
            If your region imposes age or consent requirements for online services, you must ensure authorized use (for example,
            parental consent for minors). If age-gating applies to your organization, please confirm eligibility before granting
            access to the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
