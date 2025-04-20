/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Covers all React components
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        bree: ["Bree Serif", "serif"],
        caveat: ["Caveat", "cursive"],
        comfort: ["Comfort", "cursive"],
        gloria: ["Gloria Hallelujah", "cursive"],
        indie: ["Indie Flower", "cursive"],
        macondo: ["Macondo", "cursive"],
        protest: ["Protest Riot", "cursive"],
        shadows: ["Shadows Into Light", "cursive"],
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
