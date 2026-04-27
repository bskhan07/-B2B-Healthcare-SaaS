import healthcarePreset from "../../packages/theme/src/tailwind-preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [healthcarePreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
