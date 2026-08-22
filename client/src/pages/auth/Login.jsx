import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Card, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export const Login = () => {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const { addToast } = useToast();

  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState('pradeep@dayflow.com');
  const [password, setPassword] = useState('adminpass123');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === ROLES.ADMIN) {
      setEmail('pradeep@dayflow.com');
      setPassword('adminpass123');
    } else if (role === ROLES.HR) {
      setEmail('kishore@dayflow.com');
      setPassword('hrpass123');
    } else {
      setEmail('tharun@dayflow.com');
      setPassword('emppass123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await signin(email, password);
      setIsLoading(false);

      addToast({
        title: 'Signed In Successfully',
        message: `Welcome back, ${res.user.name}!`,
        type: 'success',
      });

      // Role-based automatic routing
      if (res.user.role === ROLES.ADMIN || res.user.role === ROLES.HR) {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE.DASHBOARD);
      }
    } catch (err) {
      setIsLoading(false);
      const message = err.message || 'Invalid email or password.';
      setErrors({ auth: message });
      addToast({ title: 'Authentication Failed', message, type: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to DayFlow
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Select your portal role and enter your credentials to access the HRMS platform.
        </p>
      </div>

      {/* Role Switcher Pills */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.ADMIN)}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all border-0 cursor-pointer ${
            selectedRole === ROLES.ADMIN
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          Admin Portal
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.HR)}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all border-0 cursor-pointer ${
            selectedRole === ROLES.HR
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          HR Portal
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.EMPLOYEE)}
          className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all border-0 cursor-pointer ${
            selectedRole === ROLES.EMPLOYEE
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          Employee Self-Service
        </button>
      </div>

      <Card>
        <CardBody className="p-6">
          {errors.auth && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errors.auth}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={18} />}
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Shield size={18} />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="df-checkbox-input" />
                <span>Remember me</span>
              </label>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In to {selectedRole.toUpperCase()} Portal
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account yet?{' '}
            <Link to={ROUTES.AUTH.SIGNUP} className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign Up Now
            </Link>
          </p>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-xl">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Pre-Seeded Accounts (Indian Credentials)
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.ADMIN)}
                className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] rounded border border-indigo-200 font-medium transition-colors text-center"
              >
                Pradeep (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.HR)}
                className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] rounded border border-purple-200 font-medium transition-colors text-center"
              >
                Kishore (HR)
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.EMPLOYEE)}
                className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] rounded border border-emerald-200 font-medium transition-colors text-center"
              >
                Tharun (Emp)
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
