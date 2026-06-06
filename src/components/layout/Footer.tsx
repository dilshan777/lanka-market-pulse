import Link from "next/link";
import { Twitter, Facebook, Linkedin, Rss, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-lanka-accent rounded flex items-center justify-center">
                <span className="text-lanka-dark font-bold text-sm">LMP</span>
              </div>
              <span className="font-bold text-lanka-text-primary">Lanka Market Pulse</span>
            </div>
            <p className="text-sm text-lanka-text-muted mb-4">
              Sri Lanka&apos;s premier financial news platform. Real-time stock market updates, 
              business news, economic reports, and AI-powered market briefings.
            </p>
            <div className="flex gap-3">
              <SocialLink href="https://twitter.com/LankaMarketPulse" label="Twitter">
                <Twitter className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://facebook.com/LankaMarketPulse" label="Facebook">
                <Facebook className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="https://linkedin.com/company/lanka-market-pulse" label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </SocialLink>
              <SocialLink href="/rss.xml" label="RSS Feed">
                <Rss className="w-4 h-4" />
              </SocialLink>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lanka-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/stock-market/">Stock Market</FooterLink>
              <FooterLink href="/business/">Business News</FooterLink>
              <FooterLink href="/economic/">Economic News</FooterLink>
              <FooterLink href="/daily-reports/">Daily Reports</FooterLink>
              <FooterLink href="/search/">Search</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lanka-text-primary mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about/">About Us</FooterLink>
              <FooterLink href="/contact/">Contact</FooterLink>
              <FooterLink href="/newsletter/">Newsletter</FooterLink>
              <FooterLink href="/privacy/">Privacy Policy</FooterLink>
              <FooterLink href="/disclaimer/">Disclaimer</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lanka-text-primary mb-4">Daily Briefing</h3>
            <p className="text-sm text-lanka-text-muted mb-4">
              Get the latest market updates delivered to your inbox every morning.
            </p>
            <form 
              action="https://formspree.io/f/YOUR_FORM_ID" 
              method="POST"
              className="flex gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-lanka-text-muted focus:outline-none focus:ring-2 focus:ring-lanka-accent"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-lanka-accent text-lanka-dark rounded-lg hover:bg-lanka-accent-dim transition-colors"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-lanka-text-muted">
            &copy; {new Date().getFullYear()} Lanka Market Pulse. All rights reserved.
          </p>
          <p className="text-xs text-lanka-text-muted">
            Data provided for informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-lanka-text-secondary hover:text-lanka-accent transition-colors">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-lg bg-muted hover:bg-lanka-accent hover:text-lanka-dark transition-colors text-lanka-text-secondary"
    >
      {children}
    </a>
  );
}
