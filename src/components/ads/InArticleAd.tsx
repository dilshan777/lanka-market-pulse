"use client";

import { AdSenseAd } from "./AdSenseAd";

export function InArticleAd() {
  return (
    <div className="my-8">
      <AdSenseAd 
        slot="IN_ARTICLE_SLOT_ID" 
        format="fluid"
        className="min-h-[250px]"
      />
    </div>
  );
}
