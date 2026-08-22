import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Table } from '../../components/data-display/Table';
import { useToast } from '../../components/feedback/ToastContext';

export const EmployeeDashboard = () => {
  const { addToast } = useToast();
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);

  const handleClockToggle = () => {
    if (!clockedIn) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockedIn(true);
      setClockTime(now);
      addToast({
        title: 'Clocked In Successfully',
        message: `Attendance recorded at ${now}. Have a productive day!`,
        type: 'success',
      });
    } else {
      setClockedIn(false);
      addToast({
        title: 'Clocked Out',
        message: 'Shift end time recorded successfully.',
        type: 'info',
      });
    }
  };

  const leaveBalances = [
    { type: 'Annual Leave', available: 12, total: 18, color: 'bg-indigo-500' },
    { type: 'Sick Leave', available: 5, total: 7, color: 'bg-emerald-500' },
    { type: 'Casual Leave', available: 3, total: 5, color: 'bg-amber-500' },
  ];

  const myRequests = [
    { id: '1', type: 'Annual Leave', dates: 'Sep 10 - Sep 12', days: '3 Days', status: 'pending' },
    { id: '2', type: 'Casual Leave', dates: 'Aug 14', days: '1 Day', status: 'approved' },
    { id: '3', type: 'Expense Reimbursement', dates: 'Aug 02', days: '$140.00', status: 'paid' },
  ];

  const columns = [
    { title: 'Type', key: 'type', render: (val) => <span className="font-semibold">{val}</span> },
    { title: 'Dates / Details', key: 'dates' },
    { title: 'Duration / Amount', key: 'days' },
    { title: 'Status', key: 'status', render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome Back, Alex!"
        subtitle="Manage your attendance, view leave balances, and submit requests."
        breadcrumbs={['DayFlow', 'Employee', 'Portal']}
        action={
          <Button
            variant={clockedIn ? 'destructive' : 'primary'}
            leftIcon={<Clock size={16} />}
            onClick={handleClockToggle}
          >
            {clockedIn ? `Clock Out (In since ${clockTime})` : 'Clock In Now'}
          </Button>
        }
      />

      {/* Top Section: Attendance Card & Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Attendance Widget */}
        <Card className="lg:col-span-1 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
          <CardHeader title="Today's Attendance" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} />
          <CardBody className="p-6 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
              clockedIn ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Clock size={32} />
            </div>

            <Badge variant={clockedIn ? 'success' : 'neutral'} size="md" className="mb-2">
              {clockedIn ? 'Shift Active' : 'Not Clocked In'}
            </Badge>

            <p className="text-xs text-slate-500 mb-6">
              {clockedIn ? `Clocked in at ${clockTime}` : 'Standard Shift: 9:00 AM - 6:00 PM'}
            </p>

            <Button
              variant={clockedIn ? 'destructive' : 'primary'}
              size="lg"
              className="w-full"
              onClick={handleClockToggle}
            >
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </CardBody>
        </Card>

        {/* Leave Balances Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leaveBalances.map((item, idx) => (
            <Card key={idx}>
              <CardBody className="p-5 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">{item.type}</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                    {item.available} <span className="text-sm font-normal text-slate-400">/ {item.total} days</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.available / item.total) * 100}%` }}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* My Requests Table */}
      <Card>
        <CardHeader title="My Recent Requests" subtitle="Track your leave and reimbursement approvals" />
        <Table columns={columns} data={myRequests} />
      </Card>
    </div>
  );
};
