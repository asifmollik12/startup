import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#C8102E",
          dark: "#0A0A0A",
          gold: "#B8960C",
          gray: "#F5F5F0",
          border: "#E5E5E5",
          muted: "#6B7280",
          card: "#FFFFFF",
          surface: "#F9F9F7",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        shrink: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        uploadProgress: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shrink: "shrink 3s linear forwards",
        uploadProgress: "uploadProgress 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
