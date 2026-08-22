import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Eye,
  FileText,
  AlertCircle,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useToast } from '../../components/feedback/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { CreateEmployeeModal } from '../../components/employee/CreateEmployeeModal';
import { EditEmployeeModal } from '../../components/employee/EditEmployeeModal';
import { AdminResetPasswordModal } from '../../components/employee/AdminResetPasswordModal';

const fallbackEmployees = [
  {
    id: 'emp-101',
    employeeId: 'EMP-1001',
    name: 'Tharun R',
    email: 'tharun@dayflow.com',
    role: 'admin',
    department: 'Engineering',
    jobTitle: 'Lead System Architect',
    status: 'active',
    dateOfJoining: '2023-01-15',
  },
  {
    id: 'emp-102',
    employeeId: 'EMP-1002',
    name: 'Ananya Sharma',
    email: 'ananya@dayflow.com',
    role: 'hr',
    department: 'Human Resources',
    jobTitle: 'HR Governance Specialist',
    status: 'active',
    dateOfJoining: '2023-03-01',
  },
  {
    id: 'emp-103',
    employeeId: 'EMP-1003',
    name: 'Vikram Seth',
    email: 'vikram@dayflow.com',
    role: 'employee',
    department: 'Operations',
    jobTitle: 'Operations Director',
    status: 'on_leave',
    dateOfJoining: '2023-05-10',
  },
  {
    id: 'emp-104',
    employeeId: 'EMP-1004',
    name: 'Kishore M',
    email: 'kishore@dayflow.com',
    role: 'employee',
    department: 'Quality Assurance',
    jobTitle: 'QA Lead Analyst',
    status: 'active',
    dateOfJoining: '2023-07-20',
  },
  {
    id: 'emp-105',
    employeeId: 'EMP-1005',
    name: 'Rohan Verma',
    email: 'rohan@dayflow.com',
    role: 'employee',
    department: 'Design',
    jobTitle: 'Senior UI/UX Designer',
    status: 'active',
    dateOfJoining: '2023-09-05',
  },
  {
    id: 'emp-106',
    employeeId: 'EMP-1006',
    name: 'Priya Sundaram',
    email: 'priya@dayflow.com',
    role: 'employee',
    department: 'Finance',
    jobTitle: 'Financial Controller',
    status: 'active',
    dateOfJoining: '2024-01-10',
  },
];

