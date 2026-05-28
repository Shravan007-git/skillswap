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
          50:  "#e6fdf7",
          100: "#b3f5e6",
          200: "#80edd5",
          300: "#4de4c3",
          400: "#1adbb2",
          500: "#00C896",
          600: "#00a87d",
          700: "#008864",
          800: "#00684b",
          900: "#004832",
        },
        accent: {
          50:  "#fff2ee",
          100: "#ffd5c9",
          200: "#ffb8a4",
          300: "#ff9b7f",
          400: "#ff7e5a",
          500: "#FF6B4A",
          600: "#e05030",
          700: "#b83520",
          800: "#901a10",
          900: "#680000",
        },
        surface: {
          50:  "#f4f6fb",
          100: "#e8ecf5",
          800: "#141B2D",
          850: "#0F1521",
          900: "#090E1A",
          950: "#060A12",
        },
        coin: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "bounce-soft": "bounceSoft 2s infinite",
        "pulse-glow": "pulseGlow 2s infinite",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,200,150,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,200,150,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "linear-gradient(135deg, #00C896 0%, #FF6B4A 100%)",
        "card-shine": "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
