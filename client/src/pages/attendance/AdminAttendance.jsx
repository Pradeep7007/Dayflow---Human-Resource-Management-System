import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Plus,
  Shield,
  Building,
  UserCheck,
  UserX,
  FileCheck
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/feedback/Modal';
import { useToast } from '../../components/feedback/ToastContext';
import API from '../../services/api';

export const AdminAttendance = () => {
  const { addToast } = useToast();

  const [records, setRecords] = useState([]);
  const [analytics, setAnalytics] = useState({ totalRecords: 0, present: 0, halfDay: 0, absent: 0, leave: 0, attendanceRate: 100 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Manual Override / Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [isSavingRecord, setIsSavingRecord] = useState(false);
  const [editForm, setEditForm] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    remarks: 'Manager Override',
  });

  // Fetch Attendance Records
  const fetchAttendance = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      let queryParams = [];
      if (statusFilter !== 'ALL') queryParams.push(`status=${statusFilter}`);
      if (selectedDate) queryParams.push(`date=${selectedDate}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/attendance/all${queryString}`);

      setRecords(res.data.records || []);
      setAnalytics(res.data.analytics || {});
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      addToast({
        title: 'Error Loading Attendance',
        message: err.message || 'Failed to fetch workforce attendance records.',
        type: 'error',
      });
    }
  };

  // Fetch Employee Users List for Modal Select
  const fetchEmployeesList = async () => {
    try {
      const res = await API.get('/employees/profile/me');
      // For fallback selection
      if (res.data.profile) {
        setEmployeesList([res.data.profile]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchEmployeesList();
  }, [statusFilter, selectedDate]);

  // Handle Manual Attendance Submit / Override
  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (!editForm.userId) {
      addToast({ title: 'Validation Error', message: 'Please select an employee.', type: 'warning' });
      return;
    }

    setIsSavingRecord(true);
    try {
      await API.post('/attendance/update', editForm);
      setIsSavingRecord(false);
      setIsModalOpen(false);
      addToast({ title: 'Attendance Updated', message: 'Workforce record saved successfully.', type: 'success' });
      fetchAttendance();
    } catch (err) {
      setIsSavingRecord(false);
      addToast({ title: 'Update Error', message: err.message, type: 'error' });
    }
  };

  // Render Status Badge Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Present</span>;
      case 'Half-day':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Half-day</span>;
      case 'Absent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><AlertTriangle size={12} /> Absent</span>;
      case 'Leave':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"><Calendar size={12} /> Leave</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Client Filter by Search Query (Name or Employee ID)
  const filteredRecords = records.filter((r) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(term) ||
      r.employeeId.toLowerCase().includes(term) ||
      (r.department && r.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Workforce Attendance Governance"
        subtitle="Monitor daily attendance, track presence ratios, and record manual overrides across departments."
        breadcrumbs={['DayFlow', 'Admin', 'Attendance']}
        action={
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={16} />}
          >
            Mark / Edit Attendance
          </Button>
        }
      />

      {/* Analytics KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Records</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{analytics.totalRecords || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Logged shifts</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-emerald-600 uppercase">Present</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">{analytics.present || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Full shift work</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-amber-600 uppercase">Half-Day</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">{analytics.halfDay || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Late arrivals</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-indigo-600 uppercase">On Leave</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mt-2">{analytics.leave || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Approved time-off</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-red-600 uppercase">Absent</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-2">{analytics.absent || 0}</div>
            <p className="text-[11px] text-slate-400 mt-1">Unexcused</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Attendance Table & Filters Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Employee Attendance Roster</h3>
              <p className="text-xs text-slate-500">Live attendance log per employee with date and check-in times.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, ID, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
              />

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

              {(selectedDate || statusFilter !== 'ALL' || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('');
                    setStatusFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-2 py-1"
                >
                  Clear Filters
                </button>
              )}

              <button
                type="button"
                onClick={fetchAttendance}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Refresh Table"
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
              <div className="h-8 bg-slate-100 rounded w-full animate-pulse" />
            </div>
          ) : isError ? (
            <div className="p-8 text-center bg-red-50/50">
              <AlertTriangle size={32} className="text-red-500 mx-auto mb-2" />
              <h4 className="font-bold text-red-900 text-sm">Failed to Load Attendance Records</h4>
              <p className="text-xs text-red-600 mt-1 mb-3">Server connection error. Please verify network or retry.</p>
              <Button variant="secondary" size="sm" onClick={fetchAttendance}>
                Retry Fetching
              </Button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Users size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Matching Attendance Records</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No employee records matched your filter criteria or search query.
              </p>
            </div>
          ) : (
            <div className="df-table-container">
              <table className="df-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Emp ID</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r._id || r.employeeId + r.date}>
                      <td className="font-bold text-slate-900">{r.employeeName}</td>
                      <td className="font-mono text-xs text-slate-500">{r.employeeId}</td>
                      <td className="text-xs text-slate-600">{r.department}</td>
                      <td className="text-xs text-slate-700">
                        {new Date(r.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="font-mono text-xs">{r.checkIn || '--:--'}</td>
                      <td className="font-mono text-xs">{r.checkOut || '--:--'}</td>
                      <td className="font-medium text-slate-800 text-xs">{r.workingHours ? `${r.workingHours}h` : '--'}</td>
                      <td>{renderStatusBadge(r.status)}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({
                              userId: r.user,
                              date: new Date(r.date).toISOString().split('T')[0],
                              status: r.status,
                              checkIn: r.checkIn || '09:00 AM',
                              checkOut: r.checkOut || '06:00 PM',
                              remarks: r.remarks || 'Admin Override',
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                          title="Edit Attendance"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* MANUAL ENTRY / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record / Override Employee Attendance"
        size="md"
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Employee</label>
            <input
              type="text"
              placeholder="Enter User ID or select employee"
              value={editForm.userId}
              onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>

          <Input
            label="Attendance Date"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />

          <Select
            label="Attendance Status"
            value={editForm.status}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            options={[
              { value: 'Present', label: 'Present (Full Day)' },
              { value: 'Half-day', label: 'Half-day (Late / Partial)' },
              { value: 'Absent', label: 'Absent' },
              { value: 'Leave', label: 'Approved Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Check In Time"
              value={editForm.checkIn}
              onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
            />
            <Input
              label="Check Out Time"
              value={editForm.checkOut}
              onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })}
            />
          </div>

          <Input
            label="Remarks / Override Note"
            value={editForm.remarks}
            onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSavingRecord}>
              Save Attendance Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
