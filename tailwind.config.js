/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b1220",
          900: "#121a2b",
          800: "#1a2438",
          700: "#243049",
          600: "#3a4a66",
          500: "#5b6b86",
          400: "#8a97ad",
          300: "#b7c0cf",
          200: "#d9dee8",
          100: "#eef1f6",
          50: "#f7f8fb",
        },
        accent: {
          DEFAULT: "#0f766e",
          soft: "#ccfbf1",
          dark: "#115e59",
        },
        warn: "#b45309",
        danger: "#b91c1c",
      },
      fontFamily: {
        display: ['"DM Sans"', "system-ui", "sans-serif"],
        body: ['"Source Sans 3"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
        lift: "0 12px 32px rgba(15, 23, 42, 0.1)",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};
