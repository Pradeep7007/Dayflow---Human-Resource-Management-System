import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { DesignSystemShowcase } from '../pages/DesignSystemShowcase';
import { ROUTES } from '../constants/routes';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
      </Route>

      {/* Main Application Routes */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
        <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemShowcase />} />
        
        {/* Module Placeholders mapped to functional layout */}
        <Route path={ROUTES.ADMIN.EMPLOYEES} element={<DesignSystemShowcase />} />
        <Route path={ROUTES.ADMIN.ATTENDANCE} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.LEAVES} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.PAYROLL} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.DOCUMENTS} element={<DesignSystemShowcase />} />
        <Route path={ROUTES.ADMIN.REPORTS} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.SETTINGS} element={<DesignSystemShowcase />} />

        <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE.ATTENDANCE} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE.LEAVES} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE.PAYROLL} element={<EmployeeDashboard />} />
        <Route path={ROUTES.EMPLOYEE.DOCUMENTS} element={<EmployeeDashboard />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
    </Routes>
  );
};
