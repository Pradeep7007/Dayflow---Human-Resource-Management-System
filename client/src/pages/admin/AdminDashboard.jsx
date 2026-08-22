import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Clock,
  AlertTriangle,
  FileText,
  UserPlus,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldAlert,
  BarChart3,
  Calendar,
  Activity,
  Download,
  Plus
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';
import { CreateEmployeeModal } from '../../components/employee/CreateEmployeeModal';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalEmployees: 24,
      presentToday: 21,
      onLeaveToday: 2,
      pendingLeaveApprovals: 3,
    },
    attention: {
      pendingLeaves: [
        {
          _id: 'l1',
          employeeName: 'Tharun R',
          leaveType: 'Paid',
          startDate: '2026-08-25',
          endDate: '2026-08-27',
          reason: 'Family event and personal travel',
          daysCount: 3,
        },
        {
          _id: 'l2',
          employeeName: 'Ananya Sharma',
          leaveType: 'Sick',
          startDate: '2026-08-23',
          endDate: '2026-08-24',
          reason: 'Viral fever recovery',
          daysCount: 2,
        },
      ],
      anomalies: [
        {
          id: 'a1',
          type: 'Missing Check-Out',
          employeeName: 'Kishore M',
          detail: 'Checked in at 09:12 AM but no check-out recorded yet.',
          severity: 'high',
        },
        {
          id: 'a2',
          type: 'Half-Day Logged',
          employeeName: 'Vikram Seth',
          detail: 'Late arrival at 11:30 AM. Working hours: 4.5 hrs.',
          severity: 'medium',
        },
      ],
      expiringDocumentsCount: 2,
    },
    overview: {
      activeRate: 91,
      departmentDistribution: [
        { department: 'Engineering', count: 10 },
        { department: 'Human Resources', count: 4 },
        { department: 'Operations', count: 5 },
        { department: 'Quality Assurance', count: 3 },
        { department: 'Design', count: 2 },
      ],
      leaveTrend: { Paid: 14, Sick: 6, Unpaid: 2 },
      attendanceTrend: [
        { day: 'Mon', presentCount: 22 },
        { day: 'Tue', presentCount: 23 },
        { day: 'Wed', presentCount: 21 },
        { day: 'Thu', presentCount: 24 },
        { day: 'Fri', presentCount: 20 },
        { day: 'Sat', presentCount: 18 },
        { day: 'Sun', presentCount: 0 },
      ],
    },
    recentActivity: [
      {
        id: 'act-1',
        title: 'New Employee Account Created: Tharun R',
        subtitle: 'Engineering • Employee Self-Service',
        time: 'Today, 09:30 AM',
        icon: 'user',
      },
      {
        id: 'act-2',
        title: 'Leave Approved: Ananya Sharma',
        subtitle: 'Sick Leave (2 days)',
        time: 'Today, 08:45 AM',
        icon: 'check',
      },
      {
        id: 'act-3',
        title: 'Payroll Dispatched: August Cycle',
        subtitle: 'Processed for 24 active employees',
        time: 'Yesterday',
        icon: 'payroll',
      },
    ],
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/dashboard/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setDashboardData(data);
          }
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApproveLeave = async (leaveId, name) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/leaves/${leaveId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Approved', adminComment: 'Quick approved from HR Command Center' }),
      });

      addToast({
        title: 'Leave Approved',
        message: `Leave request for ${name} has been approved.`,
        type: 'success',
      });

      // Update state locally
      setDashboardData((prev) => ({
        ...prev,
        attention: {
          ...prev.attention,
          pendingLeaves: prev.attention.pendingLeaves.filter((l) => l._id !== leaveId),
        },
        summary: {
          ...prev.summary,
          pendingLeaveApprovals: Math.max(0, prev.summary.pendingLeaveApprovals - 1),
        },
      }));
    } catch (err) {
      addToast({ title: 'Error', message: 'Failed to update leave status.', type: 'error' });
    }
  };

  const { summary, attention, overview, recentActivity } = dashboardData;

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER & QUICK ACTIONS ROW */}
      <PageHeader
        title="HR Command Center"
        subtitle="Live workforce tracking, critical action items, and workforce analytics."
        breadcrumbs={['DayFlow', 'Admin', 'HR Command Center']}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={15} />}
              onClick={() => addToast({ title: 'Exporting', message: 'Exporting HR metrics report...', type: 'info' })}
            >
              Export Metrics
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Employee
            </Button>
          </div>
        }
      />

      {/* QUICK ACTIONS BAR */}
      <Card className="bg-slate-900/80 border-slate-800">
        <CardBody className="p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" />
              Quick Command Shortcuts:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus size={14} /> Add Employee
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.LEAVES)}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CalendarCheck size={14} /> Review Leaves ({summary.pendingLeaveApprovals})
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.ATTENDANCE)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock size={14} /> Attendance Board
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.PAYROLL)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText size={14} /> Payroll & Slips
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* QUESTION 1: WHAT IS HAPPENING TODAY? (TOP SUMMARY KPI METRICS) */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Calendar size={14} className="text-indigo-400" />
          Today's Live Snapshot
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverable className="border-l-4 border-l-indigo-500">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Workforce</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{summary.totalEmployees}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-400" /> {overview.activeRate}% Active Shift Participation
              </div>
            </CardBody>
          </Card>

          <Card hoverable className="border-l-4 border-l-emerald-500">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present Today</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CalendarCheck size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">{summary.presentToday}</div>
              <div className="text-[11px] text-slate-400 mt-1">Checked in across all departments</div>
            </CardBody>
          </Card>

          <Card hoverable className="border-l-4 border-l-purple-500">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Leave Today</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Clock size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-400">{summary.onLeaveToday}</div>
              <div className="text-[11px] text-slate-400 mt-1">Approved & active leave status</div>
            </CardBody>
          </Card>

          <Card hoverable className="border-l-4 border-l-amber-500">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400">{summary.pendingLeaveApprovals}</div>
              <div className="text-[11px] text-slate-400 mt-1">Awaiting HR manager review</div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* QUESTION 2: WHAT REQUIRES MY ATTENTION? (ACTION CENTER GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Leave Requests Queue */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="h-full">
            <CardHeader
              title="Attention Required: Pending Approvals"
              subtitle="Leave requests requiring immediate administrative sign-off"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.ADMIN.LEAVES)}
                  rightIcon={<ArrowRight size={14} />}
                >
                  View All ({summary.pendingLeaveApprovals})
                </Button>
              }
            />
            <CardBody className="p-4 space-y-3">
              {attention.pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                  No pending leave approvals! HR queue is clear.
                </div>
              ) : (
                attention.pendingLeaves.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={item.employeeName} size="sm" />
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          {item.employeeName}
                          <Badge variant={item.leaveType === 'Sick' ? 'danger' : 'warning'} className="text-[10px]">
                            {item.leaveType} Leave ({item.daysCount} days)
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.startDate} to {item.endDate} • "{item.reason}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-400 hover:bg-emerald-500/10 text-xs py-1"
                        onClick={() => handleApproveLeave(item._id, item.employeeName)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:bg-slate-800 text-xs py-1"
                        onClick={() => navigate(ROUTES.ADMIN.LEAVES)}
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        {/* Attendance Anomalies & Document Alerts */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full">
            <CardHeader
              title="Attendance Anomalies & HR Actions"
              subtitle="System flagged exceptions requiring follow-up"
            />
            <CardBody className="p-4 space-y-3">
              {attention.anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <ShieldAlert size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-red-300 flex items-center gap-2">
                      {anom.type} • <span className="text-white">{anom.employeeName}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{anom.detail}</p>
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText size={18} className="text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-amber-200">Expiring Tax & Compliance Documents</div>
                    <p className="text-[11px] text-slate-300">2 employee tax forms require annual verification.</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-amber-300 text-xs" onClick={() => navigate(ROUTES.ADMIN.EMPLOYEES)}>
                  Fix
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* QUESTION 3: WHAT TRENDS SHOULD I KNOW ABOUT? (WORKFORCE OVERVIEW & RECENT ACTIVITY) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution & Attendance Trend */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader
              title="Workforce Analytics & Department Breakdown"
              subtitle="Departmental headcount distribution across the company"
            />
            <CardBody className="p-4 space-y-4">
              {/* Department Progress Bars */}
              <div className="space-y-3">
                {overview.departmentDistribution.map((dept, idx) => {
                  const percentage = Math.round((dept.count / (summary.totalEmployees || 1)) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{dept.department}</span>
                        <span className="text-slate-400 font-mono">{dept.count} members ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 7-Day Weekly Attendance Trend Visualization */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <BarChart3 size={14} className="text-emerald-400" />
                    7-Day Attendance Volume Trend
                  </span>
                  <span className="text-[11px] text-slate-400">Weekly Shift Logs</span>
                </div>
                <div className="flex items-end justify-between gap-2 h-20 pt-2 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  {overview.attendanceTrend.map((t, i) => {
                    const maxVal = Math.max(...overview.attendanceTrend.map((x) => x.presentCount || 1), 25);
                    const barHeight = Math.max(12, Math.round(((t.presentCount || 0) / maxVal) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[10px] font-mono text-slate-400">{t.presentCount}</span>
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500"
                          style={{ height: `${barHeight}%` }}
                          title={`${t.day}: ${t.presentCount} present`}
                        />
                        <span className="text-[10px] font-semibold text-slate-400">{t.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leave Breakdown Pills */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Leave Mix this Month:</span>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-bold">Paid ({overview.leaveTrend.Paid})</span>
                  <span className="text-amber-400 font-bold">Sick ({overview.leaveTrend.Sick})</span>
                  <span className="text-slate-400 font-bold">Unpaid ({overview.leaveTrend.Unpaid})</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Audit Activity Stream */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full">
            <CardHeader title="Recent Audit Activity" subtitle="Chronological stream of system updates" />
            <CardBody className="p-4 space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    <Activity size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{act.title}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* ADMIN WORKFORCE ACCOUNT CREATION MODAL */}
      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          addToast({
            title: 'Workforce Updated',
            message: 'New user account created successfully.',
            type: 'success',
          });
        }}
      />
    </div>
  );
};
