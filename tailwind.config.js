/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {
          colors: {
            primary: '#4F46E5', // Example primary color
            secondary: '#6366F1', // Example secondary color
            accent: '#EC4899', // Example accent color
            'light-bg': '#F9FAFB',
            'light-text': '#1F2937',
            'dark-bg': '#1F2937',
            'dark-text': '#F9FAFB',
          },
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
          },
        },
      },
      plugins: [],
      darkMode: 'class',
    }
