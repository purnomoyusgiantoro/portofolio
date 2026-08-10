/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          bg: '#f4f4f5',
          surface: '#ffffff',
          'surface-hover': '#fafafa',
          sidebar: '#ffffff',
          border: '#e4e4e7',
          'border-hover': '#d4d4d8',
          text: '#09090b',
          'text-muted': '#71717a',
          primary: '#000000',
          'primary-light': '#27272a',
          'primary-dark': '#000000',
          accent: '#171717',
          danger: '#ef4444',
          'danger-light': '#fecaca',
          warning: '#f59e0b',
          success: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
