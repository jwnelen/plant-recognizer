const baseConfig = require("@plant-recognizer/tailwind-config/tailwind.config.base");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