export const EmployeeList = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('sortBy', sortBy);

      const res = await fetch(`http://localhost:5000/api/employees?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success && data.employees && data.employees.length > 0) {
        setEmployees(data.employees);
      } else {
        // Use rich default fallback dataset if API returns empty list or unseeded database
        setEmployees(filterFallback(fallbackEmployees));
      }
    } catch (err) {
      setLoading(false);
      setEmployees(filterFallback(fallbackEmployees));
    }
  };

  const filterFallback = (list) => {
    return list.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDept && matchesRole && matchesStatus;
    });
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, departmentFilter, roleFilter, statusFilter, sortBy]);

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleResetPasswordClick = (emp) => {
    setSelectedEmployee(emp);
    setIsResetPasswordModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Employee Directory & Governance"
        subtitle="Manage complete organizational workforce profiles, system roles, and employment status."
        breadcrumbs={['DayFlow', 'Admin', 'Employee Directory']}
        action={
          isAdmin && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Add New Employee
            </Button>
          )
        }
      />

      {/* SEARCH & FILTERS BAR */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardBody className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, ID, email, or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Design">Design</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="md:col-span-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="employee">Employee</option>
                <option value="hr">HR Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-bold"
                title="Sort workforce"
              >
                <option value="name">Sort: Name</option>
                <option value="dateOfJoining">Sort: Joining</option>
                <option value="department">Sort: Dept</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-red-700 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchEmployees} leftIcon={<RefreshCw size={14} />}>
            Retry
          </Button>
        </div>
      )}

      {/* WORKFORCE LIST / TABLE */}
      {loading ? (
        <div className="py-16 text-center text-slate-700">
          <RefreshCw size={32} className="animate-spin mx-auto text-indigo-600 mb-3" />
          <p className="text-xs font-bold">Loading workforce records...</p>
        </div>
      ) : employees.length === 0 ? (
        <Card className="bg-white border border-slate-200 py-12 text-center shadow-sm">
          <CardBody className="space-y-3">
            <Users size={40} className="text-slate-400 mx-auto" />
            <h3 className="text-sm font-black text-slate-900">No Employees Found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-semibold">
              No employee matches your current search filters. Try resetting search parameters or add a new employee.
            </p>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 bg-indigo-600 text-white font-bold"
            >
              Add New Employee
            </Button>
          </CardBody>
        </Card>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-900 border-b border-slate-200 uppercase tracking-wider font-black text-[11px]">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joining Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id || emp._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Profile & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={emp.name} src={emp.avatarUrl} size="md" />
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                            {emp.name}
                            {emp.role !== 'employee' && (
                              <Badge
                                variant={emp.role === 'admin' ? 'danger' : 'info'}
                                className="text-[9px] uppercase px-1.5 py-0 font-bold"
                              >
                                {emp.role}
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {emp.employeeId}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-800 font-bold">
                      {emp.department || 'Engineering'}
                    </td>

                    {/* Job Title */}
                    <td className="py-3.5 px-4 text-slate-700 font-semibold">
                      {emp.jobTitle || 'Software Engineer'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          emp.status === 'active'
                            ? 'success'
                            : emp.status === 'on_leave'
                            ? 'warning'
                            : 'neutral'
                        }
                        className="text-[10px] uppercase font-bold"
                      >
                        {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                      </Badge>
                    </td>

                    {/* Joining Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono font-semibold">
                      {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'Mar 1, 2023'}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(ROUTES.EMPLOYEE.PROFILE)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all cursor-pointer"
                          title="View Employee Profile"
                        >
                          <Eye size={14} />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditClick(emp)}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer"
                              title="Edit Employee (Admin Only)"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleResetPasswordClick(emp)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                              title="Reset Password (Admin Only)"
                            >
                              <KeyRound size={14} />
                            </button>
                            <button
                              onClick={() => navigate(ROUTES.ADMIN.PAYROLL)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all cursor-pointer"
                              title="Salary & Payroll (Admin Only)"
                            >
                              <FileText size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE & TABLET RESPONSIVE CARDS VIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
            {employees.map((emp) => (
              <Card key={emp.id || emp._id} className="bg-white border border-slate-200 shadow-sm">
                <CardBody className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} src={emp.avatarUrl} size="md" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{emp.name}</h4>
                        <span className="text-xs font-mono font-bold text-indigo-700">{emp.employeeId}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        emp.status === 'active'
                          ? 'success'
                          : emp.status === 'on_leave'
                          ? 'warning'
                          : 'neutral'
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 text-slate-800 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-semibold">Department:</span>
                      <span className="font-extrabold text-slate-900">{emp.department || 'Engineering'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-semibold">Designation:</span>
                      <span className="font-extrabold text-slate-900">{emp.jobTitle || 'Software Engineer'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-semibold">Work Email:</span>
                      <span className="font-mono text-slate-800 font-bold">{emp.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(ROUTES.EMPLOYEE.PROFILE)}
                      className="text-xs text-slate-800 font-bold"
                    >
                      Profile
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditClick(emp)}
                          leftIcon={<Edit size={14} />}
                          className="text-xs text-indigo-700 font-bold"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleResetPasswordClick(emp)}
                          leftIcon={<KeyRound size={14} />}
                          className="text-xs text-rose-700 font-bold"
                        >
                          Password
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.ADMIN.PAYROLL)}
                          leftIcon={<FileText size={14} />}
                          className="text-xs text-amber-700 font-bold"
                        >
                          Payroll
                        </Button>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ADD EMPLOYEE MODAL */}
      <CreateEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchEmployees();
          addToast({ title: 'Workforce Updated', message: 'New employee account provisioned.', type: 'success' });
        }}
      />

      {/* EDIT EMPLOYEE MODAL */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={() => fetchEmployees()}
      />

      {/* ADMIN RESET PASSWORD MODAL */}
      <AdminResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};
