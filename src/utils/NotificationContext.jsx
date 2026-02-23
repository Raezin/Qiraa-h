import React, { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const notify = useCallback((severity, message) => {
    setState({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setState((prev) => ({ ...prev, open: false }));
  };

  const api = {
    success: (msg) => notify("success", msg),
    error: (msg) => notify("error", msg),
    warning: (msg) => notify("warning", msg),
    info: (msg) => notify("info", msg),
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}

      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            backgroundColor: (() => {
              switch (state.severity) {
                case "success":
                  return "#2e7d32";
                case "error":
                  return "#d32f2f";
                case "warning":
                  return "#ed6c02";
                default:
                  return "#7c7cff";
              }
            })(),
            color: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used within NotificationProvider");
  }
  return context;
}
