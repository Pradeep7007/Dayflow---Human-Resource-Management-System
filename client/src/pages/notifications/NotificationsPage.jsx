import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Filter,
  RefreshCw,
  Clock,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Building,
  UserCheck,
  Zap,
  Activity,
  Check
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/feedback/ToastContext';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'Leave' | 'Attendance' | 'Payroll' | 'HR'
  const [activeView, setActiveView] = useState('notifications'); // 'notifications' | 'activity'

  const fetchNotificationData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [resNotif, resAct] = await Promise.all([
        fetch('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/notifications/activity', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const dataNotif = await resNotif.json();
      const dataAct = await resAct.json();
      setLoading(false);

      if (resNotif.ok && dataNotif.success) {
        setNotifications(dataNotif.notifications || []);
      }
      if (resAct.ok && dataAct.success) {
        setTimeline(dataAct.timeline || []);
      }
    } catch (err) {
      setLoading(false);
      console.error('Error loading notifications page:', err);
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications);
        addToast({ title: 'Notification Read', message: 'Notification marked as read.', type: 'info' });
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

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
        addToast({ title: 'All Read', message: 'All notifications marked as read.', type: 'success' });
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.isRead;
    return n.type.toLowerCase() === activeFilter.toLowerCase();
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER */}
      <PageHeader
        title="Notifications & Activity Stream"
        subtitle="Stay informed on leave approvals, payroll releases, attendance reminders, and system announcements."
        breadcrumbs={['DayFlow', 'Workspace', 'Notifications']}
        action={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCheck size={16} />}
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
              >
                Mark All as Read ({unreadCount})
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={fetchNotificationData}
              className="text-xs font-bold text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200"
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* VIEW SELECTOR & FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeView === 'notifications'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Notification Inbox ({notifications.length})
          </button>
          <button
            onClick={() => setActiveView('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeView === 'activity'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            Audit Activity Timeline ({timeline.length})
          </button>
        </div>

        {activeView === 'notifications' && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'unread', 'Leave', 'Attendance', 'Payroll', 'HR'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeFilter === filterKey
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filterKey === 'unread' ? `Unread (${unreadCount})` : filterKey}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* NOTIFICATION LIST VIEW */}
      {activeView === 'notifications' && (
        <div className="space-y-3">
          {loading ? (
            <div className="py-16 text-center text-slate-700">
              <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-xs font-bold">Loading notification stream...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Card className="bg-white border border-slate-200 py-16 text-center shadow-sm">
              <CardBody className="space-y-3">
                <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">No notifications in this category.</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                  You are all caught up! All pending alerts and contextual announcements have been reviewed.
                </p>
              </CardBody>
            </Card>
          ) : (
            filteredNotifications.map((item) => (
              <Card
                key={item.id}
                className={`bg-white border transition-all shadow-sm ${
                  !item.isRead ? 'border-indigo-600 border-l-4 border-l-indigo-600 bg-indigo-50/20' : 'border-slate-200'
                }`}
              >
                <CardBody className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                        item.type === 'Leave'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.type === 'Attendance'
                          ? 'bg-amber-100 text-amber-800'
                          : item.type === 'Payroll'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      <Bell size={20} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-600 font-mono flex items-center gap-1 font-semibold">
                          <Clock size={12} /> {item.time} ({item.date})
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check size={14} /> Mark Read
                      </button>
                    )}
                    {item.link && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(item.link)}
                        rightIcon={<ArrowRight size={14} />}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        View Module
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TIMELINE ACTIVITY VIEW */}
      {activeView === 'activity' && (
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader title="System Audit & Operational Timeline" subtitle="Sequential record of administrative actions, payroll runs, and shift updates" />
          <CardBody className="p-6">
            <div className="relative border-l-2 border-slate-200 pl-6 space-y-6 ml-2">
              {timeline.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white group-hover:scale-125 transition-all shadow" />

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-black text-indigo-700 uppercase">
                        {act.type} • {act.user}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-bold">{act.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{act.action}</h4>
                    <p className="text-xs text-slate-700 font-semibold">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
