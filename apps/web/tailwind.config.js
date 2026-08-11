import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    path.resolve(__dirname, "../../packages/ui/src/**/*.{js,ts,jsx,tsx}")
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "rgb(var(--black) / <alpha-value>)",
        white: "rgb(var(--white) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-container": "rgb(var(--primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--on-primary-container) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "outline-variant": "rgb(var(--outline-variant) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--surface-variant) / <alpha-value>)",
      },
      fontFamily: {
        body: ['Hanken Grotesk', 'sans-serif'],
        code: ['geist', 'monospace']
      },
    },
  },
  plugins: [],
}
