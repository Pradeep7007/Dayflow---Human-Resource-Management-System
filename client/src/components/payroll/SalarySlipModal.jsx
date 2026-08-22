import React from 'react';
import { Printer, Download, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';

export const SalarySlipModal = ({ isOpen, onClose, payrollItem }) => {
  if (!payrollItem) return null;

  const { name, employeeId, jobTitle, department, email, salaryStructure } = payrollItem;
  const s = salaryStructure || {};
  const baseSalary = s.baseSalary || 100000;
  const housingAllowance = s.housingAllowance || 15000;
  const transportAllowance = s.transportAllowance || 5000;
  const bonus = s.bonus || 0;
  const deductions = s.deductions || 8000;

  const grossSalary = baseSalary + housingAllowance + transportAllowance + bonus;
  const netSalary = Math.max(0, grossSalary - deductions);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Salary Slip — ${name}`}
      subtitle={`Pay Period: August 2026 • Employee ID: ${employeeId}`}
      size="md"
    >
      <div id="salary-slip-printable" className="space-y-4 pt-1">
        {/* Company Header */}
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              <Building2 size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">DayFlow HRMS Inc.</h3>
              <p className="text-xs text-slate-300 font-medium">Corporate Headquarters • Bengaluru HQ Campus</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
              Verified Payslip
            </span>
            <p className="text-[11px] text-slate-300 font-mono mt-1">Ref: PAY-2026-08-492</p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-300 font-semibold block text-[11px]">Employee Name</span>
            <span className="font-bold text-white text-xs">{name}</span>
          </div>
          <div>
            <span className="text-slate-300 font-semibold block text-[11px]">Employee ID</span>
            <span className="font-mono font-bold text-indigo-300 text-xs">{employeeId}</span>
          </div>
          <div>
            <span className="text-slate-300 font-semibold block text-[11px]">Department</span>
            <span className="font-bold text-white text-xs">{department || 'Engineering'}</span>
          </div>
          <div>
            <span className="text-slate-300 font-semibold block text-[11px]">Designation</span>
            <span className="font-bold text-white text-xs">{jobTitle || 'Software Engineer'}</span>
          </div>
        </div>

        {/* Earnings vs Deductions Comparison Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Earnings Column */}
          <div className="p-3.5 rounded-xl bg-slate-800 border border-emerald-500/30 space-y-2">
            <h4 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider border-b border-slate-700 pb-1.5 flex items-center justify-between">
              <span>Earnings & Allowances</span>
              <span>Amount (INR)</span>
            </h4>
            <div className="space-y-1.5 text-slate-200">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-mono font-bold text-white">₹{baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold text-white">₹{housingAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Conveyance</span>
                <span className="font-mono font-bold text-white">₹{transportAllowance.toLocaleString()}</span>
              </div>
              {bonus > 0 && (
                <div className="flex justify-between text-emerald-300 font-semibold">
                  <span>Performance Bonus</span>
                  <span className="font-mono font-bold">₹{bonus.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-slate-700 flex justify-between font-extrabold text-white text-xs">
              <span>Gross Salary</span>
              <span className="font-mono text-emerald-400">₹{grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="p-3.5 rounded-xl bg-slate-800 border border-rose-500/30 space-y-2">
            <h4 className="font-extrabold text-xs text-rose-400 uppercase tracking-wider border-b border-slate-700 pb-1.5 flex items-center justify-between">
              <span>Statutory Deductions</span>
              <span>Amount (INR)</span>
            </h4>
            <div className="space-y-1.5 text-slate-200">
              <div className="flex justify-between">
                <span>Provident Fund (PF) Contribution</span>
                <span className="font-mono font-bold text-white">₹{Math.round(deductions * 0.6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax (TDS Deduction)</span>
                <span className="font-mono font-bold text-white">₹{Math.round(deductions * 0.4).toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-700 flex justify-between font-extrabold text-white text-xs">
              <span>Total Deductions</span>
              <span className="font-mono text-rose-400">₹{deductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Card */}
        <div className="p-4 rounded-xl bg-slate-800 border border-indigo-500/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">Net Take-Home Salary</span>
            <p className="text-[11px] text-slate-300">Paid via {s.paymentMethod || 'Direct Bank Transfer'}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white font-mono">₹{netSalary.toLocaleString()}</div>
            <span className="text-[10px] text-slate-300 font-mono">Account: {s.bankAccount || '•••• •••• 8842'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer size={15} />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Print / Save PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
