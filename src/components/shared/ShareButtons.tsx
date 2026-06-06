"use client";

import { Twitter, Facebook, Linkedin, Link2, Mail } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButtons({ title, url, description = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#1DA1F2] hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#4267B2] hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077B5] hover:text-white",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      color: "hover:bg-lanka-accent hover:text-lanka-dark",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-lanka-text-muted font-medium">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
          className={`p-2 rounded-lg bg-muted text-lanka-text-secondary transition-colors ${link.color}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className={`p-2 rounded-lg bg-muted text-lanka-text-secondary transition-colors hover:bg-lanka-accent hover:text-lanka-dark ${copied ? "bg-lanka-green/20 text-lanka-green" : ""}`}
      >
        <Link2 className="w-4 h-4" />
      </button>
      {copied && (
        <span className="text-xs text-lanka-green font-medium">Copied!</span>
      )}
    </div>
  );
}
