import { Shield } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Lanka Market Pulse Privacy Policy. Learn how we collect, use, and protect your personal information.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lanka-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-lanka-accent" />
          </div>
          <h1 className="text-3xl font-bold text-lanka-text-primary mb-3">Privacy Policy</h1>
          <p className="text-lanka-text-secondary">Last updated: June 6, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Introduction</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              Lanka Market Pulse (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-lanka-text-primary mb-2">Personal Information</h3>
                <p className="text-lanka-text-secondary leading-relaxed">
                  We may collect personal information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-lanka-text-secondary">
                  <li>Email address (when subscribing to our newsletter)</li>
                  <li>Name (optional, when contacting us)</li>
                  <li>Contact information (when submitting inquiries)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-lanka-text-primary mb-2">Automatically Collected Information</h3>
                <p className="text-lanka-text-secondary leading-relaxed">
                  When you visit our website, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-lanka-text-secondary">
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">How We Use Your Information</h2>
            <p className="text-lanka-text-secondary leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lanka-text-secondary">
              <li>Providing and maintaining our website</li>
              <li>Sending newsletters and market updates (with your consent)</li>
              <li>Responding to your inquiries and feedback</li>
              <li>Analyzing website usage and improving our services</li>
              <li>Displaying relevant advertisements</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Cookies and Tracking</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, 
              analyze website traffic, and personalize content. You can control cookies through your 
              browser settings. We use:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-lanka-text-secondary">
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Google AdSense:</strong> For displaying relevant advertisements</li>
              <li><strong>Essential cookies:</strong> For website functionality and preferences (dark mode)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Third-Party Services</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              We may use third-party services that collect, monitor, and analyze information. These include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-lanka-text-secondary">
              <li>Google Analytics (website analytics)</li>
              <li>Google AdSense (advertising)</li>
              <li>Cloudflare (CDN and security)</li>
              <li>Formspree (contact form handling)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Data Security</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the Internet or electronic storage is 100% secure. While 
              we strive to use commercially acceptable means to protect your information, we cannot 
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Your Rights</h2>
            <p className="text-lanka-text-secondary leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lanka-text-secondary">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Contact Us</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@lankamarketpulse.com" className="text-lanka-accent hover:underline">
                privacy@lankamarketpulse.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
