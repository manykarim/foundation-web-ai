const colorsShared = {
    'background': '#f0f0f0',
    'text': '#121a1c',
    'background-darkmode': '#222',
    'background-white': '#f0f0f0',
    'background-theme': '#1B2A2F',
    robot: {
        50:  '#e6f8f6',
        100: '#cce6e3',
        200: '#b8e3e0',
        300: '#5cd6cf',
        400: '#2ecbc2',
        500: '#00c0b5',
        600: '#01968f',
        700: '#1f6662',
        800: '#1d302f',
        900: '#121a1c',
        950: '#090c0d',
    },
}

const fontFamilyShared = {
    ocr: ['OCR-A', 'monospace'],
    serif: ['Courier Code'],
    mono: ['Courier Prime'],
    sans: ['JetBrains Mono'],
    ocrx: ['OCR-X'],
}

const configDefaultTheme = {
  extend: {
    fontFamily: {
        ...fontFamilyShared,
    },
    colors: {
        ...colorsShared,
    },
  },
}

const configRoboconTheme = {
  extend: {
    fontFamily: {
        ...fontFamilyShared,
        ocr: ['OCR-RBCN', 'OCR-A', 'monospace'],
    },
    colors: {
      ...colorsShared,
      'background': '#000011',
      'text': '#121a1c',
      'background-darkmode': '#000011',
    }
  },
}

const configWwwwTheme = {
  extend: {
    fontFamily: {
        ...fontFamilyShared,
    },
    colors: {
      ...colorsShared,
      robot: {
        50:  '#e6f0ff',
        100: '#cce0ff',
        200: '#99c2ff',
        300: '#66a3ff',
        400: '#3385ff',
        500: '#2176ff',
        600: '#1d68e6',
        700: '#195acc',
        800: '#144db3',
        900: '#0f1f3d',
      },
    }
  },
}

export { configDefaultTheme, configRoboconTheme, configWwwwTheme }
