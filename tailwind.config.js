/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */

module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: "#A08CE3",
          DEFAULT: "#937CDF",
          darker: "#856BDB",
        },
        secondary: {
          DEFAULT: "#F18F01",
          darker: "#CB7A01",
        },
        black: {
          DEFAULT: "#3A3A3A",
        },
      },
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        oswald: ["Oswald", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      screens: {
        xxs: { max: "320px" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  exposeConfig: true,
};
