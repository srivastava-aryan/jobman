import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F7F5",
        surface: "#FFFFFF",
        border: "#E2E4DF",
        ink: {
          900: "#1B1F1D",
          600: "#4B5249",
          400: "#6B7268",
          300: "#9AA096",
        },
        accent: {
          DEFAULT: "#2F6F4F",
          soft: "#E7F0EA",
          strong: "#1F4D36",
        },
        warn: {
          DEFAULT: "#B45309",
          soft: "#FBF0E1",
        },
        danger: {
          DEFAULT: "#B42318",
          soft: "#FBEAE9",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
