import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

// Lazy Loaded Auth Pages
const Login = lazy(() => import('../pages/auth/Login').then((m) => ({ default: m.Login })));
const SignUp = lazy(() => import('../pages/auth/SignUp').then((m) => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const EmailVerification = lazy(() => import('../pages/auth/EmailVerification').then((m) => ({ default: m.EmailVerification })));
const Unauthorized = lazy(() => import('../pages/Unauthorized').then((m) => ({ default: m.Unauthorized })));

// Lazy Loaded Business Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const SmartInsights = lazy(() => import('../pages/insights/SmartInsights').then((m) => ({ default: m.SmartInsights })));
const WorkforceHealthAlerts = lazy(() => import('../pages/alerts/WorkforceHealthAlerts').then((m) => ({ default: m.WorkforceHealthAlerts })));
const HelpCenter = lazy(() => import('../pages/help/HelpCenter').then((m) => ({ default: m.HelpCenter })));
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })));
const Reports = lazy(() => import('../pages/reports/Reports').then((m) => ({ default: m.Reports })));
const EmployeeList = lazy(() => import('../pages/admin/EmployeeList').then((m) => ({ default: m.EmployeeList })));
const EmployeeDashboard = lazy(() => import('../pages/employee/EmployeeDashboard').then((m) => ({ default: m.EmployeeDashboard })));
const EmployeeProfile = lazy(() => import('../pages/employee/EmployeeProfile').then((m) => ({ default: m.EmployeeProfile })));
const EmployeeAttendance = lazy(() => import('../pages/attendance/EmployeeAttendance').then((m) => ({ default: m.EmployeeAttendance })));
const AdminAttendance = lazy(() => import('../pages/attendance/AdminAttendance').then((m) => ({ default: m.AdminAttendance })));
const EmployeeLeave = lazy(() => import('../pages/leave/EmployeeLeave').then((m) => ({ default: m.EmployeeLeave })));
const AdminLeaveWorkspace = lazy(() => import('../pages/leave/AdminLeaveWorkspace').then((m) => ({ default: m.AdminLeaveWorkspace })));
const AdminPayroll = lazy(() => import('../pages/payroll/AdminPayroll').then((m) => ({ default: m.AdminPayroll })));
const EmployeePayroll = lazy(() => import('../pages/payroll/EmployeePayroll').then((m) => ({ default: m.EmployeePayroll })));
const DesignSystemShowcase = lazy(() => import('../pages/DesignSystemShowcase').then((m) => ({ default: m.DesignSystemShowcase })));

// Page Loading Suspense Fallback
const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-300">
    <RefreshCw size={36} className="animate-spin text-indigo-500 mb-3" />
    <span className="text-xs font-bold tracking-wider uppercase">Loading DayFlow Workspace...</span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
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
            <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

            {/* Admin & HR Protected Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]} />}>
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN.INSIGHTS} element={<SmartInsights />} />
              <Route path={ROUTES.ADMIN.ALERTS} element={<WorkforceHealthAlerts />} />
              <Route path={ROUTES.ADMIN.EMPLOYEES} element={<EmployeeList />} />
              <Route path={ROUTES.ADMIN.ATTENDANCE} element={<AdminAttendance />} />
              <Route path={ROUTES.ADMIN.LEAVES} element={<AdminLeaveWorkspace />} />
              <Route path={ROUTES.ADMIN.PAYROLL} element={<AdminPayroll />} />
              <Route path={ROUTES.ADMIN.DOCUMENTS} element={<DesignSystemShowcase />} />
              <Route path={ROUTES.ADMIN.REPORTS} element={<Reports />} />
              <Route path={ROUTES.ADMIN.SETTINGS} element={<DesignSystemShowcase />} />
            </Route>

            {/* Employee Protected Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.HR, ROLES.ADMIN]} />}>
              <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
              <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeProfile />} />
              <Route path={ROUTES.EMPLOYEE.ATTENDANCE} element={<EmployeeAttendance />} />
              <Route path={ROUTES.EMPLOYEE.LEAVES} element={<EmployeeLeave />} />
              <Route path={ROUTES.EMPLOYEE.PAYROLL} element={<EmployeePayroll />} />
              <Route path={ROUTES.EMPLOYEE.DOCUMENTS} element={<EmployeeProfile />} />
              <Route path={ROUTES.EMPLOYEE.HELP_CENTER} element={<HelpCenter />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to={ROUTES.AUTH.LOGIN} replace />} />
      </Routes>
    </Suspense>
  );
};
