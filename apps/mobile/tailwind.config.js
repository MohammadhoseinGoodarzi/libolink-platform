/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind 4 pins Tailwind v3 (see version table). Tokens mirror the web
  // app's semantic names so component class strings are identical across apps.
  content: ['./app/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './shared/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        link: 'hsl(var(--link))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        // --radius is the 20px container default (handoff §3.3). lg == container
        // radius; md/sm step down for inline thumbnails and small controls.
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 8px)', // 12px — small inline cards/thumbnails
        sm: 'calc(var(--radius) - 12px)', // 8px — chips, tight controls
      },
      fontFamily: {
        // Vazirmatn is the only sanctioned family (§3.5). RN renders static
        // weights as distinct families, so each weight is its own utility:
        // font-sans (400) · font-sans-medium (500) · font-sans-semibold (600) ·
        // font-sans-bold (700). Keep `font-bold` etc. (fontWeight) off RN text.
        sans: ['Vazirmatn-Regular'],
        'sans-medium': ['Vazirmatn-Medium'],
        'sans-semibold': ['Vazirmatn-SemiBold'],
        'sans-bold': ['Vazirmatn-Bold'],
      },
    },
  },
  plugins: [],
};
