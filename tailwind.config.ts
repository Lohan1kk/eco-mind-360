import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#064e3b",
          mid: "#059669",
          deep: "#022c22",
        },
        sprout: {
          DEFAULT: "#a7f3d0",
          deep: "#10b981",
          light: "#ecfdf5",
        },
        mist: {
          DEFAULT: "#f8fafc",
          soft: "#f1f5f9",
        },
        ash: "#64748b",
        earth: "#334155",
        burn: "#f97316",
        ink: "#0f172a",
        paper: "#ffffff",
        line: "rgba(16, 185, 129, 0.12)",
        biome: {
          amazonia: "#059669",
          cerrado: "#d97706",
          mata_atlantica: "#047857",
          caatinga: "#ea580c",
          pampa: "#65a30d",
          pantanal: "#0284c7",
          costeiro_marinho: "#2563eb",
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(6, 78, 59, 0.06)',
        'lift': '0 12px 32px -4px rgba(6, 78, 59, 0.12)',
        'glow-emerald': '0 0 30px -4px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 30px -4px rgba(14, 165, 233, 0.35)',
        'glass': '0 8px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }
    },
  },
  plugins: [],
};
export default config;
