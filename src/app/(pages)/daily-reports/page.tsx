// NO "use client" here — this is a Server Component
import { getReports, getDailyBriefing } from "@/lib/data";
import DailyReportsClient from "./DailyReportsClient";

export default function DailyReportsPage() {
  const reports = getReports();
  const briefing = getDailyBriefing();

  return <DailyReportsClient reports={reports} briefing={briefing} />;
}