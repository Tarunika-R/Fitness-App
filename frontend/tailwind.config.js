/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                // "Neon Quest" palette — deep indigo base with electric
                // teal + magenta accents. Token names kept the same
                // (track/gold/cinder/chalk) so every component that
                // already references them just picks up the new look.
                track: {
                    DEFAULT: '#0D0B1E',
                    surface: '#181530',
                    surfaceLight: '#282149',
                },
                gold: {
                    DEFAULT: '#00F5D4',
                    dark: '#00BFA5',
                    light: '#6FFFE9',
                },
                cinder: {
                    DEFAULT: '#FF3D81',
                    dark: '#D91E63',
                    light: '#FF7AAE',
                },
                chalk: {
                    DEFAULT: '#F2EFFB',
                    muted: '#9C93C7',
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
                'drift': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(0, -14px) scale(1.03)' },
                },
                'run-bounce': {
                    '0%, 100%': { transform: 'translateY(0) rotate(-6deg)' },
                    '50%': { transform: 'translateY(-12px) rotate(6deg)' },
                },
                'track-scroll': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
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
                'drift': 'drift 8s ease-in-out infinite',
                'drift-slow': 'drift 12s ease-in-out infinite',
                'run-bounce': 'run-bounce 0.5s ease-in-out infinite',
                'track-scroll': 'track-scroll 0.6s linear infinite',
            },
        },
    },
    plugins: [],
}
