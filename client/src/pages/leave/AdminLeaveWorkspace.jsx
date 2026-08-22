import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  User,
  Calendar,
  AlertTriangle,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/feedback/Modal';
import { ConfirmationDialog } from '../../components/feedback/ConfirmationDialog';
import { useToast } from '../../components/feedback/ToastContext';
import API from '../../services/api';

export const AdminLeaveWorkspace = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Active Tab Pipeline
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected' | 'ALL'

  // Filters
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Review Action Confirmation Modal State
  const [reviewTarget, setReviewTarget] = useState(null); // { id, action: 'Approved' | 'Rejected', name }
  const [adminComment, setAdminComment] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // Fetch Leave Requests
  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      let params = [];
      if (activeTab !== 'ALL') params.push(`status=${activeTab}`);
      if (leaveTypeFilter !== 'ALL') params.push(`leaveType=${leaveTypeFilter}`);

      const queryString = params.length > 0 ? `?${params.join('&')}` : '';
      const res = await API.get(`/leaves/all${queryString}`);

      setRequests(res.data.requests || []);
      setCounts(res.data.counts || { pending: 0, approved: 0, rejected: 0 });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      addToast({ title: 'Error Loading Workspace', message: err.message, type: 'error' });
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [activeTab, leaveTypeFilter]);

  // Handle Review Action (Approve / Reject)
  const handleConfirmReview = async () => {
    if (!reviewTarget) return;

    setIsReviewing(true);
    try {
      const res = await API.put(`/leaves/review/${reviewTarget.id}`, {
        action: reviewTarget.action,
        adminComment,
      });

      setIsReviewing(false);
      setReviewTarget(null);
      setAdminComment('');

      addToast({
        title: `Leave ${reviewTarget.action}`,
        message: res.data.message,
        type: reviewTarget.action === 'Approved' ? 'success' : 'info',
      });

      fetchLeaves();
    } catch (err) {
      setIsReviewing(false);
      addToast({ title: 'Review Failed', message: err.message, type: 'error' });
    }
  };

  // Client Filter by Search Query
  const filteredRequests = requests.filter((r) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(term) ||
      r.employeeId.toLowerCase().includes(term) ||
      r.department.toLowerCase().includes(term) ||
      r.reason.toLowerCase().includes(term)
    );
  });

  // Status Badge Helper
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
        title="Leave & Time-Off Approval Workspace"
        subtitle="Manage employee leave requests, review absence justifications, and govern company time-off policies."
        breadcrumbs={['DayFlow', 'Admin', 'Leave Workspace']}
      />

      {/* Pipeline Navigation Tabs & Metrics */}
      <div className="flex bg-slate-200/70 p-1.5 rounded-xl gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('Pending')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'Pending'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Clock size={16} /> Pending Requests ({counts.pending || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Approved')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'Approved'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <CheckCircle2 size={16} /> Approved ({counts.approved || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Rejected')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'Rejected'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <XCircle size={16} /> Rejected ({counts.rejected || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'ALL'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          All Applications
        </button>
      </div>

      {/* Main Workspace Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'ALL' ? 'All Employee Leave Applications' : `${activeTab} Leave Queue`}
              </h3>
              <p className="text-xs text-slate-500">Review request justification, duration, and execute governance actions.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employee, ID, reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer focus:outline-none"
              >
                <option value="ALL">All Leave Types</option>
                <option value="Paid">Paid Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </select>

              <button
                type="button"
                onClick={fetchLeaves}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Refresh Workspace"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <div className="h-12 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-12 bg-slate-100 rounded w-full animate-pulse" />
              <div className="h-12 bg-slate-100 rounded w-full animate-pulse" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FileCheck size={24} />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Leave Applications in Queue</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No leave requests match the selected status tab or search filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRequests.map((r) => (
                <div
                  key={r._id}
                  className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Employee Meta & Request Info */}
                  <div className="flex items-start gap-4">
                    <Avatar name={r.employeeName} size="md" className="ring-2 ring-indigo-100 flex-shrink-0" />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{r.employeeName}</h4>
                        <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {r.employeeId}
                        </span>
                        <span className="text-xs text-slate-500">• {r.department}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              r.leaveType === 'Paid' ? 'bg-indigo-600' : r.leaveType === 'Sick' ? 'bg-emerald-600' : 'bg-amber-600'
                            }`}
                          />
                          {r.leaveType} Leave ({r.daysCount} {r.daysCount === 1 ? 'Day' : 'Days'})
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                        </span>
                        {renderStatusBadge(r.status)}
                      </div>

                      <p className="text-xs text-slate-600 pt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-800">Reason:</strong> "{r.reason}"
                      </p>

                      {r.adminComment && (
                        <p className="text-xs text-indigo-700 pt-0.5">
                          <strong className="text-indigo-900">Reviewer Note:</strong> {r.adminComment} ({r.reviewedBy})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Approval Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                    {r.status === 'Pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setReviewTarget({ id: r._id, action: 'Rejected', name: r.employeeName })}
                          className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <X size={16} /> Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewTarget({ id: r._id, action: 'Approved', name: r.employeeName })}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-0"
                        >
                          <Check size={16} /> Approve
                        </button>
                      </>
                    ) : (
                      <div className="text-right text-xs text-slate-400">
                        Reviewed by <span className="font-semibold text-slate-700">{r.reviewedBy || 'HR Admin'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* CONFIRMATION & REVIEW MODAL */}
      {reviewTarget && (
        <Modal
          isOpen={!!reviewTarget}
          onClose={() => setReviewTarget(null)}
          title={`Confirm Leave ${reviewTarget.action}`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to <strong>{reviewTarget.action.toLowerCase()}</strong> the leave application for{' '}
              <strong className="text-slate-900">{reviewTarget.name}</strong>?
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approval / Rejection Comment (Optional)
              </label>
              <textarea
                placeholder="Add optional notes for the employee..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setReviewTarget(null)}>
                Cancel
              </Button>
              <Button
                variant={reviewTarget.action === 'Approved' ? 'primary' : 'destructive'}
                onClick={handleConfirmReview}
                isLoading={isReviewing}
              >
                Confirm {reviewTarget.action}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
