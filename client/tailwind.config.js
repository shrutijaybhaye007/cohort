/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F6F3EC",
        surface: "#FFFFFF",
        ink: "#1B2420",
        "ink-soft": "#4A5750",
        forest: {
          DEFAULT: "#2F5233",
          dark: "#1F3A26",
          light: "#4A7052",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E4C660",
          dark: "#9C7D1B",
        },
        walnut: "#6B4F3B",
        line: "#E4DFD1",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'General Sans'", "Inter", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,36,32,0.04), 0 8px 24px -12px rgba(27,36,32,0.12)",
      },
      keyframes: {
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "slide-up": "slide-up 0.2s ease-out both",
        "fade-in": "fade-in 0.15s ease-out both",
      },
    },
  },
  plugins: [
    // scrollbar-hide utility
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
