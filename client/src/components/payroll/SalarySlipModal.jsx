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
      <div id="salary-slip-printable" className="space-y-4 pt-1 text-slate-900">
        {/* Company Header */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              <Building2 size={22} />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">DayFlow HRMS Inc.</h3>
              <p className="text-xs text-slate-600 font-semibold">Corporate Headquarters • Bengaluru HQ Campus</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-extrabold">
              Verified Payslip
            </span>
            <p className="text-[11px] text-slate-500 font-mono font-bold mt-1">Ref: PAY-2026-08-492</p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-500 font-bold block text-[11px]">Employee Name</span>
            <span className="font-extrabold text-slate-900 text-xs">{name}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block text-[11px]">Employee ID</span>
            <span className="font-mono font-bold text-indigo-600 text-xs">{employeeId}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block text-[11px]">Department</span>
            <span className="font-extrabold text-slate-900 text-xs">{department || 'Engineering'}</span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block text-[11px]">Designation</span>
            <span className="font-extrabold text-slate-900 text-xs">{jobTitle || 'Software Engineer'}</span>
          </div>
        </div>

        {/* Earnings vs Deductions Comparison Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Earnings Column */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-emerald-200 space-y-2">
            <h4 className="font-black text-xs text-emerald-800 uppercase tracking-wider border-b border-emerald-200 pb-1.5 flex items-center justify-between">
              <span>Earnings & Allowances</span>
              <span>Amount (INR)</span>
            </h4>
            <div className="space-y-1.5 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-mono font-bold text-slate-900">₹{baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-mono font-bold text-slate-900">₹{housingAllowance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Conveyance</span>
                <span className="font-mono font-bold text-slate-900">₹{transportAllowance.toLocaleString()}</span>
              </div>
              {bonus > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Performance Bonus</span>
                  <span className="font-mono font-bold">₹{bonus.toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-emerald-200 flex justify-between font-black text-slate-900 text-xs">
              <span>Gross Salary</span>
              <span className="font-mono text-indigo-700">₹{grossSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-rose-200 space-y-2">
            <h4 className="font-black text-xs text-rose-800 uppercase tracking-wider border-b border-rose-200 pb-1.5 flex items-center justify-between">
              <span>Statutory Deductions</span>
              <span>Amount (INR)</span>
            </h4>
            <div className="space-y-1.5 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span>Provident Fund (PF)</span>
                <span className="font-mono font-bold text-slate-900">₹{Math.round(deductions * 0.6).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Income Tax (TDS)</span>
                <span className="font-mono font-bold text-slate-900">₹{Math.round(deductions * 0.4).toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-rose-200 flex justify-between font-black text-slate-900 text-xs">
              <span>Total Deductions</span>
              <span className="font-mono text-rose-700">₹{deductions.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Card */}
        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">Net Take-Home Salary</span>
            <p className="text-[11px] text-slate-600 font-medium">Paid via {s.paymentMethod || 'Direct Bank Transfer'}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-900 font-mono">₹{netSalary.toLocaleString()}</div>
            <span className="text-[10px] text-slate-600 font-mono font-bold">Account: {s.bankAccount || '•••• •••• 8842'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
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
