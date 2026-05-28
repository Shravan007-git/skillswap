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
        // Bloodstone — deep crimson reds
        blood: {
          50:  "#fdf2f2",
          100: "#fad5d5",
          200: "#f5a8a8",
          300: "#eb6e6e",
          400: "#d94040",
          500: "#C42B2B",
          600: "#A01F1F",
          700: "#7D1414",
          800: "#5A0C0C",
          900: "#380606",
          950: "#1E0303",
        },
        // Misty sage — muted dusty greens
        sage: {
          50:  "#f2f6f2",
          100: "#deeade",
          200: "#bad5bb",
          300: "#8FBA91",
          400: "#6B9E6E",
          500: "#507A53",
          600: "#3C5E3F",
          700: "#2A432C",
          800: "#1A2B1C",
          900: "#0E170F",
          950: "#070D08",
        },
        surface: {
          50:  "#F5EFEF",
          900: "#110909",
          925: "#0D0707",
          950: "#080505",
        },
        coin: "#D4A853",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":       "fadeIn 0.5s ease-out",
        "slide-up":      "slideUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        "slide-right":   "slideInRight 0.5s cubic-bezier(0.16,1,0.3,1)",
        "float":         "float 6s ease-in-out infinite",
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
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.6" },
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
