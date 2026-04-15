/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Creepster"', 'cursive'],
        body: ['"Space Mono"', 'monospace'],
      },
      colors: {
        rm: {
          // Portal green — a cor icônica do show
          green: '#39FF14',
          'green-dim': '#2BC210',
          'green-dark': '#1A7A09',
          'green-glow': '#39FF1466',
          // Backgrounds dark
          black: '#060608',
          'dark-1': '#0D0D12',
          'dark-2': '#14141C',
          'dark-3': '#1C1C27',
          'dark-4': '#252535',
          // Accent colors do show
          yellow: '#F5C518',
          blue: '#4FC3F7',
          pink: '#FF6B9D',
          // Texto
          white: '#E8E8F0',
          'gray-light': '#9090A8',
          'gray-muted': '#555568',
        },
      },
      animation: {
        'portal-spin': 'portalSpin 8s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        flicker: 'flicker 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        portalSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(57,255,20,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(57,255,20,0.5), 0 0 40px rgba(57,255,20,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
