import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styling/global.css";
import { BrowserRouter } from "react-router-dom";
import App from "./utils/routes.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styling/theme.js";
import { NotificationProvider } from "./utils/NotificationContext.jsx";
import { UserProvider } from "./utils/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
