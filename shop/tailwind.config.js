/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#065F46",
          "primary-hover": "#064E3B",
          "primary-light": "#047857",
          tint: "#ECFDF5",
          border: "#A7F3D0",
        },
        accent: {
          volt: "#BEF264",
          hot: "#DC2626",
          "hot-tint": "#FEF2F2",
        },
        surface: {
          page: "#FFFFFF",
          subtle: "#F8FAFC",
          muted: "#F1F5F9",
          border: "#E2E8F0",
        },
        ink: {
          primary: "#0F172A",
          secondary: "#334155",
          muted: "#64748B",
        },
        semantic: {
          "success-bg": "#ECFDF5",
          "success-text": "#065F46",
          "success-icon": "#10B981",
          "warning-bg": "#FFFBEB",
          "warning-text": "#92400E",
          "warning-icon": "#F59E0B",
          "danger-bg": "#FEF2F2",
          "danger-text": "#B91C1C",
          "danger-icon": "#DC2626",
          "info-bg": "#EFF6FF",
          "info-text": "#1E40AF",
          "info-icon": "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Be Vietnam Pro", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        "card-hover":
          "0 10px 25px -5px rgba(15, 23, 42, 0.10), 0 4px 10px -2px rgba(15, 23, 42, 0.05)",
        sticky: "0 -4px 16px rgba(15, 23, 42, 0.08)",
        drawer: "0 20px 50px rgba(15, 23, 42, 0.18)",
      },
    },
  },
  plugins: [],
};
