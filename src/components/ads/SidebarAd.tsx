"use client";

import { AdSenseAd } from "./AdSenseAd";

export function SidebarAd() {
  return (
    <div className="sticky top-24">
      <AdSenseAd 
        slot="SIDEBAR_SLOT_ID" 
        format="vertical"
        style={{ minHeight: "600px" }}
        className="min-h-[600px]"
      />
    </div>
  );
}
