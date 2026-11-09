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
        background: "var(--background)",
        foreground: "var(--foreground)",
        eco: {
          darkest: "#06090e",
          dark: "#0b111a",
          card: "#101826",
          cardHover: "#152238",
          border: "#1e2e42",
          borderBright: "#2a4260",
          emerald: "#10b981",
          cyan: "#06b6d4",
          amber: "#f59e0b",
          red: "#ef4444",
          blue: "#3b82f6",
          lime: "#84cc16",
        },
        biome: {
          amazonia: "#10b981",
          cerrado: "#d97706",
          mata_atlantica: "#059669",
          caatinga: "#ea580c",
          pampa: "#84cc16",
          pantanal: "#06b6d4",
          costeiro_marinho: "#3b82f6",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
