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
        background: "#f7f9fc",
        primary: "#006574",
        "primary-container": "#008092",
        "on-primary-container": "#f8fdff",
        secondary: "#006875",
        "outline-variant": "#bcc9cc",
        surface: "#f7f9fc",
        "surface-variant": "#e0e3e6",
      },
      fontFamily: {
        body: ['Hanken Grotesk', 'sans-serif'],
        code: ['geist', 'monospace']
      },
    },
  },
  plugins: [],
}
