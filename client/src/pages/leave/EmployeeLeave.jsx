import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  MessageSquare,
  Info
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/feedback/Modal';
import { ConfirmationDialog } from '../../components/feedback/ConfirmationDialog';
import { useToast } from '../../components/feedback/ToastContext';
import API from '../../services/api';

export const EmployeeLeave = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [balances, setBalances] = useState({ paidAvailable: 18, paidTotal: 18, sickAvailable: 10, sickTotal: 10, unpaidTaken: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Leave Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    fromTime: '09:00',
    toTime: '18:00',
    reason: '',
  });

  // Cancel Request Confirmation Dialog State
  const [cancelTargetId, setCancelTargetId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch Leave Data
  const fetchLeaveData = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/leaves/my-requests');
      setRequests(res.data.requests || []);
      setBalances(res.data.balances || {});
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      addToast({ title: 'Error Loading Leaves', message: err.message, type: 'error' });
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // Handle Submit Leave Request
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.fromTime || !formData.toTime || !formData.reason.trim()) {
      addToast({ title: 'Validation Error', message: 'Please fill in all leave and time details.', type: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await API.post('/leaves/request', formData);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ leaveType: 'Paid', startDate: '', endDate: '', fromTime: '09:00', toTime: '18:00', reason: '' });
      addToast({ title: 'Request Submitted', message: res.data.message, type: 'success' });
      fetchLeaveData();
    } catch (err) {
      setIsSubmitting(false);
      addToast({ title: 'Submission Error', message: err.message, type: 'error' });
    }
  };

  // Handle Confirm Cancel Leave Request
  const handleConfirmCancel = async () => {
    if (!cancelTargetId) return;
    setIsCancelling(true);
    try {
      await API.delete(`/leaves/cancel/${cancelTargetId}`);
      setIsCancelling(false);
      setCancelTargetId(null);
      addToast({ title: 'Request Cancelled', message: 'Pending leave request cancelled.', type: 'info' });
      fetchLeaveData();
    } catch (err) {
      setIsCancelling(false);
      addToast({ title: 'Cancellation Error', message: err.message, type: 'error' });
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12} /> Approved</span>;
      case 'Pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={12} /> Pending Review</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200"><XCircle size={12} /> Rejected</span>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Leave & Time-Off Portal"
        subtitle="Submit time-off requests, check leave balances, and track approval status."
        breadcrumbs={['DayFlow', 'Employee', 'Leave']}
        action={
          <Button variant="primary" onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={16} />}>
            Request Leave
          </Button>
        }
      />

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Paid Leave Balance</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Annual</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                {balances.paidAvailable} <span className="text-sm font-normal text-slate-400">/ {balances.paidTotal} days available</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${(balances.paidAvailable / balances.paidTotal) * 100}%` }}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Sick Leave Balance</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Medical</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                {balances.sickAvailable} <span className="text-sm font-normal text-slate-400">/ {balances.sickTotal} days available</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${(balances.sickAvailable / balances.sickTotal) * 100}%` }}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Unpaid Leave Taken</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Loss of Pay</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 mb-1">
                {balances.unpaidTaken} <span className="text-sm font-normal text-slate-400">days taken</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">Non-accumulative unpaid time-off</p>
          </CardBody>
        </Card>
      </div>

      {/* Leave History List Card */}
      <Card>
        <CardHeader title="My Leave History & Approvals" subtitle="List of submitted leave applications with status tracking." />
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-10 bg-slate-100 rounded w-full animate-pulse" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Leave Requests Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                You have not submitted any time-off applications yet.
              </p>
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={16} />}>
                Create First Leave Request
              </Button>
            </div>
          ) : (
            <div className="df-table-container">
              <table className="df-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Date Range</th>
                    <th>Duration</th>
                    <th>Reason / Details</th>
                    <th>Status</th>
                    <th>HR / Admin Feedback</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td className="font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            r.leaveType === 'Paid' ? 'bg-indigo-600' : r.leaveType === 'Sick' ? 'bg-emerald-600' : 'bg-amber-600'
                          }`} />
                          {r.leaveType} Leave
                        </span>
                      </td>
                      <td className="text-xs text-slate-700 font-mono">
                        <div>{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</div>
                        <div className="text-[11px] font-mono text-indigo-700 font-bold mt-0.5">
                          {r.fromTime || '09:00'} to {r.toTime || '18:00'}
                        </div>
                      </td>
                      <td className="font-semibold text-slate-900 text-xs">
                        {r.daysCount} {r.daysCount === 1 ? 'Day' : 'Days'}
                      </td>
                      <td className="text-xs text-slate-600 max-w-xs truncate">{r.reason}</td>
                      <td>{renderStatusBadge(r.status)}</td>
                      <td className="text-xs text-slate-500">
                        {r.adminComment ? (
                          <span className="flex items-center gap-1 text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            <MessageSquare size={12} className="text-indigo-600 flex-shrink-0" /> {r.adminComment}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No notes</span>
                        )}
                      </td>
                      <td className="text-right">
                        {r.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => setCancelTargetId(r._id)}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded border border-red-200 font-semibold transition-colors border-0 cursor-pointer"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* CREATE LEAVE REQUEST MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Leave Request" size="md">
        <form onSubmit={handleSubmitLeave} className="space-y-4">
          <Select
            label="Leave Classification"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={[
              { value: 'Paid', label: 'Paid Leave (Annual / Casual)' },
              { value: 'Sick', label: 'Sick Leave (Medical Rest)' },
              { value: 'Unpaid', label: 'Unpaid Leave (Loss of Pay)' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="From Time"
              type="time"
              value={formData.fromTime}
              onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
              required
            />
            <Input
              label="To Time"
              type="time"
              value={formData.toTime}
              onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Reason for Absence"
            placeholder="Provide brief details regarding your time-off request..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={3}
            required
          />

          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
            <Info size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <p>
              Leave requests undergo mandatory approval by your reporting HR Manager. You will receive real-time notifications upon status update.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit for Approval
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM CANCELLATION DIALOG */}
      <ConfirmationDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Leave Request?"
        message="Are you sure you want to withdraw this pending leave request? This action cannot be undone."
        confirmText="Confirm Cancel"
        confirmVariant="destructive"
        isLoading={isCancelling}
      />
    </div>
  );
};
