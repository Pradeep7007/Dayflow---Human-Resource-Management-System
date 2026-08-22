import React, { useState } from 'react';
import { Users, CalendarCheck, Clock, CreditCard, Plus, Download, MoreVertical, Check, X, Eye } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Avatar } from '../../components/ui/Avatar';
import { Table } from '../../components/data-display/Table';
import { Dropdown } from '../../components/data-display/Dropdown';
import { useToast } from '../../components/feedback/ToastContext';

export const AdminDashboard = () => {
  const { addToast } = useToast();
  const [dataLoading, setDataLoading] = useState(false);

  const kpis = [
    { title: 'Total Workforce', value: '248', change: '+12 this month', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Present Today', value: '232', change: '93.5% attendance', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Approvals', value: '14', change: '8 leaves, 6 expenses', icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { title: 'Monthly Payroll', value: '$184,200', change: 'Due in 4 days', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
  ];

  const recentApprovals = [
    { id: '1', name: 'Eleanor Pena', role: 'UX Designer', dept: 'Design', type: 'Annual Leave', duration: '3 Days', date: 'Aug 24 - Aug 26', status: 'pending' },
    { id: '2', name: 'Cody Fisher', role: 'Frontend Dev', dept: 'Engineering', type: 'Sick Leave', duration: '1 Day', date: 'Aug 22', status: 'approved' },
    { id: '3', name: 'Esther Howard', role: 'HR Specialist', dept: 'People', type: 'Remote Work', duration: '2 Days', date: 'Aug 25 - Aug 26', status: 'pending' },
    { id: '4', name: 'Robert Fox', role: 'DevOps Lead', dept: 'Engineering', type: 'Casual Leave', duration: '1 Day', date: 'Aug 20', status: 'rejected' },
  ];

  const columns = [
    {
      title: 'Employee',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" />
          <div>
            <div className="font-semibold text-slate-900">{val}</div>
            <div className="text-xs text-slate-500">{row.role} • {row.dept}</div>
          </div>
        </div>
      ),
    },
    { title: 'Request Type', key: 'type' },
    { title: 'Duration', key: 'duration' },
    { title: 'Dates', key: 'date' },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Dropdown
          trigger={
            <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
              <MoreVertical size={16} />
            </button>
          }
          items={[
            {
              label: 'Approve Request',
              icon: <Check size={14} className="text-emerald-600" />,
              onClick: () => addToast({ title: 'Approved', message: `Leave for ${row.name} approved.`, type: 'success' }),
            },
            {
              label: 'Reject Request',
              icon: <X size={14} className="text-red-600" />,
              destructive: true,
              onClick: () => addToast({ title: 'Rejected', message: `Leave for ${row.name} rejected.`, type: 'warning' }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        subtitle="Manage workforce attendance, pending leaves, and payroll workflows."
        breadcrumbs={['DayFlow', 'Admin', 'Dashboard']}
        action={
          <>
            <Button variant="secondary" leftIcon={<Download size={16} />}>
              Export Summary
            </Button>
            <Button variant="primary" leftIcon={<Plus size={16} />}>
              Add Employee
            </Button>
          </>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} hoverable>
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`p-2.5 rounded-xl ${kpi.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
                <div className="text-xs text-slate-500 mt-1">{kpi.change}</div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Table Section */}
      <Card className="mb-6">
        <CardHeader
          title="Recent Approval Workflows"
          subtitle="Time-off and leave requests awaiting management review"
          action={
            <Button variant="ghost" size="sm" onClick={() => setDataLoading((prev) => !prev)}>
              {dataLoading ? 'Show Data' : 'Test Skeleton Loading'}
            </Button>
          }
        />
        <Table columns={columns} data={recentApprovals} isLoading={dataLoading} />
      </Card>
    </div>
  );
};
