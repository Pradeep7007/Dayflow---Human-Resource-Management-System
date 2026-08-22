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
  X,
  Eye,
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

  // Selected Detail Request for Bootstrap Modal View
  const [selectedDetailRequest, setSelectedDetailRequest] = useState(null);

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
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Employee Details</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Duration & Days</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 font-semibold">
                  {filteredRequests.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedDetailRequest(r)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.employeeName} size="sm" className="ring-2 ring-indigo-100 flex-shrink-0" />
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{r.employeeName}</div>
                            <div className="font-mono text-[11px] text-indigo-600 font-bold">{r.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{r.department || 'Operations'}</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={r.leaveType === 'Paid' ? 'primary' : r.leaveType === 'Sick' ? 'success' : 'warning'}
                          className="text-[11px] font-bold"
                        >
                          {r.leaveType} Leave
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-900 text-xs">
                          {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] font-mono text-indigo-700 font-bold mt-0.5">
                          {r.fromTime || '09:00'} to {r.toTime || '18:00'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-bold mt-0.5">
                          {r.daysCount} {r.daysCount === 1 ? 'Day' : 'Days'} Total
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{renderStatusBadge(r.status)}</td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedDetailRequest(r)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-all cursor-pointer"
                            title="View Leave Application Details"
                          >
                            <Eye size={14} />
                          </button>
                          {r.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => setReviewTarget({ id: r._id, action: 'Approved', name: r.employeeName })}
                                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer border-0"
                                title="Approve Leave"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReviewTarget({ id: r._id, action: 'Rejected', name: r.employeeName })}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all cursor-pointer"
                                title="Reject Leave"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* DETAILED LEAVE APPLICATION BOOTSTRAP-STYLE MODAL */}
      {selectedDetailRequest && (
        <Modal
          isOpen={!!selectedDetailRequest}
          onClose={() => setSelectedDetailRequest(null)}
          title="Leave Application Details"
          size="lg"
        >
          <div className="space-y-5 text-slate-900">
            {/* Header Profile Summary Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={selectedDetailRequest.employeeName} size="lg" className="ring-2 ring-indigo-300" />
                <div>
                  <h4 className="font-black text-base text-slate-900">{selectedDetailRequest.employeeName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mt-0.5">
                    <span className="font-mono text-indigo-700 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {selectedDetailRequest.employeeId}
                    </span>
                    <span>•</span>
                    <span>{selectedDetailRequest.department || 'Operations'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {renderStatusBadge(selectedDetailRequest.status)}
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Leave Classification</span>
                <span className="font-black text-slate-900 text-sm mt-0.5 block">{selectedDetailRequest.leaveType} Leave</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Duration Window</span>
                <span className="font-mono font-extrabold text-slate-900 text-xs mt-0.5 block">
                  {new Date(selectedDetailRequest.startDate).toLocaleDateString()} - {new Date(selectedDetailRequest.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Time Slot / Hours</span>
                <span className="font-mono font-extrabold text-indigo-700 text-xs mt-0.5 block">
                  {selectedDetailRequest.fromTime || '09:00'} to {selectedDetailRequest.toTime || '18:00'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Total Days</span>
                <span className="font-black text-indigo-700 text-sm mt-0.5 block">
                  {selectedDetailRequest.daysCount} {selectedDetailRequest.daysCount === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>

            {/* Reason / Justification Block */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Absence Justification & Reason
              </label>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed">
                "{selectedDetailRequest.reason}"
              </div>
            </div>

            {/* Reviewer Information / Notes */}
            {selectedDetailRequest.adminComment ? (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-indigo-900 uppercase tracking-wider">
                  Reviewer Notes & Action Log
                </label>
                <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950 font-semibold leading-relaxed">
                  <p><strong>Note:</strong> {selectedDetailRequest.adminComment}</p>
                  <p className="text-[11px] text-indigo-700 mt-1">
                    Reviewed by: <strong>{selectedDetailRequest.reviewedBy || 'HR Manager'}</strong>
                  </p>
                </div>
              </div>
            ) : null}

            {/* Footer Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="secondary"
                onClick={() => setSelectedDetailRequest(null)}
              >
                Close Modal
              </Button>

              {selectedDetailRequest.status === 'Pending' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const req = selectedDetailRequest;
                      setSelectedDetailRequest(null);
                      setReviewTarget({ id: req._id, action: 'Rejected', name: req.employeeName });
                    }}
                    leftIcon={<X size={16} />}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    onClick={() => {
                      const req = selectedDetailRequest;
                      setSelectedDetailRequest(null);
                      setReviewTarget({ id: req._id, action: 'Approved', name: req.employeeName });
                    }}
                    leftIcon={<Check size={16} />}
                  >
                    Approve Application
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

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
