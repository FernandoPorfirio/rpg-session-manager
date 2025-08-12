import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#a3bb98',
      dark: '#8da582',
    },
    secondary: {
      main: '#2c3e50',
    },
    background: {
      default: '#ffffff',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2c3e50',
    },
  },
  typography: {
    fontFamily: '"VT323", monospace',
    h4: {
      fontFamily: '"VT323", monospace',
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: '"VT323", monospace',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: '"VT323", monospace',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"VT323", monospace',
          fontSize: '1rem',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: '"VT323", monospace',
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"VT323", monospace',
          },
        },
      },
    },
  },
})

export default theme
