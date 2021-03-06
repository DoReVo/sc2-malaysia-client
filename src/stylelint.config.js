module.exports = {
  extends: "stylelint-config-standard",
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "mixin",
          "include",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificity": null,
    "function-name-case": null,
    "function-whitespace-after": null,
    "value-keyword-case": null,
  },
};
