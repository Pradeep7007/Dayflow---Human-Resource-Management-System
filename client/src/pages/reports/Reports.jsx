import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/feedback/ToastContext';

export const Reports = () => {
  const { addToast } = useToast();

  const [reportCategory, setReportCategory] = useState('attendance'); // 'attendance' | 'leave' | 'payroll'
  const [dateRange, setDateRange] = useState('this-month');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Sample Aggregated Datasets for Reports
  const attendanceData = [
    { id: '1', date: '2026-08-22', employeeName: 'Tharun R', department: 'Engineering', status: 'Present', checkIn: '08:55 AM', checkOut: '06:05 PM', workingHours: 9.1 },
    { id: '2', date: '2026-08-22', employeeName: 'Ananya Sharma', department: 'Human Resources', status: 'Present', checkIn: '09:02 AM', checkOut: '06:00 PM', workingHours: 8.9 },
    { id: '3', date: '2026-08-22', employeeName: 'Vikram Seth', department: 'Operations', status: 'Half-day', checkIn: '10:15 AM', checkOut: '06:10 PM', workingHours: 7.9 },
    { id: '4', date: '2026-08-22', employeeName: 'Kishore M', department: 'Quality Assurance', status: 'Absent', checkIn: '—', checkOut: '—', workingHours: 0 },
    { id: '5', date: '2026-08-21', employeeName: 'Rohan Verma', department: 'Design', status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM', workingHours: 9.0 },
  ];

  const leaveData = [
    { id: '1', employeeName: 'Tharun R', department: 'Engineering', leaveType: 'Casual', startDate: '2026-08-24', endDate: '2026-08-26', daysCount: 3, status: 'Pending' },
    { id: '2', employeeName: 'Ananya Sharma', department: 'Human Resources', leaveType: 'Sick', startDate: '2026-08-18', endDate: '2026-08-19', daysCount: 2, status: 'Approved' },
    { id: '3', employeeName: 'Vikram Seth', department: 'Operations', leaveType: 'Unpaid', startDate: '2026-08-10', endDate: '2026-08-10', daysCount: 1, status: 'Approved' },
    { id: '4', employeeName: 'Kishore M', department: 'Quality Assurance', leaveType: 'Casual', startDate: '2026-08-02', endDate: '2026-08-03', daysCount: 2, status: 'Rejected' },
  ];

  const payrollData = [
    { id: '1', employeeName: 'Tharun R', department: 'Engineering', baseSalary: 120000, grossSalary: 149000, deductions: 9500, netSalary: 139500, payPeriod: 'August 2026' },
    { id: '2', employeeName: 'Ananya Sharma', department: 'Human Resources', baseSalary: 95000, grossSalary: 116500, deductions: 7500, netSalary: 109000, payPeriod: 'August 2026' },
    { id: '3', employeeName: 'Vikram Seth', department: 'Operations', baseSalary: 85000, grossSalary: 101000, deductions: 6800, netSalary: 94200, payPeriod: 'August 2026' },
    { id: '4', employeeName: 'Kishore M', department: 'Quality Assurance', baseSalary: 90000, grossSalary: 109500, deductions: 7200, netSalary: 102300, payPeriod: 'August 2026' },
  ];

  // Selected Active Data List based on report category
  const activeDataset =
    reportCategory === 'attendance'
      ? attendanceData
      : reportCategory === 'leave'
      ? leaveData
      : payrollData;

  const filteredData = activeDataset.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === 'all' || item.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Client-side CSV Export Generator
  const handleExportCSV = () => {
    if (filteredData.length === 0) return;

    const headers = Object.keys(filteredData[0]).join(',');
    const rows = filteredData.map((obj) => Object.values(obj).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DayFlow_${reportCategory}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Report Downloaded',
      message: `Exported ${filteredData.length} records to CSV file.`,
      type: 'success',
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER */}
      <PageHeader
        title="Admin & HR Executive Reports"
        subtitle="Generate, visualize, and export attendance analytics, leave usage distributions, and payroll compensation records."
        breadcrumbs={['DayFlow', 'Admin', 'Reports & Analytics']}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Printer size={15} />}
              onClick={handleExportPDF}
              className="text-xs font-bold text-slate-100"
            >
              Print / Save PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileSpreadsheet size={15} />}
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Export CSV Report
            </Button>
          </div>
        }
      />

      {/* REPORT TYPE CATEGORY SELECTOR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setReportCategory('attendance')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            reportCategory === 'attendance'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[10px] font-mono uppercase font-black block ${reportCategory === 'attendance' ? 'text-indigo-100' : 'text-indigo-600'}`}>Category 01</span>
            <h3 className="text-base font-black mt-0.5">Attendance Analytics</h3>
            <p className={`text-xs mt-1 font-semibold ${reportCategory === 'attendance' ? 'text-indigo-100' : 'text-slate-600'}`}>Daily, weekly, monthly, absence & late check-ins</p>
          </div>
          <BarChart3 size={24} className={reportCategory === 'attendance' ? 'text-white' : 'text-indigo-600'} />
        </button>

        <button
          onClick={() => setReportCategory('leave')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            reportCategory === 'leave'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[10px] font-mono uppercase font-black block ${reportCategory === 'leave' ? 'text-indigo-100' : 'text-indigo-600'}`}>Category 02</span>
            <h3 className="text-base font-black mt-0.5">Leave Entitlement & Usage</h3>
            <p className={`text-xs mt-1 font-semibold ${reportCategory === 'leave' ? 'text-indigo-100' : 'text-slate-600'}`}>Leave quotas, type distribution & approval status</p>
          </div>
          <PieChart size={24} className={reportCategory === 'leave' ? 'text-white' : 'text-indigo-600'} />
        </button>

        <button
          onClick={() => setReportCategory('payroll')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
            reportCategory === 'payroll'
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[10px] font-mono uppercase font-black block ${reportCategory === 'payroll' ? 'text-indigo-100' : 'text-indigo-600'}`}>Category 03</span>
            <h3 className="text-base font-black mt-0.5">Payroll & Compensation</h3>
            <p className={`text-xs mt-1 font-semibold ${reportCategory === 'payroll' ? 'text-indigo-100' : 'text-slate-600'}`}>Salary summaries, tax deductions & payout history</p>
          </div>
          <TrendingUp size={24} className={reportCategory === 'payroll' ? 'text-white' : 'text-indigo-600'} />
        </button>
      </div>

      {/* FILTER BAR */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardBody className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            {/* Date Range */}
            <div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
              >
                <option value="this-month">This Month (August 2026)</option>
                <option value="last-month">Last Month (July 2026)</option>
                <option value="q3">Q3 2026 Fiscal Quarter</option>
                <option value="ytd">Year to Date 2026</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="present">Present / Approved</option>
                <option value="half-day">Half-day / Pending</option>
                <option value="absent">Absent / Rejected</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* USEFUL MINIMALIST DATA VISUALIZATION SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Filtered Records</span>
            <div className="text-3xl font-black text-indigo-700 font-mono mt-1">{filteredData.length}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Matches selected reporting filters</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Department Coverage</span>
            <div className="text-3xl font-black text-emerald-700 font-mono mt-1">5 Depts</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Engineering, HR, Ops, QA, Design</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-cyan-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Report Export Status</span>
            <div className="text-3xl font-black text-cyan-700 font-mono mt-1">Ready</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">CSV and PDF formatting active</p>
          </CardBody>
        </Card>
      </div>

      {/* DETAILED DATA TABLE */}
      {filteredData.length === 0 ? (
        <Card className="bg-white border border-slate-200 py-16 text-center shadow-sm">
          <CardBody className="space-y-3">
            <FileText size={48} className="text-slate-400 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No Report Data Found</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
              No entries match the selected date range and department filters. Try adjusting your search query.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div id="printable-report" className="overflow-x-auto w-full rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-900 border-b border-slate-200 uppercase tracking-wider font-black text-[11px]">
                {reportCategory === 'attendance' && (
                  <>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Check In</th>
                    <th className="py-3.5 px-4">Check Out</th>
                    <th className="py-3.5 px-4 text-right">Working Hours</th>
                  </>
                )}
                {reportCategory === 'leave' && (
                  <>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Start Date</th>
                    <th className="py-3.5 px-4">End Date</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </>
                )}
                {reportCategory === 'payroll' && (
                  <>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Pay Period</th>
                    <th className="py-3.5 px-4">Base Salary</th>
                    <th className="py-3.5 px-4">Gross Earnings</th>
                    <th className="py-3.5 px-4">Deductions</th>
                    <th className="py-3.5 px-4 text-right">Net Take-Home</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  {reportCategory === 'attendance' && (
                    <>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{row.date}</td>
                      <td className="py-3.5 px-4 text-slate-900 font-extrabold">{row.employeeName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{row.department}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={row.status === 'Present' ? 'success' : row.status === 'Half-day' ? 'warning' : 'danger'}
                          className="text-[10px] font-bold"
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.checkIn}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.checkOut}</td>
                      <td className="py-3.5 px-4 font-mono text-right font-black text-indigo-700">{row.workingHours} hrs</td>
                    </>
                  )}
                  {reportCategory === 'leave' && (
                    <>
                      <td className="py-3.5 px-4 text-slate-900 font-extrabold">{row.employeeName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{row.department}</td>
                      <td className="py-3.5 px-4 text-indigo-700 font-extrabold">{row.leaveType}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.startDate}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.endDate}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-900 font-bold">{row.daysCount} days</td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={row.status === 'Approved' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}
                          className="text-[10px] font-bold"
                        >
                          {row.status}
                        </Badge>
                      </td>
                    </>
                  )}
                  {reportCategory === 'payroll' && (
                    <>
                      <td className="py-3.5 px-4 text-slate-900 font-extrabold">{row.employeeName}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{row.department}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.payPeriod}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-900 font-extrabold">₹{row.baseSalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-indigo-700 font-black">₹{row.grossSalary.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-rose-700 font-black">-₹{row.deductions.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-right font-black text-emerald-700 text-sm">₹{row.netSalary.toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
