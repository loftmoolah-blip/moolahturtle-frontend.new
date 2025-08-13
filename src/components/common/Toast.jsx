import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { 
      id, 
      ...toast,
      duration: toast.duration || 5000 // Default 5 seconds
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, duration: 0, ...options }); // Errors stay until dismissed
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const contextValue = {
    success,
    error,
    warning,
    info,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const { type, message, title } = toast;
  
  const styles = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };

  const style = styles[type] || styles.info;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${style.bgColor} border rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm`}
    >
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-medium ${style.textColor} mb-1`}>{title}</p>
        )}
        <p className={`text-sm ${style.textColor} break-words`}>{message}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};