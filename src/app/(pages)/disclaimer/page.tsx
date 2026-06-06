import { AlertTriangle } from "lucide-react";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description:
    "Important disclaimers and legal notices for Lanka Market Pulse users. Read our terms of use and investment disclaimer.",
  path: "/disclaimer/",
});

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Disclaimer" }]} />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lanka-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-lanka-yellow" />
          </div>
          <h1 className="text-3xl font-bold text-lanka-text-primary mb-3">Disclaimer</h1>
          <p className="text-lanka-text-secondary">Please read carefully before using our services</p>
        </div>

        <div className="bg-lanka-yellow/5 border border-lanka-yellow/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-lanka-yellow mb-3">Investment Risk Warning</h2>
          <p className="text-sm text-lanka-text-secondary leading-relaxed">
            The information provided on Lanka Market Pulse is for informational and educational purposes 
            only. It does not constitute investment advice, financial advice, trading advice, or any other 
            sort of advice. You should not treat any of the website&apos;s content as such.
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Not Financial Advice</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              Lanka Market Pulse does not provide personalized investment recommendations. All content, 
              including articles, reports, market data, and analysis, is provided for general information 
              purposes only. You should consult with a qualified financial advisor before making any 
              investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Accuracy of Information</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              While we strive to provide accurate and up-to-date information, we make no representations 
              or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
              suitability, or availability of the information, products, services, or related graphics 
              contained on the website.
            </p>
            <p className="text-lanka-text-secondary leading-relaxed mt-4">
              Market data displayed on this website may be delayed or subject to errors. Always verify 
              critical information with official sources such as the Colombo Stock Exchange (CSE) or the 
              Central Bank of Sri Lanka (CBSL).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Investment Risks</h2>
            <p className="text-lanka-text-secondary leading-relaxed mb-4">
              Investing in securities involves risks, including the possible loss of principal. Past 
              performance is not indicative of future results. The value of investments may fluctuate, 
              and investors may not get back the amount invested.
            </p>
            <p className="text-lanka-text-secondary leading-relaxed">
              Specifically, investments in Sri Lankan securities are subject to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-lanka-text-secondary">
              <li>Market risk and volatility</li>
              <li>Currency exchange risk</li>
              <li>Political and regulatory risk</li>
              <li>Liquidity risk</li>
              <li>Interest rate risk</li>
              <li>Inflation risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">AI-Generated Content</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              Some content on this website, including daily market briefings and summaries, is generated 
              using artificial intelligence (AI) tools. While we review AI-generated content for accuracy, 
              AI systems may produce errors, omissions, or outdated information. AI-generated content 
              should not be relied upon as the sole basis for investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Third-Party Content</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              Our website may contain links to third-party websites or content from third-party sources. 
              We do not endorse, control, or assume responsibility for the content, privacy policies, 
              or practices of any third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Advertising</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              This website displays advertisements through Google AdSense and other advertising networks. 
              We do not endorse the products or services advertised. Advertisements are clearly labeled 
              and distinguished from editorial content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Limitation of Liability</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              In no event shall Lanka Market Pulse, its owners, employees, or affiliates be liable for 
              any direct, indirect, incidental, special, consequential, or punitive damages arising out 
              of or in connection with your use of the website or the information contained herein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Changes to This Disclaimer</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              We reserve the right to modify this disclaimer at any time. Changes will be effective 
              immediately upon posting to the website. Your continued use of the website after any 
              changes constitutes acceptance of the modified disclaimer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-lanka-text-primary mb-4">Contact</h2>
            <p className="text-lanka-text-secondary leading-relaxed">
              If you have any questions about this disclaimer, please contact us at{" "}
              <a href="mailto:legal@lankamarketpulse.com" className="text-lanka-accent hover:underline">
                legal@lankamarketpulse.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
