import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';

export const Login = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both work email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      // Execute backend authentication request
      const res = await signin(email, password);
      setIsLoading(false);

      addToast({
        title: 'Signed In Successfully',
        message: `Welcome back, ${res.user.name}!`,
        type: 'success',
      });

      // Role-based navigation based strictly on authenticated backend user object
      const userRole = res.user?.role;
      if (userRole === 'admin' || userRole === 'hr') {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE.DASHBOARD);
      }
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Invalid email address or password.';
      setErrorMessage(msg);
      addToast({ title: 'Authentication Error', message: msg, type: 'error' });
    }
  };

  return (
    <div className="df-auth-card">
      {/* Header */}
      <div className="df-auth-card-header">
        <h2 className="df-auth-card-title">Welcome back</h2>
        <p className="df-auth-card-subtitle">Sign in to continue to DayFlow.</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="df-auth-error-banner">
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="df-auth-field-group">
          <label className="df-auth-label" htmlFor="email-input">Work Email Address</label>
          <div className="df-auth-input-wrapper">
            <Mail size={16} className="df-auth-input-icon" />
            <input
              id="email-input"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="df-auth-input"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="df-auth-field-group">
          <label className="df-auth-label" htmlFor="password-input">Password</label>
          <div className="df-auth-input-wrapper">
            <Lock size={16} className="df-auth-input-icon" />
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="df-auth-input"
              style={{ paddingRight: '2.5rem' }}
              autoComplete="current-password"
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
        </div>

        {/* Remember me & Forgot Password */}
        <div className="df-auth-row-options">
          <label className="df-auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#4f46e5' }}
            />
            <span>Remember me</span>
          </label>
          <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="df-auth-link">
            Forgot Password?
          </Link>
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          className="df-auth-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Enterprise Governance Notice */}
      <p className="df-auth-footer-text">
        Need an account? Contact your <strong style={{ color: '#ffffff' }}>HR Administrator</strong> for provisioning.
      </p>
    </div>
  );
};
