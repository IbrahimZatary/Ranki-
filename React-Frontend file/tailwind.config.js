/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fff7e9',
        accent: '#c8b2ff',
        textPrimary: '#000000',
        textSecondary: '#666666',
        border: '#111111'
      },
      fontFamily: {
        heading: ['"Roboto Mono"', 'monospace'],
        body: ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'tinted': '0 4px 14px 0 rgba(200, 178, 255, 0.39)',
        'deep': '0 10px 25px -5px rgba(200, 178, 255, 0.4)'
      },
      spacing: {
        'base': '4.18px',
      },
      borderRadius: {
        'btn': '8px',
      }
    },
  },
  plugins: [],
}
