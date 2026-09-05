/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f2f6fa',
          100: '#e2ebf3',
          200: '#c4d6e6',
          300: '#95b6d2',
          400: '#5f8fba',
          500: '#3b72a4',
          600: '#2c5a89',
          700: '#264a6f',
          800: '#223f5d',
          900: '#1f364e',
          950: '#142333',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(20 35 51 / 0.05), 0 4px 16px -4px rgb(20 35 51 / 0.08)',
      },
    },
  },
  plugins: [],
};
