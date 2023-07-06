const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      "logo-red": "rgb(255, 0, 97)",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      black: colors.black,
      red: colors.red,
      green: colors.green,
      slate: colors.slate,
      cyan: colors.cyan,
      test: "#B2DBBF",
    },
    extend: {
      fontFamily: {
        sans: ['var(--plex-sans-font)', ...fontFamily.sans],
        serif: ['var(--plex-serif-font)', ...fontFamily.serif],
      },
      maxHeight: {
        "shorter-screen": "calc(100% - 4rem)",
      },
      minHeight: {
        "shorter-screen": "calc(100% - 4rem)",
      }
    },
  },
  plugins: [],
}
