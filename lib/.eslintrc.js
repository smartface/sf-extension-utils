module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    indent: ["error", 4],
    "no-plusplus": "off",
    "no-alert": "off",
    "comma-dangle": ["error", "never"],
    "no-use-before-define": [
      "error",
      {
        functions: false,
        classes: true,
        variables: true
      }
    ],
    "max-len": [
      "warn",
      {
        code: 150
      }
    ]
  }
};
