import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#13131A',
        'border-subtle': '#1E1E2E',
        accent: '#C9A84C',
        'text-primary': '#E8E8F0',
        'text-muted': '#6B6B80',
        'status-active': '#2D6A4F',
        'status-faulty': '#8B1A1A',
        'status-repair': '#7A5C00',
        'status-decommissioned': '#2A2A35',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
