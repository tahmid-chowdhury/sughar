// client/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: '#FFFFFF', // Main content area background
            paper: '#FFFFFF',
        },
        primary: {
            main: '#000000', // For active elements, buttons
        },
        secondary: {
            main: '#EBD4F8', // Accent color
        },
        sughar: {
            background: '#F9F2F3', // The main page background
        },
    },
    typography: {
        fontFamily: '"Inter", "sans-serif"',
        h1: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
        h2: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
        h3: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
        h4: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
        h5: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
        h6: { fontFamily: '"Atkinson Hyperlegible", "sans-serif"', fontWeight: 700 },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    border: '1px solid #F0F0F0',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#F9F2F3',
                    borderRight: 'none',
                }
            }
        }
    },
});

export default theme;