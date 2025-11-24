// // tailwind.config.ts

// import type { Config } from "tailwindcss"
// import tailwindcssAnimate from "tailwindcss-animate"

// const config = {
//   darkMode: "class",
//   content: [
//     './pages/**/*.{ts,tsx}',
//     './components/**/*.{ts,tsx}',
//     './app/**/*.{ts,tsx}',
//     './src/**/*.{ts,tsx}',
// 	],
//   prefix: "",
//   theme: {
//     container: {
//       center: false,
//       padding: "1rem", // Slightly adjusted padding for better mobile feel
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         'brand-blue': {
//           DEFAULT: '#1E3A8A',
//           dark: '#0A1633',
//         },
//         'brand-orange': '#F37F37',
//       },
//       backgroundImage: {
//         'hero-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #0D1F3F 100%)',
//         // ADD THIS NEW GRADIENT for the main page background
//         'main-gradient': 'radial-gradient(ellipse at top, #1E3A8A, #0A1633 70%)',
//       },
//       keyframes: {
//         "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
//         "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [tailwindcssAnimate],
// } satisfies Config

// export default config


import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      // THE FIX: Make padding responsive
      padding: {
        DEFAULT: "1rem", // 16px on Mobile (Safe, not too wide)
        sm: "2rem",      // 32px on Tablets (Better spacing)
        lg: "4rem",      // 64px on Desktops (Pro spacing)
        xl: "5rem",      // 80px on Wide Screens
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'brand-blue': {
          DEFAULT: '#1E3A8A',
          dark: '#0A1633',
        },
        'brand-orange': '#F37F37',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #0D1F3F 100%)',
        'main-gradient': 'radial-gradient(ellipse at top, #1E3A8A, #0A1633 70%)',
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config