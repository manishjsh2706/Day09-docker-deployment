const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,

  // Node.js environment
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
      },
    },
  },

  // Jest test environment
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
  },
];
