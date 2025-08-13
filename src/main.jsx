import { Toaster } from "@/components/ui/toaster";import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "@/auth/AuthProvider.jsx";

// This is the context your RegistrationForm expects
import { ToastProvider } from "@/components/common/Toast.jsx";

// (Optional) If you have a shadcn toaster component, you can also render it inside ToastProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
