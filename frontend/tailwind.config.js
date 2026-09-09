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
                    DEFAULT: '#16324A',
                    surface: '#1E4364',
                    surfaceLight: '#2A5680',
                },
                gold: {
                    DEFAULT: '#F2B705',
                    dark: '#C99500',
                    light: '#FFD54F',
                },

                chalk: {
                    DEFAULT: '#F4F6F8',
                    muted: '#8CA3B8',
                },
                bronze: {
                    DEFAULT: '#CD7F32',
                    dark: '#8C5523',
                },
            },
            fontFamily: {
                display: ['Oswald', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'bounce-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.6s ease-out',
                'slide-up': 'slide-up 0.6s ease-out',
                'slide-in-left': 'slide-in-left 0.6s ease-out',
                'slide-in-right': 'slide-in-right 0.6s ease-out',
                'scale-in': 'scale-in 0.4s ease-out',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
