/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "main-dark": "#0b1120",
        "main-light": "#f4eede",
      },
    },
  },
  plugins: [],
};
