import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { SignUp } from '../pages/auth/SignUp';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { EmailVerification } from '../pages/auth/EmailVerification';
import { Unauthorized } from '../pages/Unauthorized';

// Dashboard & Business Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { DesignSystemShowcase } from '../pages/DesignSystemShowcase';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.AUTH.LOGIN} element={<Login />} />
        <Route path={ROUTES.AUTH.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.AUTH.RESET_PASSWORD} element={<ResetPassword />} />
        <Route path={ROUTES.AUTH.VERIFY_EMAIL} element={<EmailVerification />} />
      </Route>

      {/* 403 Forbidden Route */}
      <Route path={ROUTES.AUTH.UNAUTHORIZED} element={<Unauthorized />} />

      {/* Protected Routes (Requires Login) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route path={ROUTES.DESIGN_SYSTEM} element={<DesignSystemShowcase />} />

          {/* Admin & HR Protected Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]} />}>
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.EMPLOYEES} element={<DesignSystemShowcase />} />
            <Route path={ROUTES.ADMIN.ATTENDANCE} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.LEAVES} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.PAYROLL} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.DOCUMENTS} element={<DesignSystemShowcase />} />
            <Route path={ROUTES.ADMIN.REPORTS} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.SETTINGS} element={<DesignSystemShowcase />} />
          </Route>

          {/* Employee Protected Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.HR, ROLES.ADMIN]} />}>
            <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYEE.ATTENDANCE} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYEE.LEAVES} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYEE.PAYROLL} element={<EmployeeDashboard />} />
            <Route path={ROUTES.EMPLOYEE.DOCUMENTS} element={<EmployeeDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
    </Routes>
  );
};
