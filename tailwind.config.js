const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './resources/scripts/**/*.{js,ts,jsx,tsx}',
        './resources/views/**/*.blade.php',
        './.blueprint/extensions/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                header: ['"Outfit"', '"IBM Plex Sans"', 'sans-serif'],
                sans: ['"Outfit"', '"IBM Plex Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
                        colors: {
                bn: {
                    mint: '#EBF5EE',
                    khaki: '#BFA89E',
                    taupe: '#8B786D',
                    base: '#141211',
                    surface: '#1c1917',
                    card: '#25211e',
                },
                primary: {
                    50: '#FAF8F7',
                    100: '#F5F1EF',
                    200: '#E8DFDC',
                    300: '#D5C4BD',
                    400: '#C7B1A7',
                    500: '#BFA89E',
                    600: '#A99288',
                    700: '#8B786D',
                    800: '#5F5149',
                    900: '#3D342F',
                },
                gray: colors.neutral,
                neutral: colors.neutral,
                slate: colors.slate,
                cyan: colors.cyan,
                indigo: colors.indigo,
                emerald: colors.emerald,
                amber: colors.amber,
                yellow: colors.yellow,
                red: colors.red,
                rose: colors.rose,
                pink: colors.pink,
                purple: colors.purple,
                violet: colors.violet,
                sky: colors.sky,
                teal: colors.teal,
            },
            fontSize: {
                '2xs': '0.625rem',
                '7xl': '4.5rem',
                '8xl': '6rem',
                '9xl': '8rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/line-clamp'),
    ],
};
