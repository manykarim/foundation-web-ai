/** @type {import('tailwindcss').Config} */
import { configDefaultTheme, configRoboconTheme, configWwwwTheme } from './tailwind.themes.js'

let theme = configDefaultTheme
const page = process.env.RF_PAGE
if (page === 'robocon') theme = configRoboconTheme
if (page === 'wwww') theme = configWwwwTheme

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  jit: true,
  content: [
    './app.vue',
    './components/**/*.{vue,ts,js}',
    './content/**/*.md',
    './pages/**/*.{vue,ts,js}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
      },
    },
    ...theme,
  },
  safelist: [
    'peer-checked:border-[#00c0b5]',
    'peer-checked:*:block',
  ],
  plugins: [],
}
