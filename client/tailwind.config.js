import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{html,js}", // Include project-specific files
    "./node_modules/@nextui-org/theme/dist/components/**/*.{js,ts,jsx,tsx}", // Include NextUI components
  ],
  theme: {
    extend: {}, // Extend Tailwind's default theme if needed
  },
  plugins: [nextui()], // Load the NextUI plugin
};

export default config;