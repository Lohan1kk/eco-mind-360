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
          DEFAULT: "var(--forest, #163d2a)",
          mid: "var(--forest-mid, #2f7a4f)",
          deep: "#0d261a",
        },
        sprout: {
          DEFAULT: "var(--sprout, #c8efd4)",
          deep: "var(--sprout-deep, #3a9a5f)",
          light: "#e2f7ea",
        },
        mist: {
          DEFAULT: "var(--mist, #fbfdfb)",
          soft: "var(--mist-soft, #eef7f1)",
        },
        ash: "var(--ash, #5f675f)",
        earth: "var(--earth, #3a433c)",
        burn: "var(--burn, #9a6242)",
        ink: "var(--ink, #122018)",
        paper: "var(--paper, #ffffff)",
        line: "var(--line, rgba(22, 61, 42, 0.1))",
        biome: {
          amazonia: "#2f7a4f",
          cerrado: "#b45309",
          mata_atlantica: "#166534",
          caatinga: "#c2410c",
          pampa: "#4d7c0f",
          pantanal: "#0284c7",
          costeiro_marinho: "#2563eb",
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Source Sans 3", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 61, 42, 0.08)',
        'lift': '0 12px 30px -4px rgba(22, 61, 42, 0.12)',
        'sprout': '0 0 20px -4px rgba(58, 154, 95, 0.35)',
      }
    },
  },
  plugins: [],
};
export default config;
