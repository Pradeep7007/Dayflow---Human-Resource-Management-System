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
            <span className="text-xs font-mono font-bold text-indigo-300 bg-slate-800 border border-indigo-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" /> Statistical Engine Active
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
        <Card className="bg-slate-800 border border-slate-700 border-l-4 border-l-cyan-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Discovered Insights</span>
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Zap size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-1">{data.summary.totalInsights}</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Computed across attendance, leave & payroll</p>
          </CardBody>
        </Card>

        <Card className="bg-slate-800 border border-slate-700 border-l-4 border-l-amber-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Action Items</span>
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-300 mt-1">{data.summary.criticalAlerts}</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">High priority HR interventions recommended</p>
          </CardBody>
        </Card>

        <Card className="bg-slate-800 border border-slate-700 border-l-4 border-l-emerald-500">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Workforce Bandwidth</span>
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                <TrendingUp size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-1">{data.summary.averageAttendanceRate}%</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Average 30-day shift attendance rate</p>
          </CardBody>
        </Card>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All Observations ({data.insights.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Attendance Patterns
        </button>
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'leave'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Leave Concentration
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payroll'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Payroll & Audit
        </button>
      </div>

      {/* INSIGHT CARDS GRID */}
      {loading ? (
        <div className="py-16 text-center text-slate-300">
          <RefreshCw size={32} className="animate-spin mx-auto text-indigo-400 mb-3" />
          <p className="text-xs font-bold">Analyzing workforce dataset...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Insights List */}
          <div className="lg:col-span-8 space-y-4">
            {filteredInsights.map((ins) => (
              <Card
                key={ins.id}
                className={`bg-slate-800 border transition-all ${
                  ins.severity === 'alert'
                    ? 'border-red-500/50 border-l-4 border-l-red-500'
                    : ins.severity === 'warning'
                    ? 'border-amber-500/50 border-l-4 border-l-amber-500'
                    : 'border-indigo-500/40 border-l-4 border-l-indigo-500'
                }`}
              >
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
                        {ins.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
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

                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1.5">
                    <div className="text-slate-200 font-medium">
                      <strong className="text-white">Data Observation:</strong> {ins.observation}
                    </div>
                    <div className="text-slate-300 font-medium">
                      <strong className="text-indigo-300">Potential Impact:</strong> {ins.impact}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-300 font-medium">
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
            <Card className="bg-slate-800 border border-slate-700">
              <CardHeader
                title="Departmental Availability Rate"
                subtitle="Live 30-day shift participation by team"
              />
              <CardBody className="p-4 space-y-4">
                {data.departmentAvailability.map((dept, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{dept.department}</span>
                      <span className="text-emerald-400 font-mono">{dept.rate}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-300 font-medium">
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
