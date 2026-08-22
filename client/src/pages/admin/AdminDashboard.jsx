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
import { SmartInsightsWidget } from '../../components/dashboard/SmartInsightsWidget';

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
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Add Employee
            </Button>
          </div>
        }
      />

      {/* QUICK ACTIONS BAR */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardBody className="p-3.5 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" />
              Quick Command Shortcuts:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <UserPlus size={14} /> Add Employee
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.LEAVES)}
                className="px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <CalendarCheck size={14} /> Review Leaves ({summary.pendingLeaveApprovals})
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.ATTENDANCE)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Clock size={14} /> Attendance Board
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN.PAYROLL)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FileText size={14} /> Payroll & Slips
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* SMART INSIGHTS WIDGET */}
      <SmartInsightsWidget />

      {/* QUESTION 1: WHAT IS HAPPENING TODAY? (TOP SUMMARY KPI METRICS) */}
      <div>
        <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Calendar size={15} className="text-indigo-600" />
          Today's Live Snapshot
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card hoverable className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Total Workforce</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Users size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-700 leading-none">{summary.totalEmployees}</div>
              <div className="text-[11px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> {overview.activeRate}% Shift Participation
              </div>
            </CardBody>
          </Card>

          <Card hoverable className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Present Today</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <CalendarCheck size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 leading-none">{summary.presentToday}</div>
              <div className="text-[11px] font-semibold text-slate-700 mt-2">Checked in across shifts</div>
            </CardBody>
          </Card>

          <Card hoverable className="bg-white border border-slate-200 border-l-4 border-l-teal-600 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Expected Payout</span>
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-teal-700 font-mono leading-none">₹4,05,000</div>
              <div className="text-[11px] font-bold text-teal-700 mt-2">Prorated on 91% activity</div>
            </CardBody>
          </Card>

          <Card hoverable className="bg-white border border-slate-200 border-l-4 border-l-purple-600 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">On Leave Today</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Clock size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-600 leading-none">{summary.onLeaveToday}</div>
              <div className="text-[11px] font-semibold text-slate-700 mt-2">Approved active leave</div>
            </CardBody>
          </Card>

          <Card hoverable className="bg-white border border-slate-200 border-l-4 border-l-amber-600 shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Pending Approvals</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 leading-none">{summary.pendingLeaveApprovals}</div>
              <div className="text-[11px] font-semibold text-slate-700 mt-2">Awaiting manager review</div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* QUESTION 2: WHAT REQUIRES MY ATTENTION? (ACTION CENTER GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Leave Requests Queue */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="h-full bg-white border border-slate-200 shadow-sm">
            <CardHeader
              title="Attention Required: Pending Approvals"
              subtitle="Leave requests requiring immediate administrative sign-off"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-bold"
                  onClick={() => navigate(ROUTES.ADMIN.LEAVES)}
                  rightIcon={<ArrowRight size={14} />}
                >
                  View All ({summary.pendingLeaveApprovals})
                </Button>
              }
            />
            <CardBody className="p-4 space-y-3">
              {attention.pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-700 text-xs font-bold">
                  <CheckCircle2 size={26} className="text-emerald-600 mx-auto mb-2" />
                  No pending leave approvals! HR queue is clear.
                </div>
              ) : (
                attention.pendingLeaves.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={item.employeeName} size="md" />
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                          {item.employeeName}
                          <Badge variant={item.leaveType === 'Sick' ? 'danger' : 'warning'} className="text-[11px] font-bold">
                            {item.leaveType} Leave ({item.daysCount} days)
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-1">
                          {item.startDate} to {item.endDate} • "{item.reason}"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 text-xs font-extrabold py-1.5 px-3"
                        onClick={() => handleApproveLeave(item._id, item.employeeName)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 text-xs font-bold py-1.5 px-3"
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
          <Card className="h-full bg-white border border-slate-200 shadow-sm">
            <CardHeader
              title="Attendance Anomalies & HR Actions"
              subtitle="System flagged exceptions requiring follow-up"
            />
            <CardBody className="p-4 space-y-3">
              {attention.anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-3.5 rounded-xl bg-red-50/60 border border-red-200 flex items-start gap-3"
                >
                  <ShieldAlert size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-red-900 flex items-center gap-2">
                      {anom.type} • <span className="text-slate-900 font-extrabold">{anom.employeeName}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">{anom.detail}</p>
                  </div>
                </div>
              ))}

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-black text-amber-950">Expiring Tax & Compliance Documents</div>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">2 employee tax forms require annual verification.</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 text-xs font-extrabold py-1 px-3" onClick={() => navigate(ROUTES.ADMIN.EMPLOYEES)}>
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
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader
              title="Workforce Analytics & Department Breakdown"
              subtitle="Departmental headcount distribution across the company"
            />
            <CardBody className="p-4 space-y-4">
              {/* Department Progress Bars */}
              <div className="space-y-3.5">
                {overview.departmentDistribution.map((dept, idx) => {
                  const percentage = Math.round((dept.count / (summary.totalEmployees || 1)) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-black">
                        <span className="text-slate-900">{dept.department}</span>
                        <span className="text-slate-700 font-mono font-bold">{dept.count} members ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 7-Day Weekly Attendance Trend Visualization */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    <BarChart3 size={15} className="text-emerald-600" />
                    7-Day Attendance Volume Trend
                  </span>
                  <span className="text-xs font-bold text-slate-600">Weekly Shift Logs</span>
                </div>
                <div className="flex items-end justify-between gap-2.5 h-24 pt-3 px-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  {overview.attendanceTrend.map((t, i) => {
                    const maxVal = Math.max(...overview.attendanceTrend.map((x) => x.presentCount || 1), 25);
                    const barHeight = Math.max(14, Math.round(((t.presentCount || 0) / maxVal) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <span className="text-[11px] font-mono font-black text-emerald-700">{t.presentCount}</span>
                        <div
                          className="w-full rounded-t-md bg-emerald-600 transition-all duration-500"
                          style={{ height: `${barHeight}%` }}
                          title={`${t.day}: ${t.presentCount} present`}
                        />
                        <span className="text-[11px] font-black text-slate-800">{t.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leave Breakdown Pills */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-800">Leave Mix this Month:</span>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">Paid ({overview.leaveTrend.Paid})</span>
                  <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">Sick ({overview.leaveTrend.Sick})</span>
                  <span className="text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">Unpaid ({overview.leaveTrend.Unpaid})</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Audit Activity Stream */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full bg-white border border-slate-200 shadow-sm">
            <CardHeader title="Recent Audit Activity" subtitle="Chronological stream of system updates" />
            <CardBody className="p-4 space-y-3">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center flex-shrink-0 font-extrabold text-xs mt-0.5">
                    <Activity size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-extrabold text-slate-900">{act.title}</div>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{act.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full font-mono flex-shrink-0">
                    {act.time}
                  </span>
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
