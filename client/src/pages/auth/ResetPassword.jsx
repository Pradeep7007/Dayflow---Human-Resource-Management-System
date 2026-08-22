import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { PasswordInput } from '../../components/ui/PasswordInput';
import { Card, CardBody } from '../../components/ui/Card';
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
        <Link to={ROUTES.AUTH.LOGIN} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-4">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Set New Password
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Please enter your new password below to secure your DayFlow account.
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Password Reset Complete!</h3>
              <p className="text-xs text-slate-500">
                Your password has been updated in the database. You can now sign in with your new credentials.
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                rightIcon={<ArrowRight size={18} />}
              >
                Proceed to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errors.form}
                </div>
              )}

              <PasswordInput
                label="New Password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Shield size={18} />}
                required
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                leftIcon={<Shield size={18} />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Update Password & Sign In
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
