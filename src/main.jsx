// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AnonymousProvider } from "./context/AnonymousContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AnonymousProvider>
        <App />
      </AnonymousProvider>
    </ThemeProvider>
  </React.StrictMode>
);
