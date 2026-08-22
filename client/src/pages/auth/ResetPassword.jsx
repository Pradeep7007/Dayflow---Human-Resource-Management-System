import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await resetPassword(token, password, confirmPassword);
      setIsLoading(false);
      setIsSuccess(true);
      addToast({
        title: 'Password Updated',
        message: 'Your password has been reset successfully.',
        type: 'success',
      });
    } catch (err) {
      setIsLoading(false);
      const msg = err.message || 'Password reset failed or token expired.';
      setErrors({ form: msg });
      addToast({ title: 'Reset Error', message: msg, type: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to={ROUTES.AUTH.LOGIN} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Set New Password
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Please enter your new password below to secure your DayFlow account.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {isSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Password Reset Complete!</h3>
            <p className="text-xs text-slate-300">
              Your password has been updated in the database. You can now sign in with your new credentials.
            </p>
            <Button
              variant="primary"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl"
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
              rightIcon={<ArrowRight size={18} />}
            >
              Proceed to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Shield size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
              </div>
              {errors.password && <p className="text-red-400 text-[11px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <Shield size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30"
              isLoading={isLoading}
            >
              Update Password & Sign In
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
