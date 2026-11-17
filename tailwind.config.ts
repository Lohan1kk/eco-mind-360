import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
          DEFAULT: "var(--background)",
          secondary: "var(--background-secondary)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          hover: "var(--surface-hover)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          secondary: "var(--foreground-secondary)",
        },
        muted: "var(--muted)",
        accent: {
          soft: "var(--accent-soft)",
          action: "var(--accent-action)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          dark: "var(--primary-dark)",
        },
        forest: {
          DEFAULT: "var(--primary)",
          mid: "var(--accent-action)",
          deep: "var(--foreground)",
        },
        sage: "var(--sage)",
        moss: "var(--moss)",
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        sprout: {
          DEFAULT: "var(--accent-action)",
          deep: "var(--primary)",
          light: "var(--accent-soft)",
        },
        mist: {
          DEFAULT: "var(--foreground)",
          soft: "var(--surface)",
        },
        ash: "var(--foreground-secondary)",
        earth: "var(--muted)",
        burn: "var(--danger)",
        ink: "var(--foreground)",
        paper: "var(--surface)",
        line: "var(--border)",
        biome: {
          amazonia: "var(--biome-amazonia)",
          cerrado: "var(--biome-cerrado)",
          mata_atlantica: "var(--biome-mata-atlantica)",
          caatinga: "var(--biome-caatinga)",
          pampa: "var(--biome-pampa)",
          pantanal: "var(--biome-pantanal)",
          costeiro_marinho: "var(--biome-costeiro-marinho)",
        },
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        md: "12px",
        lg: "12px",
        xl: "16px",
        "2xl": "16px",
        "3xl": "20px",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "var(--shadow-card)",
        lift: "var(--shadow-elevated)",
        glass: "var(--shadow-card)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
