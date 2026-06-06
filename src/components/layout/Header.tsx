"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { getMarketColor, formatNumber, formatPercent } from "@/lib/utils";
import type { MarketData } from "@/types";

interface HeaderProps {
  marketData: MarketData[];
}

export function Header({ marketData }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Market Ticker */}
      <div className="bg-lanka-dark border-b border-lanka-border overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker flex items-center gap-8 py-1.5 text-xs">
            {[...marketData, ...marketData].map((data, i) => (
              <div key={`${data.index}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-semibold text-lanka-text-primary">{data.index}</span>
                <span className="text-lanka-text-secondary">{formatNumber(data.value, 2)}</span>
                <span className={getMarketColor(data.change)} className="flex items-center gap-0.5">
                  {data.change > 0 ? <TrendingUp className="w-3 h-3" /> : data.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {formatPercent(data.changePercent)}
                </span>
                <span className="text-lanka-text-muted">Vol: {formatNumber(data.volume)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lanka-accent rounded flex items-center justify-center">
              <span className="text-lanka-dark font-bold text-sm">LMP</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-lanka-text-primary leading-tight">Lanka Market Pulse</h1>
              <p className="text-[10px] text-lanka-text-muted -mt-0.5">Sri Lanka&apos;s Financial News Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/stock-market/">Stock Market</NavLink>
            <NavLink href="/business/">Business</NavLink>
            <NavLink href="/economic/">Economic</NavLink>
            <NavLink href="/daily-reports/">Reports</NavLink>
            <NavLink href="/search/">
              <Search className="w-4 h-4" />
            </NavLink>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/search/"
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/stock-market/" onClick={() => setMobileMenuOpen(false)}>Stock Market</MobileNavLink>
            <MobileNavLink href="/business/" onClick={() => setMobileMenuOpen(false)}>Business</MobileNavLink>
            <MobileNavLink href="/economic/" onClick={() => setMobileMenuOpen(false)}>Economic</MobileNavLink>
            <MobileNavLink href="/daily-reports/" onClick={() => setMobileMenuOpen(false)}>Daily Reports</MobileNavLink>
            <MobileNavLink href="/newsletter/" onClick={() => setMobileMenuOpen(false)}>Newsletter</MobileNavLink>
            <MobileNavLink href="/about/" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/contact/" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-lanka-text-secondary hover:text-lanka-accent transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-lanka-text-secondary hover:text-lanka-accent transition-colors py-2"
    >
      {children}
    </Link>
  );
}
