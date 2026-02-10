// src/theme.js
import { createTheme } from "@mui/material/styles";

// 🎨 УСПОКОЯВАЩА ПАЛИТРА С ГРАДИЕНТИ + RESPONSIVE
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#7C9CBF",
      light: "#A8C5E3",
      dark: "#5A7A99",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#B8A9C9",
      light: "#D4C9E0",
      dark: "#9580AB",
      contrastText: "#ffffff",
    },
    success: {
      main: "#8FB8A0",
      light: "#B5D4C4",
      dark: "#6B9B82",
    },
    info: {
      main: "#89CFF0",
      light: "#B0E0F5",
      dark: "#5FA8C7",
    },
    warning: {
      main: "#F4C2A4",
      light: "#F9D9C5",
      dark: "#D69E7E",
    },
    error: {
      main: "#E8A6A6",
      light: "#F2C5C5",
      dark: "#C98080",
    },
    background: {
      default: "linear-gradient(135deg, #E8F4F8 0%, #F5F0F8 50%, #F8F4E8 100%)",
      paper: "#FFFFFF",
      gradient: "linear-gradient(135deg, #E0F2F7 0%, #F3E5F5 50%, #FFF3E0 100%)",
    },
    text: {
      primary: "#4A5568",
      secondary: "#718096",
      disabled: "#A0AEC0",
    },
    divider: "rgba(203, 213, 224, 0.5)",
  },
  typography: {
    fontFamily: "'Nunito', 'Inter', -apple-system, sans-serif",
    // 📱 Responsive Typography
    h1: {
      fontWeight: 700,
      fontSize: "1.75rem",
      letterSpacing: "-0.01em",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "2.25rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2.75rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.5rem",
      letterSpacing: "-0.01em",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1.875rem",
      },
      "@media (min-width:960px)": {
        fontSize: "2.25rem",
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.375rem",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1.625rem",
      },
      "@media (min-width:960px)": {
        fontSize: "1.875rem",
      },
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1.375rem",
      },
      "@media (min-width:960px)": {
        fontSize: "1.5rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.75,
      color: "#4A5568",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.6,
      color: "#718096",
      "@media (min-width:600px)": {
        fontSize: "0.875rem",
      },
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 20,
  },
  spacing: 8,
  shadows: [
    "none",
    "0 2px 8px rgba(124, 156, 191, 0.08)",
    "0 4px 12px rgba(124, 156, 191, 0.12)",
    "0 6px 16px rgba(124, 156, 191, 0.15)",
    "0 8px 24px rgba(124, 156, 191, 0.18)",
    "0 12px 32px rgba(124, 156, 191, 0.22)",
    ...Array(19).fill("0 20px 40px rgba(124, 156, 191, 0.25)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(135deg, #E8F4F8 0%, #F5F0F8 50%, #F8F4E8 100%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#A8C5E3 #E2E8F0",
        },
        "*::-webkit-scrollbar": {
          width: "10px",
          height: "10px",
        },
        "*::-webkit-scrollbar-track": {
          background: "#E2E8F0",
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "linear-gradient(135deg, #7C9CBF, #B8A9C9)",
          borderRadius: "10px",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          "@media (min-width:600px)": {
            paddingLeft: 24,
            paddingRight: 24,
          },
          "@media (min-width:960px)": {
            paddingLeft: 32,
            paddingRight: 32,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: "10px 20px",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "@media (min-width:600px)": {
            padding: "12px 28px",
            fontSize: "1rem",
          },
        },
        sizeLarge: {
          padding: "12px 24px",
          fontSize: "1rem",
          "@media (min-width:600px)": {
            padding: "14px 32px",
            fontSize: "1.125rem",
          },
        },
        sizeSmall: {
          padding: "6px 12px",
          fontSize: "0.8125rem",
          "@media (min-width:600px)": {
            padding: "8px 16px",
            fontSize: "0.875rem",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #7C9CBF 0%, #B8A9C9 100%)",
          boxShadow: "0 4px 15px rgba(124, 156, 191, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #5A7A99 0%, #9580AB 100%)",
            boxShadow: "0 6px 20px rgba(124, 156, 191, 0.4)",
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          borderWidth: "2px",
          borderColor: "#7C9CBF",
          "&:hover": {
            borderWidth: "2px",
            background: "rgba(124, 156, 191, 0.08)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: "0 4px 20px rgba(124, 156, 191, 0.12)",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(124, 156, 191, 0.18)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        },
        elevation1: {
          boxShadow: "0 2px 12px rgba(124, 156, 191, 0.1)",
        },
        elevation2: {
          boxShadow: "0 4px 16px rgba(124, 156, 191, 0.12)",
        },
        elevation3: {
          boxShadow: "0 6px 20px rgba(124, 156, 191, 0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            background: "rgba(255, 255, 255, 0.8)",
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: "rgba(124, 156, 191, 0.3)",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "rgba(124, 156, 191, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7C9CBF",
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
        filled: {
          background: "linear-gradient(135deg, #A8C5E3, #D4C9E0)",
          color: "#4A5568",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #7C9CBF, #B8A9C9)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
  },
});

export default theme;
