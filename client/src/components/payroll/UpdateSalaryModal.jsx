import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Building, Shield, CheckCircle2 } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../feedback/ToastContext';

export const UpdateSalaryModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    baseSalary: 100000,
    housingAllowance: 15000,
    transportAllowance: 5000,
    bonus: 0,
    deductions: 8000,
    paymentMethod: 'Direct Bank Transfer',
    bankAccount: '•••• •••• •••• 8842 (Chase Bank)',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee && employee.salaryStructure) {
      const s = employee.salaryStructure;
      setFormData({
        baseSalary: s.baseSalary || 100000,
        housingAllowance: s.housingAllowance || 15000,
        transportAllowance: s.transportAllowance || 5000,
        bonus: s.bonus || 0,
        deductions: s.deductions || 8000,
        paymentMethod: s.paymentMethod || 'Direct Bank Transfer',
        bankAccount: s.bankAccount || '•••• •••• •••• 8842 (Chase Bank)',
      });
      setError('');
    }
  }, [employee]);

  const grossSalary =
    Number(formData.baseSalary) +
    Number(formData.housingAllowance) +
    Number(formData.transportAllowance) +
    Number(formData.bonus);

  const netSalary = Math.max(0, grossSalary - Number(formData.deductions));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const empId = employee.id || employee._id;
      const res = await fetch(`http://localhost:5000/api/employees/${empId}/salary`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update salary structure.');
      }

      addToast({
        title: 'Salary Structure Updated',
        message: `Updated compensation for ${employee.name}. Net: ₹${netSalary.toLocaleString()}`,
        type: 'success',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Error updating salary.';
      setError(msg);
      addToast({ title: 'Update Failed', message: msg, type: 'error' });
    }
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Salary Structure — ${employee.name}`}
      subtitle={`Employee ID: ${employee.employeeId} • ${employee.department}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Live Calculation Preview Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-slate-700 font-bold block text-[10px] uppercase">Gross Earnings</span>
            <span className="font-mono font-black text-indigo-700 text-sm">₹{grossSalary.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-700 font-bold block text-[10px] uppercase">Deductions</span>
            <span className="font-mono font-black text-rose-700 text-sm">₹{Number(formData.deductions).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-indigo-900 font-bold block text-[10px] uppercase">Net Take-Home</span>
            <span className="font-mono font-black text-emerald-700 text-sm">₹{netSalary.toLocaleString()}</span>
          </div>
        </div>

        {/* Base Salary & HRA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Basic Base Salary (₹/yr)</label>
            <input
              type="number"
              value={formData.baseSalary}
              onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">House Rent Allowance (HRA)</label>
            <input
              type="number"
              value={formData.housingAllowance}
              onChange={(e) => setFormData({ ...formData, housingAllowance: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Transport & Bonus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Transport & Conveyance</label>
            <input
              type="number"
              value={formData.transportAllowance}
              onChange={(e) => setFormData({ ...formData, transportAllowance: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Performance Bonus</label>
            <input
              type="number"
              value={formData.bonus}
              onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Deductions & Bank Account */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Statutory Deductions (PF/Tax)</label>
            <input
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1">Payment Disbursement Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              <option value="Direct Bank Transfer">Direct Bank Transfer</option>
              <option value="NEFT / RTGS">NEFT / RTGS</option>
              <option value="Corporate Check">Corporate Check</option>
            </select>
          </div>
        </div>

        {/* Bank Account */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">Disbursement Bank Account Detail</label>
          <input
            type="text"
            value={formData.bankAccount}
            onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <Button variant="ghost" type="button" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            size="sm"
            isLoading={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            leftIcon={<CheckCircle2 size={16} />}
          >
            Save Salary Structure
          </Button>
        </div>
      </form>
    </Modal>
  );
};
