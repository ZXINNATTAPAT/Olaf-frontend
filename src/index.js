import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./assets/styles/img.css";
import "./assets/styles/card.css";
import { AuthContextProvider, LoaderContextProvider } from "./shared/services";
import { BrowserRouter } from "react-router-dom";

// Force light theme - remove any saved theme preference
localStorage.removeItem("theme");
document.documentElement.setAttribute("data-theme", "light");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <LoaderContextProvider>
          <App />
        </LoaderContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
