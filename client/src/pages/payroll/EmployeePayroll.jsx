import React, { useEffect, useState } from 'react';
import {
  FileText,
  DollarSign,
  Printer,
  Calendar,
  Building,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { SalarySlipModal } from '../../components/payroll/SalarySlipModal';

export const EmployeePayroll = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/employees/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch salary details.');
        }

        setProfile(data.profile);
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Error loading payroll details.');
      }
    };

    fetchMyProfile();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-300">
        <RefreshCw size={32} className="animate-spin mx-auto text-indigo-400 mb-3" />
        <p className="text-xs font-bold">Loading your payroll statement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const s = profile?.salaryStructure || {};
  const baseSalary = s.baseSalary || 100000;
  const housingAllowance = s.housingAllowance || 15000;
  const transportAllowance = s.transportAllowance || 5000;
  const bonus = s.bonus || 0;
  const deductions = s.deductions || 8000;

  const grossSalary = baseSalary + housingAllowance + transportAllowance + bonus;
  const netSalary = Math.max(0, grossSalary - deductions);

  const history = [
    { period: 'August 2026', gross: grossSalary, deductions: deductions, net: netSalary, status: 'Dispatched', date: 'Aug 01, 2026' },
    { period: 'July 2026', gross: grossSalary, deductions: deductions, net: netSalary, status: 'Dispatched', date: 'Jul 01, 2026' },
    { period: 'June 2026', gross: grossSalary, deductions: deductions, net: netSalary, status: 'Dispatched', date: 'Jun 01, 2026' },
  ];

  const payrollItemForModal = {
    name: profile?.name || user?.name,
    employeeId: profile?.employeeId || user?.employeeId,
    jobTitle: profile?.jobTitle || user?.jobTitle,
    department: profile?.department || user?.department,
    email: profile?.email || user?.email,
    salaryStructure: s,
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="My Salary & Compensation Statement"
        subtitle="Read-only breakdown of your monthly salary structure, allowances, tax deductions, and payslips."
        breadcrumbs={['DayFlow', 'Employee', 'Payroll & Slips']}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer size={16} />}
            onClick={() => setIsSlipModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            View / Print Payslip
          </Button>
        }
      />

      {/* TOP NET TAKE HOME BANNER */}
      <Card className="bg-slate-800 border border-slate-700 border-l-4 border-l-emerald-500">
        <CardBody className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">August 2026 Monthly Take-Home Pay</span>
            <div className="text-3xl font-black text-white font-mono mt-1">₹{netSalary.toLocaleString()}</div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Disbursed via {s.paymentMethod || 'Direct Bank Transfer'} • Account {s.bankAccount || '•••• •••• 8842'}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSlipModalOpen(true)}
            leftIcon={<Printer size={15} />}
            className="text-xs font-bold text-indigo-300"
          >
            Download Slip PDF
          </Button>
        </CardBody>
      </Card>

      {/* SALARY STRUCTURE BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings & Allowances */}
        <Card className="bg-slate-800 border border-emerald-500/30">
          <CardHeader
            title="Earnings & Allowances Structure"
            subtitle="Gross compensation components"
          />
          <CardBody className="p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">Basic Base Salary</span>
              <span className="font-mono font-bold text-white text-sm">₹{baseSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">House Rent Allowance (HRA)</span>
              <span className="font-mono font-bold text-white text-sm">₹{housingAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">Transport & Conveyance</span>
              <span className="font-mono font-bold text-white text-sm">₹{transportAllowance.toLocaleString()}</span>
            </div>
            {bonus > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
                <span className="text-emerald-300 font-bold">Performance Bonus</span>
                <span className="font-mono font-bold text-emerald-300 text-sm">₹{bonus.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 flex justify-between items-center font-extrabold text-sm text-white">
              <span>Total Gross Salary</span>
              <span className="font-mono text-emerald-400">₹{grossSalary.toLocaleString()}</span>
            </div>
          </CardBody>
        </Card>

        {/* Deductions & Net Take Home */}
        <Card className="bg-slate-800 border border-rose-500/30">
          <CardHeader
            title="Statutory Deductions & Net Salary"
            subtitle="TDS Tax & Provident Fund deductions"
          />
          <CardBody className="p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">Provident Fund (PF) Contribution</span>
              <span className="font-mono font-bold text-rose-300 text-sm">-₹{Math.round(deductions * 0.6).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">Income Tax (TDS Deduction)</span>
              <span className="font-mono font-bold text-rose-300 text-sm">-₹{Math.round(deductions * 0.4).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/80">
              <span className="text-slate-300 font-semibold">Total Deductions</span>
              <span className="font-mono font-bold text-rose-400 text-sm">-₹{deductions.toLocaleString()}</span>
            </div>
            <div className="pt-2 flex justify-between items-center font-black text-sm text-white">
              <span>Net Take-Home Pay</span>
              <span className="font-mono text-white text-base">₹{netSalary.toLocaleString()}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* SALARY HISTORY TABLE */}
      <Card className="bg-slate-800 border border-slate-700">
        <CardHeader title="Salary Payment History" subtitle="Disbursed payroll slips for previous months" />
        <CardBody className="p-4">
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800 text-slate-300 border-b border-slate-700 uppercase tracking-wider font-extrabold text-[11px]">
                  <th className="py-3.5 px-4">Pay Period</th>
                  <th className="py-3.5 px-4">Disbursement Date</th>
                  <th className="py-3.5 px-4">Gross Salary</th>
                  <th className="py-3.5 px-4">Deductions</th>
                  <th className="py-3.5 px-4">Net Payout</th>
                  <th className="py-3.5 px-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/70">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{h.period}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{h.date}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">₹{h.gross.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-400 font-bold">-₹{h.deductions.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-mono text-white font-black text-sm">₹{h.net.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setIsSlipModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* SALARY SLIP MODAL */}
      <SalarySlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        payrollItem={payrollItemForModal}
      />
    </div>
  );
};
