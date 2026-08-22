import React, { useState } from 'react';
import { Send, FileEdit, ShieldAlert } from 'lucide-react';
import { Modal } from '../feedback/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../feedback/ToastContext';

export const ProfileChangeRequestModal = ({ isOpen, onClose, employee }) => {
  const { addToast } = useToast();
  const [fieldToUpdate, setFieldToUpdate] = useState('Phone Number');
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newValue.trim()) {
      setErrorMsg('Please enter the requested new value or details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        category: 'Profile Update Request',
        subject: `Profile Data Change Request: ${fieldToUpdate}`,
        details: `Employee Request from ${employee.name} (${employee.employeeId || 'ID'})\nField to Update: ${fieldToUpdate}\nRequested New Value: ${newValue}\nReason for Change: ${reason || 'N/A'}`,
      };

      const response = await fetch('http://localhost:5000/api/help-center/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (response.ok && data.success) {
        addToast({
          title: 'Request Submitted to HR Admin',
          message: `Your request to update your ${fieldToUpdate} has been routed to the System Administrator for approval.`,
          type: 'success',
        });
        setNewValue('');
        setReason('');
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to submit profile change request.');
        addToast({
          title: 'Submission Failed',
          message: data.message || 'Failed to submit profile change request.',
          type: 'error',
        });
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Server connection error. Please try again.');
      addToast({
        title: 'Network Error',
        message: 'Unable to reach backend server.',
        type: 'error',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Profile Data Update"
      subtitle="Only HR System Administrators can directly modify employee records. Submit your update below for Admin review."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Admin governance notice */}
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Administrative Governance Notice:</strong> In accordance with enterprise HR security policies, address, phone number, and personal details can only be modified directly by an Admin. Submitting this form creates an official HR approval ticket.
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Field to update dropdown */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">
            Information / Field to Update <span className="text-red-500">*</span>
          </label>
          <select
            value={fieldToUpdate}
            onChange={(e) => setFieldToUpdate(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="Phone Number">Mobile / Phone Number</option>
            <option value="Residential Address">Residential Address</option>
            <option value="Emergency Contact">Emergency Contact Details</option>
            <option value="Date of Birth">Date of Birth</option>
            <option value="Designation & Department">Designation / Department Request</option>
            <option value="Other Personal Info">Other Personal Information</option>
          </select>
        </div>

        {/* New Value Input */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">
            Requested New Value / Correct Details <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={`Enter your updated ${fieldToUpdate}`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            required
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Reason / Explanation */}
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1">
            Reason / Notes for HR Administrator
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Relocated to new apartment / Changed primary phone number"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Send size={16} />}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Submit Request to Admin
          </Button>
        </div>
      </form>
    </Modal>
  );
};
