/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'quantum-primary': '#0D1117', // A deep, dark blue, almost black
        'quantum-secondary': '#1A237E', // A vibrant, dark blue
        'quantum-accent': '#43CEA2', // A bright, energetic green/teal
        'quantum-glow': '#18E6D9', // A lighter, glowing teal for highlights
        'quantum-text': '#E6F1FF', // A soft, off-white for text
        'quantum-text-muted': '#A0AEC0', // A muted gray for secondary text
        'quantum-border': '#30363D', // A subtle border color
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'mono': ['"Fira Code"', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          '0%, 100%': { boxShadow: '0 0 15px 0px rgba(24, 230, 217, 0.3)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(24, 230, 217, 0.6)' },
        },
        "fade-in-up": {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 1s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};