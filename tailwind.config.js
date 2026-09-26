module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: "#12B6D8",
          500: "#20C7E0",
          300: "#BFF3F8",
        },
        accent: {
          500: "#35C2A8",
          300: "#C7F2EA",
        },
        surface: "#FFFFFF",
        bg: "#F6FBFC",
        neutral: {
          900: "#0F1724",
          700: "#374151",
          500: "#6B7280",
          300: "#D1D5DB",
          100: "#F3F6F8",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        xxl: "64px",
        "72": "72px",
        "96": "96px",
        "104": "104px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "32px",
        pill: "9999px",
      },
      boxShadow: {
        1: "0 10px 28px rgba(4, 22, 31, 0.06)",
        2: "0 18px 40px rgba(4, 22, 31, 0.08)",
        glow: "0 20px 48px rgba(18, 182, 216, 0.22)",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "Jakarta Plus Sans", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "Jakarta Plus Sans", "Plus Jakarta Sans", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "Jakarta Plus Sans", "Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.05", fontWeight: "700" }],
        h2: ["40px", { lineHeight: "1.1", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.7" }],
        small: ["14px", { lineHeight: "1.5" }],
      },
      maxWidth: {
        content: "1360px",
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(600px 420px at 10% 20%, rgba(255,195,208,0.22), transparent 36%), radial-gradient(740px 540px at 90% 30%, rgba(191,243,248,0.78), transparent 44%), radial-gradient(520px 360px at 82% 72%, rgba(32,199,224,0.06), transparent 56%)",
        "cta-sheen": "linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.12) 100%)",
      },
    },
  },
  plugins: [],
};
