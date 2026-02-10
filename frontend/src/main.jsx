import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AnonymousProvider } from "./context/AnonymousContext";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AnonymousProvider>
      <App />
    </AnonymousProvider>
  </React.StrictMode>
);
