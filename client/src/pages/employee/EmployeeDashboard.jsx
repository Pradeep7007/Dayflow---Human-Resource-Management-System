import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle2, FileText, ArrowUpRight, Palmtree, Stethoscope, HeartHandshake } from 'lucide-react';
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
    {
      id: 'annual',
      type: 'Annual Leave',
      available: 12,
      total: 18,
      icon: Palmtree,
      numColor: 'text-indigo-600',
      totalColor: 'text-indigo-700',
      barColor: 'bg-indigo-600',
      bgLight: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      id: 'sick',
      type: 'Sick Leave',
      available: 5,
      total: 7,
      icon: Stethoscope,
      numColor: 'text-emerald-600',
      totalColor: 'text-emerald-700',
      barColor: 'bg-emerald-600',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      id: 'casual',
      type: 'Casual Leave',
      available: 3,
      total: 5,
      icon: HeartHandshake,
      numColor: 'text-amber-600',
      totalColor: 'text-amber-700',
      barColor: 'bg-amber-600',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
  ];

  const myRequests = [
    { id: '1', type: 'Annual Leave', dates: 'Sep 10 - Sep 12', days: '3 Days', status: 'pending' },
    { id: '2', type: 'Casual Leave', dates: 'Aug 14', days: '1 Day', status: 'approved' },
    { id: '3', type: 'Expense Reimbursement', dates: 'Aug 02', days: '$140.00', status: 'paid' },
  ];

  const columns = [
    {
      title: 'Leave / Request Type',
      key: 'type',
      render: (val) => <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{val}</span>,
    },
    {
      title: 'Dates / Details',
      key: 'dates',
      render: (val) => <span className="font-mono text-indigo-700 font-bold text-xs">{val}</span>,
    },
    {
      title: 'Duration / Amount',
      key: 'days',
      render: (val) => <span className="font-mono text-emerald-700 font-extrabold text-xs">{val}</span>,
    },
    {
      title: 'Approval Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Welcome Back, Alex!"
        subtitle="Manage your attendance, view leave balances, and submit requests."
        breadcrumbs={['DayFlow', 'Employee', 'Portal']}
        action={
          <Button
            variant={clockedIn ? 'destructive' : 'primary'}
            leftIcon={<Clock size={16} />}
            onClick={handleClockToggle}
            className="font-bold shadow-sm"
          >
            {clockedIn ? `Clock Out (In since ${clockTime})` : 'Clock In Now'}
          </Button>
        }
      />

      {/* EXPECTED THIS MONTH SALARY BANNER CARD */}
      <Card className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
        <CardBody className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
              Expected This Month Salary (Projected Payout)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700 font-mono">₹1,02,273</span>
              <span className="text-xs font-bold text-slate-700">/ ₹1,12,500 Full Entitlement</span>
            </div>
            <p className="text-xs text-slate-700 font-medium pt-0.5">
              Based on monthly payslip structure, <strong className="text-slate-900 font-black">91% shift attendance</strong> (20/22 active days), and approved time-off requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="font-extrabold text-xs">
              20 Days Present
            </Badge>
            <Badge variant="primary" className="font-extrabold text-xs">
              2 Days Approved Leave
            </Badge>
            <Badge variant="warning" className="font-extrabold text-xs">
              91% Shift Activity
            </Badge>
          </div>
        </CardBody>
      </Card>

      {/* 2x2 GRID IMPLEMENTATION FOR TODAY'S ATTENDANCE + LEAVE BALANCES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* CARD 1 (Top-Left): Today's Attendance Widget */}
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Today's Attendance</h3>
                <p className="text-xs font-bold text-indigo-600 mt-0.5">{currentDateFormatted}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${clockedIn ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                <Clock size={22} />
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-5 flex flex-col items-center text-center space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Shift Status</div>
              <Badge variant={clockedIn ? 'success' : 'neutral'} size="md" className="font-extrabold text-xs">
                {clockedIn ? 'Shift Active' : 'Not Clocked In'}
              </Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 w-full text-center">
              <span className="text-xs font-black text-slate-900 block mb-0.5">Shift Schedule</span>
              <span className="text-xs font-mono font-bold text-indigo-700">
                {clockedIn ? `Clocked in at ${clockTime}` : 'Standard Shift: 9:00 AM - 6:00 PM'}
              </span>
            </div>

            <Button
              variant={clockedIn ? 'destructive' : 'primary'}
              size="md"
              className="w-full font-bold"
              onClick={handleClockToggle}
            >
              {clockedIn ? 'Clock Out' : 'Clock In Now'}
            </Button>
          </CardBody>
        </Card>

        {/* CARDS 2, 3, 4: Leave Balances (Annual Leave, Sick Leave, Casual Leave) */}
        {leaveBalances.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">{item.type}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Available Balance Quota</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${item.bgLight} ${item.numColor}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </CardHeader>

              <CardBody className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Leave Summary</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-4xl font-black ${item.numColor} leading-none`}>
                      {item.available}
                    </span>
                    <span className={`text-sm font-bold ${item.totalColor}`}>
                      / {item.total} days
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="text-slate-900 font-bold">Quota Usage</span>
                    <span className={item.totalColor}>{Math.round((item.available / item.total) * 100)}% Remaining</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full ${item.barColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${(item.available / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* My Requests Recent Log Table */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader title="My Recent Time-Off & Support Requests" subtitle="Track your leave and reimbursement approvals" />
        <Table columns={columns} data={myRequests} />
      </Card>
    </div>
  );
};
