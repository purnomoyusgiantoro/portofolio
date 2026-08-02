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
          bg: '#0f0f13',
          surface: '#1a1a23',
          'surface-hover': '#22222e',
          sidebar: '#13131a',
          border: '#2a2a35',
          'border-hover': '#3a3a48',
          text: '#e4e4e7',
          'text-muted': '#8b8b9e',
          primary: '#006574',
          'primary-light': '#0891a7',
          'primary-dark': '#004d59',
          accent: '#00c9a7',
          danger: '#ef4444',
          'danger-light': '#fca5a5',
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
