import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  UserX,
  Briefcase,
  Search,
  Filter,
  RefreshCw,
  CalendarDays
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useToast } from '../../components/feedback/ToastContext';
import API from '../../services/api';

export const EmployeeAttendance = () => {
  const { addToast } = useToast();

  const [todayRecord, setTodayRecord] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [stats, setStats] = useState({ totalDays: 0, presentCount: 0, halfDayCount: 0, absentCount: 0, leaveCount: 0, totalHours: 0, averageHours: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Today's Attendance & History
  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const [todayRes, historyRes] = await Promise.all([
        API.get('/attendance/today'),
        API.get('/attendance/my-records'),
      ]);

      setTodayRecord(todayRes.data.attendance);
      setHistoryRecords(historyRes.data.records || []);
      setStats(historyRes.data.stats || {});
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      addToast({
        title: 'Error Loading Attendance',
        message: err.message || 'Could not fetch attendance records.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  // Handle Check In
  const handleCheckIn = async () => {
    setIsSubmitting(true);
    try {
      const res = await API.post('/attendance/check-in');
      setTodayRecord(res.data.attendance);
      setIsSubmitting(false);
      addToast({
        title: 'Checked In Successfully',
        message: res.data.message,
        type: 'success',
      });
      fetchAttendanceData();
    } catch (err) {
      setIsSubmitting(false);
      addToast({ title: 'Check In Failed', message: err.message, type: 'error' });
    }
  };

  // Handle Check Out
  const handleCheckOut = async () => {
    setIsSubmitting(true);
    try {
      const res = await API.post('/attendance/check-out');
      setTodayRecord(res.data.attendance);
      setIsSubmitting(false);
      addToast({
        title: 'Checked Out Successfully',
        message: res.data.message,
        type: 'info',
      });
      fetchAttendanceData();
    } catch (err) {
      setIsSubmitting(false);
      addToast({ title: 'Check Out Failed', message: err.message, type: 'error' });
    }
  };

  // Status Badge Rendering Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Present</span>;
      case 'Half-day':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Half-day</span>;
      case 'Absent':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><AlertTriangle size={12} /> Absent</span>;
      case 'Leave':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Calendar size={12} /> Leave</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Filtered Records
  const filteredRecords = historyRecords.filter((record) => {
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      new Date(record.date).toLocaleDateString().includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.remarks && record.remarks.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const isCheckedIn = !!(todayRecord && todayRecord.checkIn);
  const isCheckedOut = !!(todayRecord && todayRecord.checkOut);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="My Attendance Portal"
        subtitle="Track daily shift check-ins, working hours, and monthly attendance history."
        breadcrumbs={['DayFlow', 'Employee', 'Attendance']}
      />

      {/* Top Banner & Quick Check In / Out Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/30">
          <CardHeader
            title="Today's Attendance Status"
            subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          />
          <CardBody className="p-6 flex flex-col items-center text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                isCheckedOut
                  ? 'bg-purple-100 text-purple-700 ring-4 ring-purple-50'
                  : isCheckedIn
                  ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <Clock size={32} />
            </div>

            <div className="mb-4">
              {todayRecord ? (
                renderStatusBadge(todayRecord.status)
              ) : (
                <Badge variant="neutral">Not Checked In Yet</Badge>
              )}
            </div>

            {/* Check in / Check out Timestamps */}
            <div className="grid grid-cols-2 gap-3 w-full bg-white p-3 rounded-xl border border-slate-200 text-xs mb-5">
              <div className="text-left border-r border-slate-100 pr-2">
                <span className="text-slate-400 font-semibold block">CHECK IN</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{todayRecord?.checkIn || '--:--'}</span>
              </div>
              <div className="text-left pl-2">
                <span className="text-slate-400 font-semibold block">CHECK OUT</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{todayRecord?.checkOut || '--:--'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isCheckedIn ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleCheckIn}
                isLoading={isSubmitting}
                leftIcon={<Clock size={18} />}
              >
                Check In Now
              </Button>
            ) : !isCheckedOut ? (
              <Button
                variant="destructive"
                size="lg"
                className="w-full"
                onClick={handleCheckOut}
                isLoading={isSubmitting}
                leftIcon={<Clock size={18} />}
              >
                Check Out Now
              </Button>
            ) : (
              <Button variant="secondary" size="lg" className="w-full" disabled leftIcon={<CheckCircle2 size={18} />}>
                Shift Completed Today
              </Button>
            )}
          </CardBody>
        </Card>

        {/* Attendance Summary Analytics Metrics */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Days Present</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{stats.presentCount || 0}</div>
              <p className="text-[11px] text-slate-400 mt-1">Full shift records</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Half-Days</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{stats.halfDayCount || 0}</div>
              <p className="text-[11px] text-slate-400 mt-1">Late / Partial shifts</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Approved Leave</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{stats.leaveCount || 0}</div>
              <p className="text-[11px] text-slate-400 mt-1">Time-off days</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Avg Hours / Day</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Briefcase size={18} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-3">{stats.averageHours || 0}h</div>
              <p className="text-[11px] text-slate-400 mt-1">Productive work hours</p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Attendance History Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Attendance History Logs</h3>
              <p className="text-xs text-slate-500">Detailed record of daily check-ins, check-outs, and shift status.</p>
            </div>

            {/* Controls & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search date or remarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Half-day">Half-day</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>

              <button
                type="button"
                onClick={fetchAttendanceData}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Refresh Records"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
              <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <CalendarDays size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Attendance Records Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No logs match your filter criteria. Try adjusting the search term or status filter.
              </p>
            </div>
          ) : (
            <div className="df-table-container">
              <table className="df-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In Time</th>
                    <th>Check Out Time</th>
                    <th>Working Hours</th>
                    <th>Notes / Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((item) => (
                    <tr key={item._id || item.date}>
                      <td className="font-semibold text-slate-900">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td>{renderStatusBadge(item.status)}</td>
                      <td className="font-mono text-xs">{item.checkIn || '--:--'}</td>
                      <td className="font-mono text-xs">{item.checkOut || '--:--'}</td>
                      <td className="font-medium text-slate-800">{item.workingHours ? `${item.workingHours} hrs` : '--'}</td>
                      <td className="text-slate-500 text-xs">{item.remarks || 'Regular Shift'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
