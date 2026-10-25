import React from "react";
import ReactDOM from "react-dom/client";

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

import App from "./App";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);