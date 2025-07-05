import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import setupLocatorUI from "@locator/runtime";
import App from "./App.tsx";

if (import.meta.env.MODE === "development") {
  setupLocatorUI();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
