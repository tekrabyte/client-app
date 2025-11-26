/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D6FFF', // Warna request user
        'primary-dark': '#165bce', // Versi agak gelap untuk hover
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        'html': { fontSize: '12px' },
        'body': { fontSize: '12px' },
      });
    }
  ],
}