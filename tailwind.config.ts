import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bite-teal": "#0DD3C5",
        "bite-teal-dark": "#09A99D",
        "bite-teal-light": "#E0FFFE",
        "bite-purple": "#7C3AED",
        "bite-purple-light": "#A78BFA",
        "bite-pink": "#F472B6",
        "bite-bg": "#F0FFFE",
        "bite-card": "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        bubbly: "0 8px 32px 0 rgba(13,211,197,0.2), 0 2px 12px 0 rgba(124,58,237,0.12)",
        "bubbly-lg": "0 16px 48px 0 rgba(13,211,197,0.25), 0 4px 16px 0 rgba(124,58,237,0.15)",
        card: "0 4px 20px 0 rgba(13,211,197,0.12), 0 1px 4px 0 rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px 0 rgba(13,211,197,0.2), 0 2px 8px 0 rgba(0,0,0,0.08)",
        teal: "0 4px 20px 0 rgba(13,211,197,0.45)",
        purple: "0 4px 20px 0 rgba(124,58,237,0.35)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bite-gradient": "linear-gradient(135deg, #0DD3C5 0%, #7C3AED 100%)",
        "bite-gradient-soft": "linear-gradient(135deg, #E0FFFE 0%, #EDE9FE 100%)",
        "teal-wave": "linear-gradient(160deg, #0DD3C5 0%, #06B6D4 50%, #7C3AED 100%)",
      },
      animation: {
        "bounce-in": "bounce-in 0.4s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
