import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Lanka Market Pulse. Send us your feedback, questions, or partnership inquiries.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lanka-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-lanka-accent" />
          </div>
          <h1 className="text-3xl font-bold text-lanka-text-primary mb-3">Contact Us</h1>
          <p className="text-lanka-text-secondary">
            Have a question or feedback? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <ContactCard icon={<Mail className="w-5 h-5" />} title="Email" info="hello@lankamarketpulse.com" />
          <ContactCard icon={<MapPin className="w-5 h-5" />} title="Location" info="Colombo, Sri Lanka" />
          <ContactCard icon={<Phone className="w-5 h-5" />} title="Social" info="@LankaMarketPulse" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-lanka-text-primary mb-4">Send a Message</h2>
          <form
            action="https://formspree.io/f/YOUR_FORM_ID"
            method="POST"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-lanka-accent"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="advertising">Advertising</option>
                <option value="correction">Correction</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-lanka-text-secondary mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 bg-lanka-accent text-lanka-dark rounded-lg font-semibold hover:bg-lanka-accent-dim transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-8">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  info,
}: {
  icon: React.ReactNode;
  title: string;
  info: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="text-lanka-accent mb-2 flex justify-center">{icon}</div>
      <h3 className="text-sm font-semibold text-lanka-text-primary mb-1">{title}</h3>
      <p className="text-xs text-lanka-text-muted">{info}</p>
    </div>
  );
}
