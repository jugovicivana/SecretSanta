import { createTheme } from "@mui/material";

const darkGreen = "#1B5E20";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#DC0000", 
      light: "#FF3838", 
      dark: "#B00000", 
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#002455", 
      light: "#004080",
      dark: "#001833",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F7FA", 
      paper: "#FFFFFF",
    },
    text: {
      primary: "#050E3C", 
      secondary: "#002455", 
      disabled: "#9E9E9E",
    },
    error: {
      main: "#DC0000", 
    },
    success: {
      main: darkGreen, 
      light: "#4CAF50",
      dark: "#0D3B0D",
    },
    warning: {
      main: "#FF9800",
    },
    info: {
      main: "#002455",
    },
    action: {
      active: "#002455", 
      hover: "rgba(0, 36, 85, 0.08)", 
      selected: "rgba(0, 36, 85, 0.16)",
      disabled: "#BDBDBD",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
      focus: "rgba(0, 36, 85, 0.12)",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    common: {
      black: "#050E3C",
      white: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif", 
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#050E3C",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#002455",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#002455",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      color: "#050E3C",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
      color: "#002455",
    },
    button: {
      textTransform: 'none', 
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#666666",
    },
  },
  shape: {
    borderRadius: 8, 
  },
  components: {
     MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#002455 #f1f1f1',
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
            padding:0,margin:0
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#c1bfbfff',
            },
          },
        },
      },
    },
  
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: "#DC0000",
          '&:hover': {
            backgroundColor: "#B00000",
          },
        },
        containedSecondary: {
          backgroundColor: "#002455",
          '&:hover': {
            backgroundColor: "#001833",
          },
        },
        outlinedPrimary: {
          borderColor: "#DC0000",
          color: "#DC0000",
          '&:hover': {
            backgroundColor: "rgba(220, 0, 0, 0.04)",
            borderColor: "#B00000",
          },
        },
        outlinedSecondary: {
          borderColor: "#002455",
          color: "#002455",
          '&:hover': {
            backgroundColor: "rgba(0, 36, 85, 0.04)",
            borderColor: "#001833",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#002455", 
          color: "#FFFFFF",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: "#002455",
            },
            '&.Mui-focused fieldset': {
              borderColor: "#DC0000",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: "#DC0000",
          },
        },
      },
    },
  },
});