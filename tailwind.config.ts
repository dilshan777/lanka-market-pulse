import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bloomberg-inspired palette
        "lanka-dark": "#0a0a0f",
        "lanka-card": "#12121a",
        "lanka-border": "#1e1e2e",
        "lanka-accent": "#00d4aa",
        "lanka-accent-dim": "#00a884",
        "lanka-red": "#ff4d4d",
        "lanka-green": "#00d4aa",
        "lanka-blue": "#3b82f6",
        "lanka-yellow": "#f59e0b",
        "lanka-text": {
          primary: "#e2e2e8",
          secondary: "#8b8b9a",
          muted: "#5a5a6a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
