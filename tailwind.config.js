module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      keyframes: {
        slideDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        subtlePulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-slow": {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-5px)" },
          "60%": { transform: "translateY(-3px)" },
        },
        "pulse-slow": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        slideDown: "slideDown 0.3s ease",
        subtlePulse: "subtlePulse 3s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.6s ease",
        "fadeInUp-delay-1": "fadeInUp 0.6s ease 0.1s both",
        "fadeInUp-delay-2": "fadeInUp 0.6s ease 0.2s both",
        "fadeInUp-delay-3": "fadeInUp 0.6s ease 0.3s both",
        "bounce-slow": "bounce-slow 2s infinite",
        "pulse-slow": "pulse-slow 2s infinite",
      },
    },
  },
  plugins: [],
};