import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#0e0e10",   // app background (soft black)
      paper: "#16161a",     // cards, dialogs
    },

    primary: {
      main: "#7c7cff",      // modern soft violet/blue
    },

    secondary: {
      main: "#ff7a7a",      // subtle warm contrast
    },

    text: {
      primary: "#e5e5e5",   // not pure white
      secondary: "#a1a1aa",
    },
  },

  typography: {
    fontFamily: "Poppins, sans-serif",

    h1: { fontWeight: 600, fontSize: "70px" },
    h2: { fontWeight: 500, fontSize: "50px"},
    h3: { fontWeight: 400, fontSize: "30px" },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default darkTheme;
