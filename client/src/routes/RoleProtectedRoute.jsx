import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from '../components/feedback/LoadingState';
import { ROUTES } from '../constants/routes';

export const RoleProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking authorization..." fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.AUTH.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};
