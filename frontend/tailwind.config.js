/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Mobile-first responsive breakpoints
    screens: {
      xs: "480px", // Extra small devices (mobile landscape)
      sm: "576px", // Small devices (large phones)
      md: "768px", // Medium devices (tablets)
      lg: "992px", // Large devices (laptops)
      xl: "1200px", // Extra large devices (desktops)
      "2xl": "1400px", // Extra extra large devices (large desktops)
    },
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
      // Responsive spacing scale
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
    },
  },
  plugins: [],
};
