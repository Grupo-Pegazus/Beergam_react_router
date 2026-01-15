import { createTheme, Paper } from "@mui/material";
import { ptBR } from "@mui/material/locale";

export const muiTheme = createTheme(
  {
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid transparent",
            backgroundColor: "var(--color-beergam-mui-paper)",
            color: "var(--color-beergam-typography-tertiary)",
            borderRadius: "8px",
            padding: "16px",
            transition: "all 0.3s ease",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 42,
            height: 26,
            padding: 0,
          },
          switchBase: {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "var(--color-beergam-primary)",
                opacity: 1,
                border: 0,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5,
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "var(--color-beergam-primary)",
              border: "6px solid #fff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "#f5f5f5",
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.7,
            },
          },
          thumb: {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          track: {
            borderRadius: 13,
            backgroundColor: "#E9E9EA",
            opacity: 1,
            transition: "background-color 500ms",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--color-beergam-input-background)",
            border: "1px solid var(--color-beergam-input-border)",
            color: "var(--color-beergam-typography-tertiary)",
            "&:hover": {
              backgroundColor: "var(--color-beergam-primary)",
              color: "var(--color-beergam-white)",
            },
            "&:disabled": {
              backgroundColor: "var(--color-beergam-input-background-disabled)",
              color: "var(--color-beergam-typography-secondary-disabled)",
            },
          },
        },
      },
      MuiStack: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "var(--color-beergam-typography-primary)",
          },
        },
      },
      MuiTableContainer: {
        defaultProps: {
          component: Paper,
        },
      },
      MuiTableCell: {
        styleOverrides: {
          sizeMedium: {
            "@media (max-width: 768px)": {
              display: "none",
            },
          },
          sizeSmall: {
            "@media (max-width: 768px)": {
              display: "none",
            },
          },
          head: {
            color: "var(--color-beergam-typography-primary)",
          },
          body: {
            color: "var(--color-beergam-typography-secondary)",
          },
        },
      },
      MuiStep: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
            "& .MuiStepLabel-root": {
              cursor: "pointer",
            },
            "& .MuiStepIcon-root": {
              cursor: "pointer",
              color: "var(--color-beergam-primary)",
              "&.Mui-completed": {
                color: "var(--color-beergam-primary)",
              },
              "&.Mui-active": {
                color: "var(--color-beergam-primary)",
              },
            },
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          root: {
            "& .MuiStepLabel-label": {
              fontSize: "0.875rem",
              transition: "all 0.2s ease-in-out",
              position: "relative",
              color: "var(--color-beergam-typography-secondary)",
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "var(--color-beergam-primary)",
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "var(--color-beergam-typography-secondary)",
            },
            "&:hover": {
              "& .MuiStepLabel-label": {
                color: "var(--color-beergam-primary)",
                fontWeight: 600,
              },
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              fontSize: "0.875rem", // text-sm
              backgroundColor: "var(--color-beergam-input-background)",
              color: "var(--color-beergam-typography-tertiary)",
              transition: "colors 200ms",
              "&.MuiOutlinedInput-root": {
                padding: "10px 12px", // py-2.5 px-3
                borderRadius: "8px", // rounded
                borderColor: "var(--color-beergam-input-border)",
                "& input": {
                  "&::placeholder": {
                    color: "var(--color-beergam-typography-tertiary)",
                    opacity: 1,
                  },
                },
                "& textarea": {
                  "&::placeholder": {
                    color: "var(--color-beergam-typography-tertiary)",
                    opacity: 1,
                  },
                },
                "& fieldset": {
                  borderColor: "var(--color-beergam-input-border)",
                  borderWidth: "1px",
                },
                "&:hover": {
                  "& fieldset": {
                    borderColor: "var(--color-beergam-input-border)",
                  },
                },
                "&.Mui-focused": {
                  borderColor: "var(--color-beergam-orange)",
                  outlineColor: "var(--color-beergam-orange)",
                  "& fieldset": {
                    borderColor: "var(--color-beergam-orange)",
                    borderWidth: "1px",
                  },
                },
                "&.Mui-error": {
                  "& fieldset": {
                    borderColor: "var(--color-beergam-red)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-beergam-red)",
                  },
                },
                "&.Mui-disabled": {
                  cursor: "not-allowed",
                  color: "var(--color-beergam-gray)",
                  backgroundColor: "var(--color-beergam-input-background)",
                  "& fieldset": {
                    borderColor: "var(--color-beergam-input-disabled-border)",
                  },
                },
              },
              "&.MuiInputBase-multiline": {
                "&.MuiOutlinedInput-root": {
                  padding: "10px 12px", // py-2.5 px-3
                },
              },
            },
            "& .MuiInputLabel-root": {
              color: "var(--color-beergam-typography-tertiary)",
              fontSize: "0.875rem", // text-sm
              "&.Mui-focused": {
                color: "var(--color-beergam-orange)",
              },
              "&.MuiInputLabel-shrink": {
                color: "var(--color-beergam-orange)",
              },
            },
            "& .MuiFormHelperText-root": {
              fontSize: "0.75rem",
              color: "var(--color-beergam-typography-tertiary)",
              "&.Mui-error": {
                color: "var(--color-beergam-red)",
              },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem", // text-sm
            backgroundColor: "var(--color-beergam-input-background)",
            color: "var(--color-beergam-typography-tertiary)",
            transition: "colors 200ms",
            "&.MuiOutlinedInput-root": {
              padding: "10px 12px", // py-2.5 px-3
              borderRadius: "8px", // rounded
              borderColor: "var(--color-beergam-input-border)",
              "& input": {
                "&::placeholder": {
                  color: "var(--color-beergam-typography-tertiary)",
                  opacity: 1,
                },
              },
              "& textarea": {
                "&::placeholder": {
                  color: "var(--color-beergam-typography-tertiary)",
                  opacity: 1,
                },
              },
              "& fieldset": {
                borderColor: "var(--color-beergam-input-border)",
                borderWidth: "1px",
              },
              "&:hover": {
                "& fieldset": {
                  borderColor: "var(--color-beergam-input-border)",
                },
              },
              "&.Mui-focused": {
                borderColor: "var(--color-beergam-orange)",
                outlineColor: "var(--color-beergam-orange)",
                "& fieldset": {
                  borderColor: "var(--color-beergam-orange)",
                  borderWidth: "1px",
                },
              },
              "&.Mui-error": {
                "& fieldset": {
                  borderColor: "var(--color-beergam-red)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-beergam-red)",
                },
              },
              "&.Mui-disabled": {
                cursor: "not-allowed",
                color: "var(--color-beergam-gray)",
                backgroundColor: "var(--color-beergam-input-background)",
                "& fieldset": {
                  borderColor: "var(--color-beergam-input-disabled-border)",
                },
              },
            },
            "&.MuiInputBase-multiline": {
              "&.MuiOutlinedInput-root": {
                padding: "10px 12px", // py-2.5 px-3
              },
            },
          },
        },
      },
    },
    typography: {
      fontFamily: "var(--default-font-family)",
    },
  },
  ptBR
);
