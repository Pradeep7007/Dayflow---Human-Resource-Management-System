import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, BadgeId, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Select } from '../../components/ui/Select';
import { Card, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [demoVerificationToken, setDemoVerificationToken] = useState(null);

  const generateRandomEmployeeId = () => {
    const prefix = formData.role === 'admin' ? 'ADM' : formData.role === 'hr' ? 'HR' : 'EMP';
    const num = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, employeeId: `${prefix}-${num}` }));
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await signup(formData);
      setIsLoading(false);
      setIsSuccess(true);
      setCreatedUser(res.user);
      setDemoVerificationToken(res.emailVerificationToken);

      addToast({
        title: 'Account Registered',
        message: 'Your account has been created successfully.',
        type: 'success',
      });
    } catch (err) {
      setIsLoading(false);
      const serverMessage = err.message || 'Registration failed.';

      if (serverMessage.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: serverMessage }));
      } else if (serverMessage.toLowerCase().includes('employee id')) {
        setErrors((prev) => ({ ...prev, employeeId: serverMessage }));
      } else {
        addToast({ title: 'Registration Error', message: serverMessage, type: 'error' });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create DayFlow Account
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Register your employee or administrative profile into the DayFlow system.
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-sm text-slate-600">
                Welcome, <strong className="text-slate-900">{createdUser?.name}</strong>! An email verification request has been dispatched to{' '}
                <strong className="text-slate-900">{createdUser?.email}</strong>.
              </p>

              {demoVerificationToken && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-left text-xs text-indigo-900">
                  <div className="font-semibold text-indigo-950 mb-1">Direct Email Verification Link:</div>
                  <Link
                    to={`/verify-email/${demoVerificationToken}`}
                    className="text-indigo-600 underline font-mono break-all hover:text-indigo-800"
                  >
                    Click to Verify Email Now ({demoVerificationToken.substring(0, 12)}...)
                  </Link>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={() =>
                  navigate(createdUser?.role === 'employee' ? ROUTES.EMPLOYEE.DASHBOARD : ROUTES.ADMIN.DASHBOARD)
                }
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Employee ID"
                    placeholder="e.g. EMP-1002"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    error={errors.employeeId}
                    leftIcon={<BadgeId size={18} />}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={generateRandomEmployeeId}
                  className="mb-0.5 text-xs whitespace-nowrap"
                >
                  Auto ID
                </Button>
              </div>

              <Input
                label="Full Name"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label="Work Email Address"
                type="email"
                placeholder="alex.morgan@dayflow.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                leftIcon={<Mail size={18} />}
                required
              />

              <Select
                label="Assigned System Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: 'employee', label: 'Employee (Standard Self-Service Portal)' },
                  { value: 'hr', label: 'HR Manager (Workforce Governance)' },
                  { value: 'admin', label: 'System Administrator (Full Control)' },
                ]}
                required
              />

              <div className="space-y-1">
                <PasswordInput
                  label="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  leftIcon={<Shield size={18} />}
                  required
                />
                {formData.password && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Password Strength:</span>
                      <span className="font-semibold">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <PasswordInput
                label="Confirm Password"
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                leftIcon={<Shield size={18} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Create DayFlow Account
              </Button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Already have an account?{' '}
                <Link to={ROUTES.AUTH.LOGIN} className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
