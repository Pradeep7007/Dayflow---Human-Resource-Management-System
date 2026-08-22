import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, CreditCard, Briefcase, MapPin, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../feedback/ToastContext';

export const EditEmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    employmentType: 'Full-Time',
    workLocation: 'HQ Campus',
    status: 'active',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        phone: employee.phone || '',
        role: employee.role || 'employee',
        department: employee.department || 'Engineering',
        jobTitle: employee.jobTitle || 'Software Engineer',
        employmentType: employee.employmentType || 'Full-Time',
        workLocation: employee.workLocation || 'HQ Campus',
        status: employee.status || 'active',
      });
      setShowConfirmDelete(false);
      setError('');
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/profile/${employee.id || employee._id}`, {
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
        throw new Error(data.message || 'Failed to update employee details.');
      }

      addToast({
        title: 'Employee Updated',
        message: `Successfully updated record for ${formData.name}.`,
        type: 'success',
      });

      if (onSuccess) onSuccess(data.profile);
      onClose();
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Error updating profile.';
      setError(msg);
      addToast({ title: 'Update Failed', message: msg, type: 'error' });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/${employee.id || employee._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setIsDeleting(false);

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete account.');
      }

      addToast({
        title: 'Account Deleted',
        message: `Employee record for ${employee.name} has been removed.`,
        type: 'info',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setIsDeleting(false);
      addToast({ title: 'Deletion Failed', message: err.message || 'Failed to delete user.', type: 'error' });
    }
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Employee — ${employee.name}`}
      subtitle={`ID: ${employee.employeeId} • ${employee.email}`}
      size="md"
    >
      {showConfirmDelete ? (
        <div className="py-4 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Delete Employee Account?</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Are you sure you want to permanently delete <strong className="text-white">{employee.name}</strong> ({employee.employeeId})? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-500 text-white font-bold"
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Row 1: Full Name & System Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">System Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR Manager</option>
                <option value="admin">System Administrator</option>
              </select>
            </div>
          </div>

          {/* Row 2: Department & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Job Designation</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Row 3: Status & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Work Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="active">Active (On Duty)</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive / Deactivated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>

          {/* Row 4: Phone & Work Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Work Location</label>
              <input
                type="text"
                value={formData.workLocation}
                onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer bg-transparent border-0"
            >
              <Trash2 size={14} /> Delete Employee
            </button>

            <div className="flex items-center gap-2">
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
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
