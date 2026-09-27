import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: { xs: "400px", sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    container: { center: true, padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem" }, screens: { "2xl": "1360px" } },
    extend: {
      colors: {
        ink: { DEFAULT: "#0D0B0A", 900: "#0D0B0A", 800: "#141110", 700: "#1B1715", 600: "#25201D", 500: "#3A332E" },
        cream: { DEFAULT: "#F3ECE0", 50: "#FBF8F2", 100: "#F3ECE0", 200: "#E6DCCB", 300: "#CFC2AE" },
        copper: { DEFAULT: "#C4884E", 300: "#DDB07F", 400: "#D09A64", 500: "#C4884E", 600: "#A96F39", 700: "#86552B" },
        ember: { DEFAULT: "#9B2F24", 400: "#B8463A", 500: "#9B2F24", 600: "#7C231B" },
        muted: "#A69A8B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { eyebrow: "0.28em" },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px -24px rgba(0,0,0,0.6)",
        lift: "0 30px 60px -25px rgba(0,0,0,0.75)",
        glow: "0 10px 30px -10px rgba(196,136,78,0.55)",
      },
      transitionTimingFunction: { luxe: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        rise: { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        kenburns: { "0%": { transform: "scale(1.08)" }, "100%": { transform: "scale(1)" } },
      },
      animation: {
        rise: "rise 1s cubic-bezier(0.22,1,0.36,1) both",
        fade: "fade 0.6s ease both",
        kenburns: "kenburns 2.4s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
