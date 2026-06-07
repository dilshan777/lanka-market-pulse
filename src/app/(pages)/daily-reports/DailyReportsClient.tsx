"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Clock, Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AdPlaceholder } from "@/components/ads/AdPlaceholder";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { formatDate } from "@/lib/utils";
import type { Report, DailyBriefing } from "@/types";

interface Props {
  reports: Report[];
  briefing: DailyBriefing | null;
}

export default function DailyReportsClient({ reports, briefing }: Props) {
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("daily");

  const handleGeneratePDF = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);
    alert("PDF generation would be handled by the API route in production.");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Daily Reports" }]} />

      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-lanka-accent" />
        <div>
          <h1 className="text-3xl font-bold text-lanka-text-primary">Daily Reports</h1>
          <p className="text-sm text-lanka-text-muted">AI-generated market summaries and analysis</p>
        </div>
      </div>

      {/* PDF Generator */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-lanka-accent/10 to-lanka-blue/10 border border-lanka-accent/20 rounded-xl p-6">
          <h2 className="text-lg font-bold text-lanka-text-primary mb-4">Generate Custom Report</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    reportType === type
                      ? "bg-lanka-accent text-lanka-dark"
                      : "bg-muted text-lanka-text-secondary hover:bg-lanka-accent/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-2 bg-lanka-accent text-lanka-dark rounded-lg font-medium hover:bg-lanka-accent-dim transition-colors disabled:opacity-50"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
              ) : (
                <><Download className="w-4 h-4" />Generate PDF</>
              )}
            </button>
          </div>
          <p className="text-xs text-lanka-text-muted mt-3">
            PDFs are generated on-demand and automatically removed after download.
          </p>
        </div>
      </section>

      {/* Daily Briefing */}
      {briefing && (
        <section className="mb-8">
          <SectionHeader title="Today's AI Market Briefing" subtitle={formatDate(briefing.date)} />
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-lanka-text-primary mb-3">Market Summary</h3>
                <p className="text-sm text-lanka-text-secondary leading-relaxed">{briefing.marketSummary}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-lanka-text-primary mb-3">Key Highlights</h3>
                <ul className="space-y-1.5">
                  {briefing.keyHighlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-lanka-text-secondary flex items-start gap-2">
                      <span className="text-lanka-accent mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-lanka-text-muted italic">
                <span className="font-medium text-lanka-text-secondary">Outlook:</span>{" "}
                {briefing.outlook}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SectionHeader title="Report Archive" subtitle="Browse past market reports" />
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-card border border-border rounded-xl p-5 hover:border-lanka-accent/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          report.type === "daily" ? "bg-lanka-accent/10 text-lanka-accent"
                          : report.type === "weekly" ? "bg-lanka-blue/10 text-lanka-blue"
                          : "bg-lanka-yellow/10 text-lanka-yellow"
                        }`}>
                          {report.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-lanka-text-muted">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.date)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-lanka-text-primary mb-2">{report.title}</h3>
                      <p className="text-sm text-lanka-text-secondary line-clamp-2">{report.summary}</p>
                    </div>
                    <button
                      onClick={handleGeneratePDF}
                      className="flex-shrink-0 p-2 rounded-lg bg-muted hover:bg-lanka-accent/10 text-lanka-text-secondary hover:text-lanka-accent transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-lanka-text-muted mx-auto mb-4" />
              <p className="text-lanka-text-muted">No reports available yet.</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement" className="h-[250px]" />
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-lanka-text-primary mb-4">Report Types</h3>
            <div className="space-y-3">
              {[
                { type: "Daily", desc: "End-of-day market summary with key highlights", icon: <Clock className="w-4 h-4" /> },
                { type: "Weekly", desc: "Comprehensive weekly market analysis", icon: <Calendar className="w-4 h-4" /> },
                { type: "Monthly", desc: "In-depth monthly economic and market report", icon: <FileText className="w-4 h-4" /> },
              ].map(({ type, desc, icon }) => (
                <div key={type} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-lanka-accent mt-0.5">{icon}</div>
                  <div>
                    <div className="text-sm font-medium text-lanka-text-primary">{type}</div>
                    <div className="text-xs text-lanka-text-muted">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AdPlaceholder label="Advertisement" className="h-[250px]" />
        </aside>
      </div>
    </div>
  );
}