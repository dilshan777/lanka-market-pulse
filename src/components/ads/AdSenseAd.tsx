"use client";

import { useEffect, useRef } from "react";

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
}

export function AdSenseAd({ 
  slot, 
  style = {}, 
  className = "", 
  format = "auto",
  responsive = true 
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div ref={adRef} className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client="ca-pub-YOUR_ADSENSE_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
