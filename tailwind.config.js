/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      animation: {
        scroll: "scroll 20s linear infinite",
      },
      colors: {
        primary: "#D8DC8D",
        secondary: "#F9F9F9",
        dark: "#1E1E1E",
        color1: "#c5f82a",
        color2: "#f8f8f8",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false,
    scrollBehavior: true,
  },
};
