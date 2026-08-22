import React, { useEffect, useState, useRef } from 'react';
import { Search, Bell, Sparkles, LogOut, CheckCheck, ArrowRight, Clock, Shield, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Dropdown } from '../data-display/Dropdown';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

export const Header = ({ isSidebarCollapsed, onToggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, logout, role } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications header:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.AUTH.LOGIN, { replace: true });
  };

  const userDropdownItems = [
    {
      label: 'Notifications Hub',
      icon: <Bell size={16} className="text-indigo-500" />,
      onClick: () => navigate(ROUTES.NOTIFICATIONS || '/notifications'),
    },
    {
      label: 'HR Help Center',
      icon: <Shield size={16} className="text-emerald-500" />,
      onClick: () => navigate(ROUTES.HELP_CENTER),
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
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-20 transition-all duration-300 flex items-center justify-between px-3 sm:px-6 left-0 ${
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64'
      }`}
    >
      {/* Mobile Menu Button & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border-0 cursor-pointer flex-shrink-0"
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, attendance..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-3">
        <Badge variant={role === 'admin' ? 'primary' : role === 'hr' ? 'secondary' : 'neutral'} size="sm" className="hidden sm:inline-flex uppercase">
          {role || 'Employee'}
        </Badge>

        {/* NOTIFICATION POPOVER DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer space-y-1 ${
                        !n.isRead ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase font-mono text-indigo-600">
                          {n.type}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock size={11} /> {n.time}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate(ROUTES.NOTIFICATIONS || '/notifications');
                  }}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 w-full py-1 cursor-pointer"
                >
                  View All Notifications & Timeline <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent text-left">
              <Avatar
                name={user?.name || 'DayFlow User'}
                size="sm"
                status="online"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || 'DayFlow User'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {user?.employeeId || 'EMP-1001'}
                </span>
              </div>
            </button>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
};
