/*@type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2'
      },
      screens: {
        'xs': '540px',
        'xxs': '300px',
      },
    },
  },

}
