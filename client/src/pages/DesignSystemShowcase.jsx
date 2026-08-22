import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Send,
  Plus,
  Trash2,
  Search,
  Mail,
  User,
  MoreVertical,
  Filter
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio, RadioGroup } from '../components/ui/Radio';
import { Badge } from '../components/ui/Badge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Avatar } from '../components/ui/Avatar';
import { Tooltip } from '../components/ui/Tooltip';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/feedback/Modal';
import { ConfirmationDialog } from '../components/feedback/ConfirmationDialog';
import { EmptyState } from '../components/feedback/EmptyState';
import { ErrorState } from '../components/feedback/ErrorState';
import { LoadingState } from '../components/feedback/LoadingState';
import { Dropdown } from '../components/data-display/Dropdown';
import { Tabs } from '../components/data-display/Tabs';
import { Table } from '../components/data-display/Table';
import { Pagination } from '../components/data-display/Pagination';
import { useToast } from '../components/feedback/ToastContext';

export const DesignSystemShowcase = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [radioValue, setRadioValue] = useState('option1');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const sampleTableData = [
    { id: '1', name: 'Sophia Martinez', email: 'sophia@dayflow.com', role: 'Engineering Lead', status: 'active', salary: '$145,000' },
    { id: '2', name: 'Marcus Chen', email: 'marcus@dayflow.com', role: 'Senior Product Manager', status: 'approved', salary: '$130,000' },
    { id: '3', name: 'Emily Watson', email: 'emily@dayflow.com', role: 'HR Business Partner', status: 'on_leave', salary: '$95,000' },
    { id: '4', name: 'David Kim', email: 'david@dayflow.com', role: 'Frontend Architect', status: 'pending', salary: '$120,000' },
    { id: '5', name: 'Jessica Taylor', email: 'jessica@dayflow.com', role: 'QA Automation Engineer', status: 'inactive', salary: '$88,000' },
  ];

  const columns = [
    {
      title: 'Employee',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} size="sm" status="online" />
          <div>
            <div className="font-semibold text-slate-900">{val}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    { title: 'Role', key: 'role' },
    { title: 'Salary', key: 'salary' },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="DayFlow Component Library & Design Tokens"
        subtitle="Centralized design system foundation built for enterprise SaaS scalability, accessibility, and precision."
        breadcrumbs={['DayFlow', 'Design System', 'UI Catalog']}
      />

      {/* 1. BUTTON VARIANTS & STATES */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          1. Button Component Variants & States
        </h2>

        <Card>
          <CardBody className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Variants</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Plus size={16} />}>Primary Button</Button>
                <Button variant="secondary" leftIcon={<Filter size={16} />}>Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive" leftIcon={<Trash2 size={16} />}>Destructive Button</Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Sizes</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">Small (32px)</Button>
                <Button size="md" variant="primary">Medium (40px)</Button>
                <Button size="lg" variant="primary">Large (48px)</Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">States (Loading & Disabled)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="secondary" disabled>Disabled State</Button>
                <Button variant="destructive" isLoading>Processing...</Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 2. FORM CONTROLS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          2. Form Controls & Input Fields
        </h2>

        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Standard Text Input"
              placeholder="Enter employee full name"
              helperText="This name will appear on official payslips."
            />

            <Input
              label="Input with Left Icon"
              placeholder="search@dayflow.com"
              leftIcon={<Mail size={18} />}
            />

            <Input
              label="Input with Error State"
              value="invalid-email-format"
              error="Please enter a valid work email address."
              required
            />

            <Select
              label="Select Department"
              options={[
                { value: 'eng', label: 'Engineering & Product' },
                { value: 'hr', label: 'People & HR' },
                { value: 'finance', label: 'Finance & Accounting' },
              ]}
              required
            />

            <Textarea
              label="Manager Approval Notes"
              placeholder="Provide comments regarding this leave request..."
              maxLength={200}
              value="Approved based on team coverage schedule."
            />

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Checkboxes & Radios</h4>
              <Checkbox label="Send email notification to employee" defaultChecked />
              <Checkbox label="Require two-factor authentication" sublabel="Enforce for admin actions" />

              <RadioGroup label="Employment Status Type">
                <Radio
                  name="empType"
                  value="option1"
                  label="Full Time Employee"
                  checked={radioValue === 'option1'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <Radio
                  name="empType"
                  value="option2"
                  label="Contractor / Consultant"
                  checked={radioValue === 'option2'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
              </RadioGroup>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 3. BADGES, STATUS & AVATARS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          3. Badges, Status Indicators & Avatars
        </h2>

        <Card>
          <CardBody className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Generic Badges</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">HRMS Status Badges (Dot & Semantic Color)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status="approved" />
                <StatusBadge status="pending" />
                <StatusBadge status="rejected" />
                <StatusBadge status="on_leave" />
                <StatusBadge status="present" />
                <StatusBadge status="absent" />
                <StatusBadge status="draft" />
                <StatusBadge status="paid" />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Avatar Sizes & Status</h4>
              <div className="flex items-center gap-4">
                <Avatar name="Sarah Jenkins" size="xs" />
                <Avatar name="Sarah Jenkins" size="sm" status="online" />
                <Avatar name="Sarah Jenkins" size="md" status="offline" />
                <Avatar name="Sarah Jenkins" size="lg" status="online" />
                <Avatar name="Sarah Jenkins" size="xl" />
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* 4. FEEDBACK & DIALOGS */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          4. Feedback, Toasts, Modals & Alerts
        </h2>

        <Card>
          <CardBody className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Toast Notification Triggers</h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => addToast({ title: 'Success Toast', message: 'Employee profile updated successfully.', type: 'success' })}
                >
                  Trigger Success Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast({ title: 'Warning Toast', message: 'Leave balance is low (2 days remaining).', type: 'warning' })}
                >
                  Trigger Warning Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast({ title: 'Error Toast', message: 'Failed to connect to payroll server.', type: 'error' })}
                >
                  Trigger Error Toast
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => addToast({ title: 'Info Toast', message: 'System maintenance scheduled at 11 PM UTC.', type: 'info' })}
                >
                  Trigger Info Toast
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Modals & Dialog Triggers</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open Standard Modal
                </Button>

                <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
                  Open Confirmation Dialog
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modal Example */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Department"
          subtitle="Add a new department structure into DayFlow"
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Save Department
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Department Name" placeholder="e.g. Talent Acquisition" />
            <Select
              label="Department Head"
              options={[
                { value: '1', label: 'Sarah Jenkins (HR Director)' },
                { value: '2', label: 'Alex Morgan (Senior Manager)' },
              ]}
            />
          </div>
        </Modal>

        {/* Confirmation Dialog Example */}
        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            addToast({ title: 'Record Deleted', message: 'Item deleted from system.', type: 'warning' });
          }}
          title="Terminate Employee Account?"
          message="Are you sure you want to revoke system access for this account? This action will be logged."
          confirmText="Yes, Terminate"
        />
      </section>

      {/* 5. DATA TABLES & PAGINATION */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
          5. Data Display Table & Pagination
        </h2>

        <Card>
          <CardHeader
            title="Workforce Records"
            subtitle="Accessible data grid with hover states and pagination"
            action={
              <Button variant="ghost" size="sm" onClick={() => setShowSkeleton((prev) => !prev)}>
                Toggle Skeleton Loader
              </Button>
            }
          />
          <Table columns={columns} data={sampleTableData} isLoading={showSkeleton} />
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            pageSize={pageSize}
            totalItems={15}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => setPageSize(size)}
          />
        </Card>
      </section>
    </div>
  );
};
