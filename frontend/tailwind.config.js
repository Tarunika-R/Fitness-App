/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        track: {
          DEFAULT: '#16324A',   // base background — track blue
          surface: '#1E4364',   // card surfaces
          surfaceLight: '#2A5680', // hover/active surfaces
        },
        gold: {
          DEFAULT: '#F2B705',   // finish-line gold — primary accent
          dark: '#C99500',
        },
        cinder: {
          DEFAULT: '#E4572E',   // rank-drop / alert red
        },
        chalk: {
          DEFAULT: '#F4F6F8',   // primary text on dark
          muted: '#8CA3B8',     // secondary text
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
