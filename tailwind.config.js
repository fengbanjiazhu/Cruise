/** @type {import('tailwindcss').Config} */
export default {
  content: ["./Client/index.html", "./Client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spin: {
          "0%": { "--rotate": "0deg" },
          "100%": { "--rotate": "360deg" },
        },
      },
      animation: {
        spin: "spin 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
