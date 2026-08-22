import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastIcons = {
    success: <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle size={20} className="text-red-500 flex-shrink-0" />,
    warning: <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />,
    info: <Info size={20} className="text-blue-500 flex-shrink-0" />,
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="df-toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn('df-toast', `df-toast--${toast.type}`, 'toast-slide-in')}
            role="alert"
          >
            {toastIcons[toast.type]}
            <div className="df-toast__content">
              {toast.title && <div className="df-toast__title">{toast.title}</div>}
              {toast.message && <div className="df-toast__message">{toast.message}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-1"
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
