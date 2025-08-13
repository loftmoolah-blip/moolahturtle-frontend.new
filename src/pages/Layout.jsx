
import React from "react";
import { AuthProvider } from "@/components/hooks/useAuth";
import { ToastProvider } from "@/components/common/Toast";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import LayoutComponent from "../components/common/LayoutComponent";

export default function layout({ children, currentPageName }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-white font-sans">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
              body { font-family: 'Manrope', sans-serif; }
            `}</style>
            
            <LayoutComponent currentPageName={currentPageName}>
              {children}
            </LayoutComponent>

          </div>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
