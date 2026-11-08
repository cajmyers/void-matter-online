import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts";
import "./theme/theme.css";
import { App } from "./app/App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
