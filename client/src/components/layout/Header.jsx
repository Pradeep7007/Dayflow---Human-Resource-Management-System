import React from 'react';
import { Search, Bell, Sparkles, User, LogOut, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../data-display/Dropdown';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export const Header = ({
  role = ROLES.ADMIN,
  onToggleRole,
  isSidebarCollapsed,
}) => {
  const navigate = useNavigate();

  const userDropdownItems = [
    {
      label: `Switch to ${role === ROLES.ADMIN ? 'Employee' : 'Admin'} View`,
      icon: <ArrowRightLeft size={16} />,
      onClick: onToggleRole,
    },
    {
      label: 'UI System Gallery',
      icon: <Sparkles size={16} className="text-purple-500" />,
      onClick: () => navigate(ROUTES.DESIGN_SYSTEM),
    },
    { divider: true },
    {
      label: 'Sign Out',
      icon: <LogOut size={16} />,
      destructive: true,
      onClick: () => navigate(ROUTES.AUTH.LOGIN),
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-20 transition-all duration-300 flex items-center justify-between px-6 ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, attendance, reports..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Toggle Button */}
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ArrowRightLeft size={14} />}
          onClick={onToggleRole}
          className="hidden sm:flex"
        >
          View as: <span className="font-bold capitalize ml-1 text-indigo-600">{role}</span>
        </Button>

        {/* Notifications Icon with Badge */}
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent text-left">
              <Avatar
                name={role === ROLES.ADMIN ? 'Sarah Jenkins' : 'Alex Morgan'}
                size="sm"
                status="online"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {role === ROLES.ADMIN ? 'Sarah Jenkins' : 'Alex Morgan'}
                </span>
                <span className="text-[10px] text-slate-500 capitalize">{role}</span>
              </div>
            </button>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
