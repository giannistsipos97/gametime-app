/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        // You can now use the class 'font-pacman'
        pacman: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
};
