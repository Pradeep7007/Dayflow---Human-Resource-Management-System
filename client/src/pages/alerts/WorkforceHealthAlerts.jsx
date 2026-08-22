import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  User,
  Calendar,
  Eye,
  Trash2,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/feedback/Modal';
import { useToast } from '../../components/feedback/ToastContext';

export const WorkforceHealthAlerts = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Selected Alert for Details Modal
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/dashboard/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setLoading(false);

      if (res.ok && json.success) {
        setAlerts(json.alerts || []);
      } else {
        setAlerts(getFallbackAlerts());
      }
    } catch (err) {
      setLoading(false);
      setAlerts(getFallbackAlerts());
    }
  };

  const getFallbackAlerts = () => [
    {
      id: 'alt-101',
      severity: 'critical',
      category: 'Attendance',
      title: 'Repeated Late Check-Ins Flagged',
      explanation: '3 employees in Engineering have logged late arrivals (>45 mins) more than twice this week.',
      date: new Date().toISOString().split('T')[0],
      relatedEmployee: 'Vikram Seth (Operations)',
      recommendedAction: 'Schedule shift alignment discussion or review attendance logs.',
      actionRoute: '/admin/attendance',
    },
    {
      id: 'alt-102',
      severity: 'critical',
      category: 'Workflow',
      title: '3 Unresolved Pending Approvals',
      explanation: 'Leave requests submitted over 48 hours ago are still awaiting administrative sign-off.',
      date: new Date().toISOString().split('T')[0],
      relatedEmployee: 'Tharun R & 2 others',
      recommendedAction: 'Batch review and approve or reject pending leave requests.',
      actionRoute: '/admin/leaves',
    },
    {
      id: 'alt-103',
      severity: 'warning',
      category: 'Documents',
      title: 'Tax Compliance & Verification Forms Expiring',
      explanation: 'Form 16 / Tax declaration documents for 2 team members require annual verification.',
      date: new Date().toISOString().split('T')[0],
      relatedEmployee: 'Ananya Sharma (HR)',
      recommendedAction: 'Request document resubmission in employee profile portal.',
      actionRoute: '/admin/employees',
    },
    {
      id: 'alt-104',
      severity: 'warning',
      category: 'Attendance',
      title: 'Unresolved Missing Check-Out Logs',
      explanation: '1 employee checked in on Friday but no check-out event was recorded before midnight.',
      date: new Date().toISOString().split('T')[0],
      relatedEmployee: 'Kishore M (QA)',
      recommendedAction: 'Verify shift duration and manual check-out time.',
      actionRoute: '/admin/attendance',
    },
    {
      id: 'alt-105',
      severity: 'informational',
      category: 'Leave',
      title: 'High Leave Concentration Ahead of Long Weekend',
      explanation: '4 team members in Operations have requested paid time off for the upcoming Friday.',
      date: new Date().toISOString().split('T')[0],
      relatedEmployee: 'Operations Team',
      recommendedAction: 'Ensure minimum shift coverage before approving additional requests.',
      actionRoute: '/admin/leaves',
    },
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolveAlert = (alertId, title) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    if (selectedAlert?.id === alertId) setSelectedAlert(null);
    addToast({
      title: 'HR Risk Resolved',
      message: `Alert "${title}" marked as resolved.`,
      type: 'success',
    });
  };

  const handleDismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    if (selectedAlert?.id === alertId) setSelectedAlert(null);
    addToast({
      title: 'Alert Dismissed',
      message: 'Alert dismissed from risk center queue.',
      type: 'info',
    });
  };

  const filteredAlerts = alerts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.explanation.toLowerCase().includes(search.toLowerCase()) ||
      (item.relatedEmployee && item.relatedEmployee.toLowerCase().includes(search.toLowerCase()));

    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const infoCount = alerts.filter((a) => a.severity === 'informational').length;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Workforce Health & Risk Alerts"
        subtitle="Rule-based HR operational monitoring center for attendance anomalies, leave concentration, document expiry, and workflow bottlenecks."
        breadcrumbs={['DayFlow', 'Admin', 'Risk Alerts']}
        action={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={fetchAlerts}
            className="text-xs font-bold text-slate-100"
          >
            Re-scan Rule Engine
          </Button>
        }
      />

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Total Open Risks</span>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">{alerts.length}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Active operational flags</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-rose-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Critical Risks</span>
            <div className="text-3xl font-black text-rose-700 font-mono mt-1">{criticalCount}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Immediate intervention required</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-amber-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Warning Alerts</span>
            <div className="text-3xl font-black text-amber-700 font-mono mt-1">{warningCount}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Requires HR follow-up</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-indigo-600 shadow-sm">
          <CardBody className="p-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">Informational</span>
            <div className="text-3xl font-black text-indigo-700 font-mono mt-1">{infoCount}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">System guidance flags</p>
          </CardBody>
        </Card>
      </div>

      {/* FILTER CONTROLS BAR */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts, rules, or employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>

            {/* Severity Tabs */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setSeverityFilter('warning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === 'warning' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Warning ({warningCount})
              </button>
              <button
                onClick={() => setSeverityFilter('informational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === 'informational' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                Info ({infoCount})
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
              >
                <option value="all">All Categories</option>
                <option value="attendance">Attendance Rules</option>
                <option value="leave">Leave Rules</option>
                <option value="documents">Document Expiry</option>
                <option value="workflow">Workflow Approvals</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ALERT LIST OR EMPTY STATE */}
      {loading ? (
        <div className="py-16 text-center text-slate-700">
          <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
          <p className="text-xs font-bold">Scanning HR operational dataset for risks...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card className="bg-white border border-slate-200 py-16 text-center shadow-sm">
          <CardBody className="space-y-3">
            <CheckCircle2 size={48} className="text-emerald-600 mx-auto" />
            <h3 className="text-base font-black text-slate-900">No HR risks or actions require your attention.</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
              All attendance logs, leave request queues, compliance documents, and administrative workflows are operating smoothly.
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((item) => {
            const isCritical = item.severity === 'critical';
            const isWarning = item.severity === 'warning';

            return (
              <Card
                key={item.id}
                className={`bg-white border transition-all shadow-sm ${
                  isCritical
                    ? 'border-rose-500/40 border-l-4 border-l-rose-600'
                    : isWarning
                    ? 'border-amber-500/40 border-l-4 border-l-amber-600'
                    : 'border-indigo-500/40 border-l-4 border-l-indigo-600'
                }`}
              >
                <CardBody className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {isCritical ? (
                        <ShieldAlert size={20} className="text-rose-600 flex-shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                      ) : (
                        <Info size={20} className="text-indigo-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-black uppercase text-slate-700">
                            {item.category} Rule
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">• {item.date}</span>
                        </div>
                        <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Badge
                        variant={isCritical ? 'danger' : isWarning ? 'warning' : 'info'}
                        className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5"
                      >
                        {item.severity}
                      </Badge>
                      {item.relatedEmployee && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                          {item.relatedEmployee}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Explanation Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-800 font-semibold">{item.explanation}</p>
                    <div className="text-slate-700 font-semibold pt-1 border-t border-slate-200 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-600" />
                      <strong className="text-indigo-900 font-black">Recommended Action:</strong> {item.recommendedAction}
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedAlert(item)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={14} /> View Rule Details
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissAlert(item.id)}
                        className="bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 text-xs font-bold px-3 py-1"
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResolveAlert(item.id, item.title)}
                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold px-3 py-1"
                      >
                        Mark Resolved
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(item.actionRoute)}
                        leftIcon={<ArrowRight size={14} />}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1"
                      >
                        Review Module
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* ALERT DETAILS MODAL */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`HR Risk Alert — ${selectedAlert.title}`}
          subtitle={`Category: ${selectedAlert.category} • Severity: ${selectedAlert.severity.toUpperCase()}`}
          size="md"
        >
          <div className="space-y-4 pt-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Rule Category:</span>
                <span className="font-mono text-slate-900 font-black">{selectedAlert.category}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Severity Assessment:</span>
                <span className="capitalize font-black text-rose-700">{selectedAlert.severity}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Date Logged:</span>
                <span className="font-mono text-slate-900 font-black">{selectedAlert.date}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-bold">
                <span>Affected Employee/Team:</span>
                <span className="font-black text-indigo-700">{selectedAlert.relatedEmployee || 'Organization-wide'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-900 font-black uppercase text-[10px] block">Operational Context</span>
              <p className="text-slate-800 font-semibold">{selectedAlert.explanation}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
              <span className="text-indigo-900 font-black uppercase text-[10px] block">Suggested Governance Step</span>
              <p className="text-indigo-950 font-black">{selectedAlert.recommendedAction}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  navigate(selectedAlert.actionRoute);
                  setSelectedAlert(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Go to Module Workspace
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
