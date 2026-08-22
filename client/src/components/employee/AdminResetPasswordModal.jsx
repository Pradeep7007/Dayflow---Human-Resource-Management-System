import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, ShieldAlert, CheckCircle2, Lock, User } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { useToast } from '../feedback/ToastContext';

export const AdminResetPasswordModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setErrorMsg('');
    }
  }, [isOpen, employee]);

  if (!employee) return null;

  const employeeIdStr = employee.id || employee._id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees/${employeeIdStr}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (response.ok && data.success) {
        addToast({
          title: 'Password Reset Successful',
          message: data.message || `Password changed successfully for ${employee.name}.`,
          type: 'success',
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to update employee password.');
        addToast({
          title: 'Reset Failed',
          message: data.message || 'Failed to update employee password.',
          type: 'error',
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Server connection error. Please try again.');
      addToast({
        title: 'Network Error',
        message: 'Server connection error. Please verify backend status.',
        type: 'error',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Password Governance"
      subtitle="Assign a new secure authentication password for an organizational employee."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Target Employee Info Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={employee.name || 'User'} src={employee.avatarUrl} size="md" className="ring-2 ring-indigo-100" />
            <div>
              <div className="text-xs font-mono font-bold text-indigo-600">{employee.employeeId}</div>
              <div className="font-extrabold text-sm text-slate-900">{employee.name}</div>
              <div className="text-xs text-slate-500 font-medium">{employee.email}</div>
            </div>
          </div>
          <Badge variant="primary" className="uppercase font-bold text-[10px]">
            {employee.role || 'employee'}
          </Badge>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Administrative Authorization:</strong> You are resetting the login credential for this account. Please notify the employee securely after changing their password.
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* New Password Input */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">
            New Secure Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password (min. 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Input */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<KeyRound size={16} />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Update Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
