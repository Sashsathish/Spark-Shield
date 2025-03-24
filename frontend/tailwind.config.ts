
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// SparkShield custom colors
				spark: {
					blue: '#0068FF',
					'blue-dark': '#004FC3',
					cyan: '#00E0FF',
					'cyan-dim': 'rgba(0, 224, 255, 0.3)',
					red: '#FF3A5A',
					'red-dim': 'rgba(255, 58, 90, 0.3)',
					green: '#00CC8E',
					'green-dim': 'rgba(0, 204, 142, 0.3)',
					yellow: '#FFDC26',
					'yellow-dim': 'rgba(255, 220, 38, 0.3)',
					dark: '#0B0B13',
					'dark-700': '#13131F',
					'dark-600': '#1C1C2A',
					'dark-500': '#252535',
					'gray-100': '#E6E6F0',
					'gray-200': '#BDBDCC',
					'gray-300': '#9494A9',
					'gray-400': '#6D6D85',
					'gray-500': '#52525E',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.85)', opacity: '1' },
					'50%': { transform: 'scale(1)', opacity: '0.6' },
					'100%': { transform: 'scale(0.85)', opacity: '1' },
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				'scanning': {
					'0%': { transform: 'translateY(0)', opacity: '0.8' },
					'50%': { transform: 'translateY(100%)', opacity: '0.8' },
					'50.1%': { transform: 'translateY(0)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '0' },
				},
				'ping-slow': {
					'75%, 100%': {
						transform: 'scale(2)',
						opacity: '0',
					},
				},
				'matrix': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100%)' },
				},
				'shield-pulse': {
					'0%': { boxShadow: '0 0 0 0 rgba(0, 104, 255, 0.7)' },
					'70%': { boxShadow: '0 0 0 10px rgba(0, 104, 255, 0)' },
					'100%': { boxShadow: '0 0 0 0 rgba(0, 104, 255, 0)' },
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'cursor-blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'glitch': {
					'0%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-5px, 5px)' },
					'40%': { transform: 'translate(-5px, -5px)' },
					'60%': { transform: 'translate(5px, 5px)' },
					'80%': { transform: 'translate(5px, -5px)' },
					'100%': { transform: 'translate(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scanning': 'scanning 2s infinite',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				'matrix': 'matrix 20s linear infinite',
				'shield-pulse': 'shield-pulse 2s infinite',
				'rotate-slow': 'rotate-slow 8s linear infinite',
				'typing': 'typing 3.5s steps(40, end)',
				'cursor-blink': 'cursor-blink 0.75s step-end infinite',
				'glitch': 'glitch 0.5s ease-in-out infinite alternate'
			},
			backdropBlur: {
				xs: '2px',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'cyber-grid': 'linear-gradient(rgba(0, 104, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 104, 255, 0.2) 1px, transparent 1px)',
				'shield-gradient': 'radial-gradient(circle at center, rgba(0, 104, 255, 0.5) 0%, rgba(0, 104, 255, 0) 70%)',
			},
			boxShadow: {
				'neon-blue': '0 0 10px rgba(0, 104, 255, 0.5), 0 0 20px rgba(0, 104, 255, 0.3), 0 0 30px rgba(0, 104, 255, 0.1)',
				'neon-red': '0 0 10px rgba(255, 58, 90, 0.5), 0 0 20px rgba(255, 58, 90, 0.3), 0 0 30px rgba(255, 58, 90, 0.1)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
