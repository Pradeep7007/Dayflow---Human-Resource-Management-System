import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CreditCard, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
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

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const generateRandomEmployeeId = () => {
    const prefix = formData.role === 'admin' ? 'ADM' : formData.role === 'hr' ? 'HR' : 'EMP';
    const num = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, employeeId: `${prefix}-${num}` }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Must be at least 6 characters';
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
    setErrors({});

    try {
      const res = await signup(formData);
      setIsLoading(false);
      setIsSuccess(true);
      setCreatedUser(res.user);

      addToast({
        title: 'Account Created',
        message: 'Your DayFlow profile has been registered.',
        type: 'success',
      });
    } catch (err) {
      setIsLoading(false);
      const serverMessage = err.message || 'Registration failed.';

      if (serverMessage.toLowerCase().includes('email')) {
        setErrors({ email: serverMessage });
      } else if (serverMessage.toLowerCase().includes('employee id')) {
        setErrors({ employeeId: serverMessage });
      } else {
        setErrors({ form: serverMessage });
      }
    }
  };

  return (
    <div className="df-auth-card">
      {/* Header */}
      <div className="df-auth-card-header">
        <h2 className="df-auth-card-title">Create your DayFlow account</h2>
        <p className="df-auth-card-subtitle">Set up your HRMS account to get started.</p>
      </div>

      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <CheckCircle size={28} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Registration Complete!
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Welcome, <strong style={{ color: '#ffffff' }}>{createdUser?.name}</strong>! Your account has been registered successfully.
          </p>
          <button
            type="button"
            className="df-auth-btn-primary"
            onClick={() => navigate(createdUser?.role === 'employee' ? ROUTES.EMPLOYEE.DASHBOARD : ROUTES.ADMIN.DASHBOARD)}
          >
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="df-auth-error-banner">
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Employee ID Field */}
          <div className="df-auth-field-group">
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="df-auth-label" htmlFor="employee-id-input" style={{ marginBottom: 0 }}>Employee ID</label>
              <button
                type="button"
                onClick={generateRandomEmployeeId}
                style={{ fontSize: '0.6875rem', color: '#818cf8', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Auto Generate
              </button>
            </div>
            <div className="df-auth-input-wrapper">
              <CreditCard size={16} className="df-auth-input-icon" />
              <input
                id="employee-id-input"
                type="text"
                placeholder="EMP-1002"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="df-auth-input"
                required
              />
            </div>
            {errors.employeeId && <p style={{ color: '#f87171', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.employeeId}</p>}
          </div>

          {/* Full Name Field */}
          <div className="df-auth-field-group">
            <label className="df-auth-label" htmlFor="name-input">Full Name</label>
            <div className="df-auth-input-wrapper">
              <User size={16} className="df-auth-input-icon" />
              <input
                id="name-input"
                type="text"
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="df-auth-input"
                required
              />
            </div>
            {errors.name && <p style={{ color: '#f87171', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.name}</p>}
          </div>

          {/* Work Email Field */}
          <div className="df-auth-field-group">
            <label className="df-auth-label" htmlFor="signup-email-input">Work Email Address</label>
            <div className="df-auth-input-wrapper">
              <Mail size={16} className="df-auth-input-icon" />
              <input
                id="signup-email-input"
                type="email"
                placeholder="alex.morgan@dayflow.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="df-auth-input"
                required
              />
            </div>
            {errors.email && <p style={{ color: '#f87171', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.email}</p>}
          </div>

          {/* System Role Selection */}
          <div className="df-auth-field-group">
            <label className="df-auth-label" htmlFor="role-select">Assigned System Role</label>
            <select
              id="role-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="df-auth-input"
              style={{ paddingLeft: '0.875rem', cursor: 'pointer' }}
            >
              <option value="employee">Employee (Self-Service Portal)</option>
              <option value="hr">HR Manager (Workforce Governance)</option>
              <option value="admin">System Administrator (Full Access)</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="df-auth-field-group">
            <label className="df-auth-label" htmlFor="signup-password-input">Password</label>
            <div className="df-auth-input-wrapper">
              <Lock size={16} className="df-auth-input-icon" />
              <input
                id="signup-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="df-auth-input"
                style={{ paddingRight: '2.5rem' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="df-auth-eye-btn"
                title={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#f87171', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.password}</p>}
          </div>

          {/* Confirm Password Field */}
          <div className="df-auth-field-group">
            <label className="df-auth-label" htmlFor="confirm-password-input">Confirm Password</label>
            <div className="df-auth-input-wrapper">
              <Lock size={16} className="df-auth-input-icon" />
              <input
                id="confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="df-auth-input"
                required
              />
            </div>
            {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: '0.6875rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>}
          </div>

          {/* Primary CTA */}
          <button
            type="submit"
            className="df-auth-btn-primary"
            disabled={isLoading}
            style={{ marginTop: '1rem' }}
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Link */}
      <p className="df-auth-footer-text">
        Already have an account?{' '}
        <Link to={ROUTES.AUTH.LOGIN} className="df-auth-link">
          Sign In
        </Link>
      </p>
    </div>
  );
};
