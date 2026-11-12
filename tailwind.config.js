/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#123B63',       // Primary Dark Blue
          darkHover: '#0d2b4a',
          sky: '#2496D8',        // Secondary Sky Blue
          skyLight: '#e9f5fc',
          green: '#2EAD72',      // Accent Green
          greenHover: '#269360',
          greenLight: '#ebf8f2',
          bg: '#F5F7FA',         // Light Grey Background
          card: '#FFFFFF',
          border: '#E2E8F0',
          textDark: '#1E293B',
          textMuted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'civic': '0 4px 20px -2px rgba(18, 59, 99, 0.08)',
        'civic-lg': '0 10px 30px -4px rgba(18, 59, 99, 0.12)',
        'civic-glow': '0 0 25px rgba(36, 150, 216, 0.25)',
      }
    },
  },
  plugins: [],
}

