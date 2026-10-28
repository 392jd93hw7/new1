import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080a10",
        panel: "#11141d",
        muted: "#9197a8",
        accent: "#a78bfa",
        pinkish: "#f472b6"
      },
      boxShadow: {
        glow: "0 0 40px rgba(167, 139, 250, .16)"
      }
    }
  },
  plugins: []
};
export default config;
