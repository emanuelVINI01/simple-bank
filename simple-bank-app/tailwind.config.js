/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dracula palette
        "dracula-bg": "#282a36",
        "dracula-surface-deep": "#21222c",
        "dracula-surface": "#343746",
        "dracula-card": "#44475a",
        "dracula-fg": "#f8f8f2",
        "dracula-muted": "#a7b0c8",
        "dracula-purple": "#bd93f9",
        "dracula-green": "#50fa7b",
        "dracula-cyan": "#8be9fd",
        "dracula-pink": "#ff79c6",
        "dracula-red": "#ff5555",
        "dracula-orange": "#ffb86c",
        "dracula-yellow": "#f1fa8c",
      },
    },
  },
  plugins: [],
};
