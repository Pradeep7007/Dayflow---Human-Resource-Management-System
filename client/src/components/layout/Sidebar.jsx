import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  UserCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const { role, user } = useAuth();

  const adminNav = [
    { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'Smart Insights', path: ROUTES.ADMIN.INSIGHTS, icon: Zap },
    { label: 'Risk Alerts', path: ROUTES.ADMIN.ALERTS, icon: ShieldAlert },
    { label: 'Employees', path: ROUTES.ADMIN.EMPLOYEES, icon: Users },
    { label: 'Attendance', path: ROUTES.ADMIN.ATTENDANCE, icon: CalendarCheck },
    { label: 'Leave & Time-Off', path: ROUTES.ADMIN.LEAVES, icon: CalendarDays },
    { label: 'Payroll', path: ROUTES.ADMIN.PAYROLL, icon: CreditCard },
    { label: 'HR Help Center', path: ROUTES.HELP_CENTER, icon: HelpCircle },
    { label: 'Documents', path: ROUTES.ADMIN.DOCUMENTS, icon: FileText },
    { label: 'Reports & Analytics', path: ROUTES.ADMIN.REPORTS, icon: BarChart3 },
    { label: 'System Settings', path: ROUTES.ADMIN.SETTINGS, icon: Settings },
  ];

  const employeeNav = [
    { label: 'My Dashboard', path: ROUTES.EMPLOYEE.DASHBOARD, icon: LayoutDashboard },
    { label: 'My Profile', path: ROUTES.EMPLOYEE.PROFILE, icon: UserCheck },
    { label: 'My Attendance', path: ROUTES.EMPLOYEE.ATTENDANCE, icon: CalendarCheck },
    { label: 'Leave Requests', path: ROUTES.EMPLOYEE.LEAVES, icon: CalendarDays },
    { label: 'My Payslips', path: ROUTES.EMPLOYEE.PAYROLL, icon: CreditCard },
    { label: 'HR Help Center', path: ROUTES.EMPLOYEE.HELP_CENTER, icon: HelpCircle },
    { label: 'My Documents', path: ROUTES.EMPLOYEE.DOCUMENTS, icon: FileText },
  ];

  const navItems = role === ROLES.EMPLOYEE ? employeeNav : adminNav;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 md:z-30 bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-xl shadow-md flex-shrink-0">
              D
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight">DayFlow</span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-indigo-400">Enterprise HRMS</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border-0"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>

            <button
              onClick={onToggleCollapse}
              className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition-colors cursor-pointer border-0"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Role Indicator */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="mx-3 mt-4 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center gap-2">
            <Building2 size={16} className="text-indigo-400 flex-shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 truncate">DayFlow HRMS</span>
              <span className="text-[10px] text-slate-400 capitalize font-medium">{role || 'Employee'} Portal</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
            {!isCollapsed || isMobileOpen ? 'Navigation' : '•'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* UI System Link */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavLink
              to={ROUTES.DESIGN_SYSTEM}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-purple-400 hover:bg-slate-800 hover:text-purple-300'
                } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed && !isMobileOpen ? 'UI Component Gallery' : undefined}
            >
              <Sparkles size={18} className="flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span>UI System Gallery</span>}
            </NavLink>
          </div>
        </nav>

        {/* User Quick Profile Bottom Bar */}
        <div className="p-3 border-t border-slate-800">
          <div className={`flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
              {user?.name ? user.name.substring(0, 2) : 'DF'}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || 'DayFlow User'}
                </span>
                <span className="text-[10px] text-slate-400 truncate capitalize">
                  {role || 'Employee'}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
