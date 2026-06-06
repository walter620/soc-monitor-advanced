/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0e17',
        'bg-secondary': '#111827',
        'bg-tertiary': '#1f2937',
        'text-primary': '#f9fafb',
        'text-secondary': '#9ca3af',
        'text-muted': '#6b7280',
        'border-primary': '#374151',
        'border-secondary': '#4b5563',
      },
      rings: {
        default: ['3px', 'rgba(6, 182, 212, 0.1)'],
      }
    },
  },
  plugins: [],
}
