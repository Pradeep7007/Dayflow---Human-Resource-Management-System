import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/feedback/ToastContext';
import { AppRoutes } from './routes/AppRoutes';
import './styles/globals.css';
import './styles/components.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}
