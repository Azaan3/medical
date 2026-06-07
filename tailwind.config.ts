import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: "#f0f7ff",
          100: "#e0effe",
          500: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a5f",
        },
        alert: {
          critical: "#b91c1c",
          warning: "#d97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
