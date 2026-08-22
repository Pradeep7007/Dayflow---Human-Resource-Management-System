import React, { useState } from 'react';
import { User, Mail, Shield, CreditCard, Briefcase, MapPin, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../feedback/ToastContext';

export const CreateEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    phone: '',
    workLocation: 'Bengaluru HQ Campus',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const generateAutoId = () => {
    const prefix = formData.role === 'admin' ? 'ADM' : formData.role === 'hr' ? 'HR' : 'EMP';
    const num = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, employeeId: `${prefix}-${num}` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Work email is required';
    if (!formData.password) newErrors.password = 'Initial password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account.');
      }

      addToast({
        title: 'Account Created',
        message: data.message || `Successfully created ${formData.role.toUpperCase()} account for ${formData.name}!`,
        type: 'success',
      });

      if (onSuccess) onSuccess(data.employee);
      onClose();
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Error creating account.';
      setErrors({ server: msg });
      addToast({ title: 'Creation Failed', message: msg, type: 'error' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Workforce Account"
      subtitle="Directly provision an Employee, HR Manager, or Admin account"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errors.server && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {errors.server}
          </div>
        )}

        {/* Row 1: Employee ID & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Employee ID</label>
              <button
                type="button"
                onClick={generateAutoId}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold bg-transparent border-0 cursor-pointer"
              >
                Auto Generate
              </button>
            </div>
            <div className="relative">
              <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="EMP-4921"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
            {errors.employeeId && <p className="text-red-400 text-[10px] mt-1">{errors.employeeId}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Role</label>
            <div className="relative">
              <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="employee">Employee (Self-Service Portal)</option>
                <option value="hr">HR Manager (Governance)</option>
                <option value="admin">System Administrator (Full Access)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Full Name & Work Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Rajesh V"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="rajesh@dayflow.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Row 3: Department & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Design">Design</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Designation</label>
            <div className="relative">
              <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Senior Full Stack Lead"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Initial Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Temporary Password</label>
          <div className="relative">
            <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="TempPass123!"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>
          {errors.password && <p className="text-red-400 text-[10px] mt-1">{errors.password}</p>}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
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
            Create Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};
