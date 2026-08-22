import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState('admin@dayflow.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === ROLES.ADMIN) {
      setEmail('admin@dayflow.com');
      setPassword('adminPass123!');
    } else {
      setEmail('alex.morgan@dayflow.com');
      setPassword('empPass123!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Welcome back!',
        message: `Successfully logged in as ${selectedRole === ROLES.ADMIN ? 'Administrator' : 'Employee'}.`,
        type: 'success',
      });

      if (selectedRole === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE.DASHBOARD);
      }
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign in to DayFlow
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Select your portal role and enter your credentials to continue.
        </p>
      </div>

      {/* Role Selection Segmented Switch */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.ADMIN)}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
            selectedRole === ROLES.ADMIN
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <span>Admin / HR Portal</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect(ROLES.EMPLOYEE)}
          className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 border-0 cursor-pointer ${
            selectedRole === ROLES.EMPLOYEE
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 bg-transparent'
          }`}
        >
          <span>Employee Self-Service</span>
        </button>
      </div>

      <Card>
        <CardBody className="p-6">
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

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock size={18} />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="df-checkbox-input" />
                <span>Remember this device</span>
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
              Sign In to {selectedRole === ROLES.ADMIN ? 'Admin Portal' : 'Employee Portal'}
            </Button>
          </form>

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-xl">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Demo Access
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.ADMIN)}
                className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded border border-indigo-200 font-medium transition-colors"
              >
                Fill Admin Credentials
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect(ROLES.EMPLOYEE)}
                className="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded border border-purple-200 font-medium transition-colors"
              >
                Fill Employee Credentials
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
