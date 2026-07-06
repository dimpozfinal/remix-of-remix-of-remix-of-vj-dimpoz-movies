import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { enableDevProtection } from "./lib/dev-protection";

// Enable developer tools protection
enableDevProtection();

createRoot(document.getElementById("root")!).render(<App />);

// Hide the initial splash once React has mounted
requestAnimationFrame(() => {
  // @ts-ignore
  if (typeof window !== "undefined" && typeof window.__hideSplash === "function") {
    // @ts-ignore
    window.__hideSplash();
  }
});
