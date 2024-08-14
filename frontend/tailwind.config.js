/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      primary: "#5f9ea0",
      "primary-dark": "#587679",
      "primary-hover": "#7a9697",
      white: "#FFFFFF",
      black: "#000000",
      orange: "#ff7849",
      green: "#13ce66",
      "gray-dark": "#273444",
      gray: "#8492a6",
      "gray-light": "#E5E5E5",
    },
    extend: {
      keyframes: {
        sideways: {
          "0%, 100%": { left: "0", top: "0" },
          "50%": { left: "100px", top: "0" },
        },
      },
    },
  },
  plugins: [],
};
