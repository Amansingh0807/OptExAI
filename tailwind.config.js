// tailwind.config.js
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // or your actual paths
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('tw-animate-css'), // ✅ Correct way to include it
    ],
  };
  