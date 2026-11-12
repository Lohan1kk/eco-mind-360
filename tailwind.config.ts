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
        background: {
          DEFAULT: "#101512",
          secondary: "#131A16",
        },
        surface: {
          DEFAULT: "#171F1A",
          elevated: "#1D2821",
          hover: "#243129",
        },
        foreground: {
          DEFAULT: "#DCE5DD",
          secondary: "#A7B3A9",
        },
        muted: "#78877D",
        primary: {
          DEFAULT: "#789B7C",
          hover: "#91B596",
          dark: "#365C40",
        },
        forest: {
          DEFAULT: "#294C35",
          mid: "#789B7C",
          deep: "#101512",
        },
        sage: "#91A88F",
        moss: "#667F61",
        border: {
          DEFAULT: "#29362D",
          subtle: "#222D25",
        },
        success: "#83A989",
        warning: "#A9A17A",
        danger: "#A77D78",
        // Semantic aliases mapped to Dark Botanical + Swiss Minimalism palette
        sprout: {
          DEFAULT: "#91A88F",
          deep: "#789B7C",
          light: "#1D2821",
        },
        mist: {
          DEFAULT: "#DCE5DD",
          soft: "#171F1A",
        },
        ash: "#A7B3A9",
        earth: "#78877D",
        burn: "#A77D78",
        ink: "#DCE5DD",
        paper: "#171F1A",
        line: "#222D25",
        biome: {
          amazonia: "#789B7C",
          cerrado: "#A9A17A",
          mata_atlantica: "#83A989",
          caatinga: "#91A88F",
          pampa: "#667F61",
          pantanal: "#5A8068",
          costeiro_marinho: "#4C6E58",
        },
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "7px",
        md: "7px",
        lg: "10px",
        xl: "10px",
        "2xl": "14px",
        "3xl": "14px",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.45)",
        lift: "0 12px 32px -4px rgba(0, 0, 0, 0.6)",
        "glow-emerald": "0 8px 24px -4px rgba(0, 0, 0, 0.5)",
        "glow-cyan": "0 8px 24px -4px rgba(0, 0, 0, 0.5)",
        glass: "0 8px 30px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
