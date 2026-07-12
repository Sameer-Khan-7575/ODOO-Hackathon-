/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Deep forest — sidebar / dark surfaces
        moss: {
          950: "#0C231C",
          900: "#122F26",
          800: "#1B4332",
          700: "#245842",
          600: "#2E6E52",
        },
        // Primary growth green
        canopy: {
          400: "#4ADE80",
          500: "#2F9E68",
          600: "#1F7A54",
        },
        // Signature bright accent — new growth
        lime: {
          300: "#DDF17B",
          400: "#C6F135",
          500: "#A9D91C",
        },
        // Social / water accent
        sky: {
          300: "#8FE0EA",
          400: "#5FC9D6",
          500: "#33A8B8",
        },
        // Governance / warmth accent
        amber: {
          300: "#F6CD7C",
          400: "#F2B84B",
          500: "#DE9B26",
        },
        // Warm paper background
        paper: {
          50: "#FDFBF6",
          100: "#FAF6EC",
          200: "#F3EDDD",
        },
        ink: {
          900: "#16231C",
          700: "#3A4A40",
          500: "#67766B",
          300: "#A3B0A6",
        },
        // Legacy alias so any un-migrated eco-* classes still resolve
        eco: {
          primary: "#2F9E68",
          secondary: "#5FC9D6",
          accent: "#F2B84B",
          dark: "#16231C",
          light: "#FAF6EC",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(22, 35, 28, 0.08), 0 1px 2px -1px rgba(22, 35, 28, 0.06)",
        card: "0 4px 20px -4px rgba(22, 35, 28, 0.10), 0 2px 6px -2px rgba(22, 35, 28, 0.06)",
        lift: "0 12px 32px -8px rgba(22, 35, 28, 0.18)",
        glow: "0 0 0 1px rgba(198, 241, 53, 0.4), 0 0 24px -4px rgba(198, 241, 53, 0.5)",
      },
      backgroundImage: {
        "moss-gradient": "radial-gradient(120% 120% at 10% 0%, #1B4332 0%, #122F26 45%, #0C231C 100%)",
        "canopy-gradient": "linear-gradient(135deg, #2F9E68 0%, #1B4332 100%)",
        "meadow-gradient": "linear-gradient(120deg, #EAF6D8 0%, #F3F7EA 45%, #E4F3F1 100%)",
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      animation: {
        "count-up": "countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in": "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.4s ease-out",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        "draw-ring": "drawRing 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "blob": "blob 14s ease-in-out infinite",
        "blob-slow": "blob 20s ease-in-out infinite reverse",
        "pop-in": "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "wiggle": "wiggle 0.6s ease-in-out",
        "confetti-fall": "confettiFall 1.4s ease-out forwards",
        "glow-pulse": "glowPulse 2.6s ease-in-out infinite",
        "spin-slow": "spin 10s linear infinite",
      },
      keyframes: {
        countUp: {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-16px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        drawRing: {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
          "100%": { strokeDashoffset: "var(--ring-offset)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(4%, -6%) scale(1.08)" },
          "66%": { transform: "translate(-3%, 4%) scale(0.95)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.6) translateY(10px)" },
          "70%": { opacity: "1", transform: "scale(1.05) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-6deg)" },
          "75%": { transform: "rotate(6deg)" },
        },
        confettiFall: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(160px) rotate(540deg)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
}
