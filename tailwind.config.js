module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#A390E4",
          darker: "#856bdb",
        },
        secondary: {
          DEFAULT: "#F18F01",
        },
        black: {
          DEFAULT: "3A3A3A",
        },
      },
      fontFamily: {
        merriweather: ["Merriweather", "serif"],
        oswald: ["Oswald", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  exposeConfig: true,
};
