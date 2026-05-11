import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf3",
          100: "#d6f5e0",
          200: "#aeeac3",
          300: "#79d89e",
          400: "#46c279",
          500: "#22a85f",
          600: "#15874b",
          700: "#126b3e",
          800: "#125534",
          900: "#0f462c",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
