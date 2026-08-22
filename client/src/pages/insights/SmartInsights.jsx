import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  CalendarCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  Zap,
  Filter,
  FileText
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/feedback/ToastContext';

export const SmartInsights = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState({
    summary: { totalInsights: 5, criticalAlerts: 2, averageAttendanceRate: 91 },
    insights: [],
    departmentAvailability: [],
  });

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/dashboard/insights', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate HR insights.');
      }

      setData(json);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Error connecting to analytical engine.');
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredInsights = data.insights.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'attendance') return item.category.includes('Attendance') || item.category.includes('Punctuality');
    if (activeTab === 'leave') return item.category.includes('Leave');
    if (activeTab === 'payroll') return item.category.includes('Payroll');
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* PAGE HEADER */}
      <PageHeader
        title="DayFlow Smart Insights"
        subtitle="Data-driven analytical observations and actionable workforce recommendations."
        breadcrumbs={['DayFlow', 'Admin', 'Smart Insights']}
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-600 animate-pulse" /> Statistical Engine Active
            </span>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={fetchInsights}
              className="text-xs"
            >
              Re-calculate
            </Button>
          </div>
        }
      />

      {/* TOP ANALYTICAL KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border border-slate-200 border-l-4 border-l-cyan-600 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Discovered Insights</span>
              <div className="p-2 rounded-lg bg-cyan-50 text-cyan-700">
                <Zap size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-mono mt-1">{data.summary.totalInsights}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Computed across attendance, leave & payroll</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-amber-600 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Action Items</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-700 font-mono mt-1">{data.summary.criticalAlerts}</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">High priority HR interventions recommended</p>
          </CardBody>
        </Card>

        <Card className="bg-white border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Workforce Bandwidth</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-mono mt-1">{data.summary.averageAttendanceRate}%</div>
            <p className="text-xs text-slate-700 mt-1 font-semibold">Average 30-day shift attendance rate</p>
          </CardBody>
        </Card>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          All Observations ({data.insights.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          Attendance Patterns
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'leave'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          Leave Concentration
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === 'payroll'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          Payroll & Audit
        </button>
      </div>

      {/* INSIGHT CARDS GRID */}
      {loading ? (
        <div className="py-16 text-center text-slate-700">
          <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
          <p className="text-xs font-bold">Analyzing workforce dataset...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Insights List */}
          <div className="lg:col-span-8 space-y-4">
            {filteredInsights.map((ins) => (
              <Card
                key={ins.id}
                className={`bg-white border transition-all shadow-sm ${
                  ins.severity === 'alert'
                    ? 'border-red-500/50 border-l-4 border-l-red-600'
                    : ins.severity === 'warning'
                    ? 'border-amber-500/50 border-l-4 border-l-amber-600'
                    : 'border-indigo-500/40 border-l-4 border-l-indigo-600'
                }`}
              >
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-black text-indigo-700 uppercase tracking-wider">
                        {ins.category}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        {ins.title}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        ins.severity === 'alert'
                          ? 'danger'
                          : ins.severity === 'warning'
                          ? 'warning'
                          : 'info'
                      }
                      className="text-[10px] font-mono font-bold px-2 py-0.5"
                    >
                      {ins.metric}
                    </Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="text-slate-800 font-semibold">
                      <strong className="text-slate-900 font-black">Data Observation:</strong> {ins.observation}
                    </div>
                    <div className="text-slate-700 font-semibold">
                      <strong className="text-indigo-900 font-black">Potential Impact:</strong> {ins.impact}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-600 font-semibold">
                      DayFlow Smart HR Analysis
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(ins.actionRoute)}
                      rightIcon={<ArrowRight size={14} />}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                    >
                      {ins.actionText}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Department Availability Side Analytics */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader
                title="Departmental Availability Rate"
                subtitle="Live 30-day shift participation by team"
              />
              <CardBody className="p-4 space-y-4">
                {data.departmentAvailability.map((dept, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-slate-900">{dept.department}</span>
                      <span className="text-emerald-700 font-mono font-black">{dept.rate}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
                      <span>Present: {dept.present}</span>
                      <span>Total: {dept.total} members</span>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
