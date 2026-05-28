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
        // Gunmetal — dark blue-grey metallic
        gunmetal: {
          50:  "#f0f2f4",
          100: "#d8dde3",
          200: "#b2bbc6",
          300: "#8896a6",
          400: "#617585",
          500: "#445566",
          600: "#334455",
          700: "#243040",
          800: "#161D27",
          900: "#0D1117",
          950: "#080C10",
        },
        // Burgundy — deep wine red
        burgundy: {
          50:  "#fdf0f2",
          100: "#fad5da",
          200: "#f2a8b3",
          300: "#e07080",
          400: "#c83850",
          500: "#9B1B30",
          600: "#800020",
          700: "#620018",
          800: "#450010",
          900: "#2C000A",
          950: "#160004",
        },
        // Warm silver / steel highlights
        steel: {
          50:  "#f4f6f8",
          100: "#e2e8ed",
          200: "#c4d0db",
          300: "#9aafc0",
          400: "#6e8ea3",
          500: "#4e6f85",
          600: "#3a556b",
          700: "#2a3d50",
          800: "#1C2A36",
          900: "#111820",
          950: "#080C10",
        },
        coin: "#C8A96E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":       "fadeIn 0.5s ease-out",
        "slide-up":      "slideUp 0.6s cubic-bezier(0.16,1,0.3,1)",
        "slide-right":   "slideInRight 0.5s cubic-bezier(0.16,1,0.3,1)",
        "float":         "float 7s ease-in-out infinite",
        "pulse-slow":    "pulseSlow 3s ease-in-out infinite",
        "shimmer":       "shimmer 2s infinite",
        "ripple":        "rippleOut 0.9s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rippleOut: {
          "0%":   { transform: "translate(-50%,-50%) scale(0)", opacity: "1" },
          "100%": { transform: "translate(-50%,-50%) scale(18)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
