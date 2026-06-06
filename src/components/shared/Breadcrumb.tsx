"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-lanka-text-muted flex-wrap">
        <li>
          <Link href="/" className="hover:text-lanka-accent transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5" />
            {item.href ? (
              <Link href={item.href} className="hover:text-lanka-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-lanka-text-primary font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
