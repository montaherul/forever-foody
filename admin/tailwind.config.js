/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          green: "#22c55e",
          orange: "#f97316",
          yellow: "#facc15",
        },
        secondary: {
          gray: "#6b7280",
          lightgray: "#f3f4f6",
        },
        dark: "#1e293b",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        button: "8px",
      },
    },
  },
  plugins: [],
};
