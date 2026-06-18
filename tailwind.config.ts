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
        "bite-purple": "#7C3AED",
        "bite-purple-light": "#A78BFA",
        "bite-pink": "#F472B6",
        "bite-bg": "#F8F7FF",
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
        bubbly: "0 8px 32px 0 rgba(124,58,237,0.15), 0 2px 8px 0 rgba(13,211,197,0.10)",
        card: "0 4px 24px 0 rgba(0,0,0,0.10)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bite-gradient": "linear-gradient(135deg, #0DD3C5 0%, #7C3AED 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
