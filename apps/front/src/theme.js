import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8B4513",
      dark: "#654321",
      light: "#A0522D",
      contrastText: "#F5DEB3",
    },
    secondary: {
      main: "#B8860B",
      dark: "#8B7355",
      light: "#DAA520",
      contrastText: "#2F4F4F",
    },
    error: {
      main: "#8B0000",
      dark: "#660000",
      light: "#CD5C5C",
    },
    warning: {
      main: "#FF8C00",
      dark: "#FF6347",
    },
    info: {
      main: "#4682B4",
      dark: "#2F4F4F",
    },
    success: {
      main: "#556B2F",
      dark: "#2E4A1F",
      light: "#6B8E23",
    },
    background: {
      default: "#F5F5DC",
      paper: "rgba(245, 245, 220, 0.95)",
    },
    text: {
      primary: "#2F4F4F",
      secondary: "#696969",
    },
    divider: "#8B4513",
  },
  typography: {
    fontFamily: '"VT323", monospace',
    h1: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "3.5rem",
      color: "#2F4F4F",
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    },
    h2: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "3rem",
      color: "#2F4F4F",
      textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
    },
    h3: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "2.5rem",
      color: "#2F4F4F",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    },
    h4: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "2rem",
      color: "#2F4F4F",
    },
    h5: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "1.5rem",
      color: "#2F4F4F",
    },
    h6: {
      fontFamily: '"VT323", monospace',
      fontWeight: 400,
      fontSize: "1.25rem",
      color: "#2F4F4F",
    },
    body1: {
      fontFamily: '"VT323", monospace',
      fontSize: "1.1rem",
      lineHeight: 1.4,
    },
    body2: {
      fontFamily: '"VT323", monospace',
      fontSize: "1rem",
      lineHeight: 1.3,
    },
    button: {
      fontFamily: '"VT323", monospace',
      fontSize: "1.1rem",
      fontWeight: 400,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"VT323", monospace',
          fontSize: "1.1rem",
          textTransform: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          minHeight: "40px",
          background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
          boxShadow:
            "0 2px 8px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          border: "1px solid #654321",
          color: "#F5DEB3",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(135deg, #A0522D 0%, #8B4513 100%)",
            boxShadow:
              "0 4px 12px rgba(184, 134, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 2px 4px rgba(139, 69, 19, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #A0522D 0%, #B8860B 100%)",
          },
        },
        outlined: {
          background:
            "linear-gradient(135deg, rgba(245, 245, 220, 0.9) 0%, rgba(245, 245, 220, 0.7) 100%)",
          border: "2px solid #8B4513",
          color: "#2F4F4F",
          padding: "10px 22px",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.2) 100%)",
            borderColor: "#B8860B",
            boxShadow: "0 2px 8px rgba(184, 134, 11, 0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(135deg, rgba(245, 245, 220, 0.95) 0%, rgba(245, 245, 220, 0.85) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 69, 19, 0.3)",
          boxShadow:
            "0 4px 20px rgba(47, 79, 79, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        },
        elevation3: {
          boxShadow:
            "0 6px 25px rgba(47, 79, 79, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(245, 245, 220, 0.8)",
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#8B4513",
              borderWidth: "2px",
            },
            "&:hover fieldset": {
              borderColor: "#B8860B",
              boxShadow: "0 0 8px rgba(184, 134, 11, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#B8860B",
              boxShadow: "0 0 12px rgba(184, 134, 11, 0.4)",
            },
          },
          "& .MuiInputBase-input": {
            fontFamily: '"VT323", monospace',
            fontSize: "1.1rem",
            color: "#2F4F4F",
            padding: "14px 16px",
          },
          "& .MuiInputLabel-root": {
            fontFamily: '"VT323", monospace',
            fontSize: "1.1rem",
            color: "#696969",
            "&.Mui-focused": {
              color: "#B8860B",
            },
          },
          "& .MuiFormHelperText-root": {
            fontFamily: '"VT323", monospace',
            fontSize: "1rem",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiSelect-select": {
            padding: "14px 16px",
            fontSize: "1.1rem",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            fontFamily: '"VT323", monospace',
            fontSize: "1.1rem",
            color: "#696969",
            "&.Mui-focused": {
              color: "#B8860B",
            },
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          background: "rgba(245, 245, 220, 0.9)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
            color: "#F5DEB3",
            fontFamily: '"VT323", monospace',
            fontSize: "1.2rem",
            fontWeight: 400,
            borderBottom: "2px solid #654321",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"VT323", monospace',
          fontSize: "1.1rem",
          borderBottom: "1px solid rgba(139, 69, 19, 0.2)",
          padding: "12px 16px",
        },
        head: {
          fontWeight: "bold",
          fontSize: "1.1rem",
          textAlign: "left",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            background: "rgba(245, 245, 220, 0.5)",
          },
          "&:hover": {
            background: "rgba(184, 134, 11, 0.1)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#8B4513",
          padding: "8px",
          borderRadius: "8px",
          "&:hover": {
            background: "rgba(184, 134, 11, 0.1)",
            color: "#B8860B",
            transform: "scale(1.05)",
          },
          "&.MuiIconButton-colorError": {
            "&:hover": {
              background: "rgba(139, 0, 0, 0.1)",
              color: "#8B0000",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
          color: "#F5DEB3",
          fontFamily: '"VT323", monospace',
          fontSize: "1rem",
          "&.MuiChip-outlined": {
            background: "rgba(245, 245, 220, 0.8)",
            color: "#2F4F4F",
            border: "1px solid #8B4513",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(135deg, rgba(245, 245, 220, 0.98) 0%, rgba(245, 245, 220, 0.92) 100%)",
          backdropFilter: "blur(15px)",
          border: "2px solid #8B4513",
          borderRadius: "12px",
          padding: "0",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"VT323", monospace',
          fontSize: "1.8rem",
          color: "#2F4F4F",
          textAlign: "center",
          borderBottom: "2px solid rgba(139, 69, 19, 0.3)",
          background:
            "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(184, 134, 11, 0.05) 100%)",
          padding: "20px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px 24px",
          gap: "12px",
          borderTop: "1px solid rgba(139, 69, 19, 0.2)",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            fontFamily: '"VT323", monospace',
            fontSize: "1.1rem",
            color: "#2F4F4F",
            border: "1px solid #8B4513",
            "&:hover": {
              background: "rgba(184, 134, 11, 0.2)",
            },
            "&.Mui-selected": {
              background: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
              color: "#F5DEB3",
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"VT323", monospace',
          fontSize: "1.1rem",
          borderRadius: "8px",
        },
        standardError: {
          background:
            "linear-gradient(135deg, rgba(139, 0, 0, 0.1) 0%, rgba(205, 92, 92, 0.1) 100%)",
          border: "1px solid #8B0000",
          color: "#8B0000",
        },
        standardSuccess: {
          background:
            "linear-gradient(135deg, rgba(85, 107, 47, 0.1) 0%, rgba(107, 142, 35, 0.1) 100%)",
          border: "1px solid #556B2F",
          color: "#2E4A1F",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(135deg, rgba(139, 69, 19, 0.95) 0%, rgba(160, 82, 45, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(47, 79, 79, 0.3)",
          borderBottom: "2px solid rgba(184, 134, 11, 0.3)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(135deg, rgba(245, 245, 220, 0.9) 0%, rgba(245, 245, 220, 0.8) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 69, 19, 0.3)",
          borderRadius: "12px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 8px 25px rgba(47, 79, 79, 0.2), 0 0 20px rgba(184, 134, 11, 0.1)",
          },
        },
      },
    },
  },
});

export default theme;
