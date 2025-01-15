const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "logo-red": "rgb(255, 0, 97)",
        "logo-yellow": "#ffc525",
      },
      fontFamily: {
        sans: ["var(--plex-sans-font)", ...fontFamily.sans],
        serif: ["var(--plex-serif-font)", ...fontFamily.serif],
        "fa-regular": ["FontAwesome6Pro-Regular"],
        "fa-solid": ["FontAwesome6Pro-Solid"]
      },
      height: {
        "shorter-screen": "calc(100% - 4rem)"
      },
      maxHeight: {
        "shorter-screen": "calc(100% - 4rem)"
      },
      minHeight: {
        "shorter-screen": "calc(100% - 4rem)"
      }
    }
  },
  plugins: []
};
