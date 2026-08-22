import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  CreditCard,
  FileText,
  Edit2,
  Save,
  X,
  Lock,
  Upload,
  Eye,
  Trash2,
  Plus,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/feedback/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import API from '../../services/api';

export const EmployeeProfile = () => {
  const { user: currentUser, role } = useAuth();
  const { addToast } = useToast();

  const isAdmin = role === 'admin';

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'job' | 'salary' | 'documents'
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});

  // Document Upload Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', type: 'Offer Letter', fileUrl: '#' });
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Fetch Employee Profile Data
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/employees/profile/me');
      const data = res.data.profile;
      setProfile(data);
      setFormData(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      addToast({
        title: 'Error Loading Profile',
        message: err.message || 'Failed to load employee profile data.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await API.put(`/employees/profile/${profile.id}`, formData);
      setProfile(res.data.profile);
      setFormData(res.data.profile);
      setIsEditing(false);
      setIsSaving(false);
      addToast({
        title: 'Profile Updated',
        message: 'Employee profile details saved successfully.',
        type: 'success',
      });
    } catch (err) {
      setIsSaving(false);
      addToast({
        title: 'Update Failed',
        message: err.message || 'Could not save profile changes.',
        type: 'error',
      });
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.name.trim()) return;

    setIsUploadingDoc(true);
    try {
      const res = await API.post(`/employees/profile/${profile.id}/documents`, newDoc);
      setProfile((prev) => ({ ...prev, documents: res.data.documents }));
      setFormData((prev) => ({ ...prev, documents: res.data.documents }));
      setIsDocModalOpen(false);
      setNewDoc({ name: '', type: 'Offer Letter', fileUrl: '#' });
      setIsUploadingDoc(false);
      addToast({
        title: 'Document Added',
        message: 'New document attached to employee record.',
        type: 'success',
      });
    } catch (err) {
      setIsUploadingDoc(false);
      addToast({ title: 'Upload Failed', message: err.message, type: 'error' });
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const res = await API.delete(`/employees/profile/${profile.id}/documents/${docId}`);
      setProfile((prev) => ({ ...prev, documents: res.data.documents }));
      setFormData((prev) => ({ ...prev, documents: res.data.documents }));
      addToast({ title: 'Document Removed', message: 'Document deleted successfully.', type: 'info' });
    } catch (err) {
      addToast({ title: 'Deletion Error', message: err.message, type: 'error' });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-2xl w-full" />
        <div className="h-64 bg-slate-200 rounded-xl w-full" />
      </div>
    );
  }

  // Calculate Net Monthly Salary
  const sal = formData.salaryStructure || {};
  const grossSalary = (sal.baseSalary || 0) + (sal.housingAllowance || 0) + (sal.transportAllowance || 0) + (sal.bonus || 0);
  const netSalary = grossSalary - (sal.deductions || 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header Profile Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-slate-800">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          {/* Avatar & Core Meta */}
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="relative group">
              <Avatar
                name={formData.name || 'DayFlow Employee'}
                src={formData.avatarUrl}
                size="xl"
                status="online"
                className="ring-4 ring-white/20 shadow-2xl"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt('Enter image URL for Profile Picture:', formData.avatarUrl || '');
                    if (url !== null) handleInputChange('avatarUrl', url);
                  }}
                  className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Change Photo
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {formData.name}
                </h1>
                <Badge variant={formData.status === 'active' ? 'success' : 'warning'} size="sm" className="uppercase font-bold">
                  {formData.status || 'Active'}
                </Badge>
              </div>

              <p className="text-indigo-200 font-medium text-sm">
                {formData.jobTitle} • <span className="text-slate-300">{formData.department}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-mono bg-white/10 px-2.5 py-1 rounded-md">
                  <Shield size={14} className="text-indigo-400" /> ID: {formData.employeeId}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" /> {formData.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building size={14} className="text-slate-400" /> {formData.workLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Edit / Save Actions */}
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit2 size={16} />}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  leftIcon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  isLoading={isSaving}
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Permission Context Notice */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
        isAdmin ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
      }`}>
        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
        <div>
          {isAdmin ? (
            <p>
              <strong>Administrative Mode:</strong> You possess full HR & Admin authorization to view and modify all sections of this employee profile, including salary structures, official documents, and job assignments.
            </p>
          ) : (
            <p>
              <strong>Employee Self-Service Mode:</strong> You can update your contact address, phone number, emergency contacts, and profile photo. Official employment fields, job title, department, and salary structures are restricted and managed exclusively by HR Administration.
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-xl gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'personal'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <User size={16} /> Personal Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('job')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'job'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <Briefcase size={16} /> Job Information
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('salary')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'salary'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <CreditCard size={16} /> Salary & Payroll
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('documents')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
            activeTab === 'documents'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <FileText size={16} /> Documents ({formData.documents?.length || 0})
        </button>
      </div>

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Personal Details & Contacts</h3>
                <p className="text-xs text-slate-500">Contact information, address, and emergency details.</p>
              </div>
              {isEditing && <Badge variant="primary">Editing Mode Active</Badge>}
            </div>
          </CardHeader>
          <CardBody className="p-6 space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing || !isAdmin}
                  leftIcon={<User size={18} />}
                  helpText={!isAdmin && isEditing ? 'Name changes require Admin approval' : ''}
                />

                <Input
                  label="Work Email Address"
                  type="email"
                  value={formData.email || ''}
                  disabled
                  leftIcon={<Mail size={18} />}
                  rightIcon={<Lock size={16} className="text-slate-400" />}
                  helpText="Primary SSO identity (Managed by Admin)"
                />

                <Input
                  label="Mobile Phone Number"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  leftIcon={<Phone size={18} />}
                />

                <Select
                  label="Gender"
                  value={formData.gender || 'Female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing || !isAdmin}
                  options={[
                    { value: 'Female', label: 'Female' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Non-Binary', label: 'Non-Binary' },
                    { value: 'Prefer not to say', label: 'Prefer not to say' },
                  ]}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  disabled={!isEditing || !isAdmin}
                  leftIcon={<Calendar size={18} />}
                />
              </div>

              <Input
                label="Residential Address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                leftIcon={<MapPin size={18} />}
              />

              {/* Emergency Contact Sub-card */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                  Emergency Contact Reference
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Input
                    label="Contact Name"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Relationship"
                    value={formData.emergencyContact?.relation || ''}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'relation', e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Phone Number"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* TAB 2: JOB INFORMATION */}
      {activeTab === 'job' && (
        <Card>
          <CardHeader>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Employment & Position Details</h3>
              <p className="text-xs text-slate-500">Official company record, title, department, and manager.</p>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Employee Identifier"
                value={formData.employeeId || ''}
                disabled
                leftIcon={<Shield size={18} />}
                rightIcon={<Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Job Designation / Title"
                value={formData.jobTitle || ''}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                disabled={!isEditing || !isAdmin}
                leftIcon={<Briefcase size={18} />}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Department"
                value={formData.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                disabled={!isEditing || !isAdmin}
                leftIcon={<Building size={18} />}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Reporting Manager"
                value={formData.manager || ''}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Select
                label="Employment Type"
                value={formData.employmentType || 'Full-Time'}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
                disabled={!isEditing || !isAdmin}
                options={[
                  { value: 'Full-Time', label: 'Full-Time Permanent' },
                  { value: 'Part-Time', label: 'Part-Time' },
                  { value: 'Contract', label: 'Contractor' },
                  { value: 'Intern', label: 'Internship' },
                ]}
              />

              <Input
                label="Work Location"
                value={formData.workLocation || ''}
                onChange={(e) => handleInputChange('workLocation', e.target.value)}
                disabled={!isEditing || !isAdmin}
              />

              <Input
                label="Date of Joining"
                type="date"
                value={formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                disabled={!isEditing || !isAdmin}
                leftIcon={<Calendar size={18} />}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Select
                label="Employment Status"
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={!isEditing || !isAdmin}
                options={[
                  { value: 'active', label: 'Active Service' },
                  { value: 'on_leave', label: 'On Leave' },
                  { value: 'inactive', label: 'Terminated / Inactive' },
                ]}
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB 3: SALARY & PAYROLL */}
      {activeTab === 'salary' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Salary Structure & Banking</h3>
                <p className="text-xs text-slate-500">Base compensation, allowances, deductions, and payout channels.</p>
              </div>
              <Badge variant="primary" className="text-sm px-3 py-1 font-mono">
                Est. Net Monthly: ${netSalary.toLocaleString()}
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Base Annual Salary ($)"
                type="number"
                value={sal.baseSalary || 0}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'baseSalary', Number(e.target.value))}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Housing Allowance ($)"
                type="number"
                value={sal.housingAllowance || 0}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'housingAllowance', Number(e.target.value))}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Transport Allowance ($)"
                type="number"
                value={sal.transportAllowance || 0}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'transportAllowance', Number(e.target.value))}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Performance Bonus ($)"
                type="number"
                value={sal.bonus || 0}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'bonus', Number(e.target.value))}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Tax & Benefits Deductions ($)"
                type="number"
                value={sal.deductions || 0}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'deductions', Number(e.target.value))}
                disabled={!isEditing || !isAdmin}
                rightIcon={!isAdmin && <Lock size={16} className="text-slate-400" />}
              />

              <Input
                label="Payment Disbursement Method"
                value={sal.paymentMethod || 'Direct Bank Transfer'}
                onChange={(e) => handleNestedInputChange('salaryStructure', 'paymentMethod', e.target.value)}
                disabled={!isEditing || !isAdmin}
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase">Primary Bank Account</h4>
                <p className="text-sm font-mono text-slate-900 font-semibold mt-0.5">{sal.bankAccount || 'Not Specified'}</p>
              </div>
              {!isAdmin && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Lock size={14} className="text-slate-400" /> Contact payroll to update bank account details
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB 4: DOCUMENTS SECTION */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Official Personnel Documents</h3>
                <p className="text-xs text-slate-500">Verified contracts, tax forms, and identity verification credentials.</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDocModalOpen(true)}
                leftIcon={<Plus size={16} />}
              >
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-6">
            {!formData.documents || formData.documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <FileText size={28} />
                </div>
                <h4 className="text-base font-bold text-slate-900">No Documents Uploaded</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  There are no verified offer letters, identity proofs, or tax forms attached to this profile.
                </p>
                <Button variant="secondary" size="sm" onClick={() => setIsDocModalOpen(true)} leftIcon={<Upload size={16} />}>
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="df-table-container">
                <table className="df-table">
                  <thead>
                    <tr>
                      <th>Document Name</th>
                      <th>Category / Type</th>
                      <th>Upload Date</th>
                      <th>Verification Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.documents.map((doc) => (
                      <tr key={doc._id || doc.name}>
                        <td className="font-semibold text-slate-900 flex items-center gap-2">
                          <FileCheck size={18} className="text-indigo-600 flex-shrink-0" />
                          <span>{doc.name}</span>
                        </td>
                        <td>
                          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
                            {doc.type}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </td>
                        <td>
                          <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} size="sm">
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={doc.fileUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                              title="View Document"
                            >
                              <Eye size={16} />
                            </a>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc._id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border-0 bg-transparent cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* DOCUMENT UPLOAD MODAL */}
      <Modal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title="Upload Employee Document"
        size="md"
      >
        <form onSubmit={handleAddDocument} className="space-y-4">
          <Input
            label="Document Title"
            placeholder="e.g. Passport Identity Copy 2026"
            value={newDoc.name}
            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
            required
          />

          <Select
            label="Document Category"
            value={newDoc.type}
            onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
            options={[
              { value: 'Offer Letter', label: 'Employment Offer Letter' },
              { value: 'Identity Proof', label: 'Government Passport / ID Proof' },
              { value: 'Tax Form', label: 'W-4 / Tax Withholding Form' },
              { value: 'Contract', label: 'NDA & Legal Agreement' },
              { value: 'Certification', label: 'Professional Certification' },
            ]}
          />

          <Input
            label="Document File URL"
            placeholder="https://example.com/doc.pdf"
            value={newDoc.fileUrl}
            onChange={(e) => setNewDoc({ ...newDoc, fileUrl: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsDocModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUploadingDoc} leftIcon={<Upload size={16} />}>
              Attach Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
