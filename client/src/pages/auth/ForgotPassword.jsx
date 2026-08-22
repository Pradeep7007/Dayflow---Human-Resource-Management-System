import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';

export const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoResetToken, setDemoResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      setIsLoading(false);
      setIsSubmitted(true);
      if (res.resetToken) {
        setDemoResetToken(res.resetToken);
      }
      addToast({
        title: 'Instructions Sent',
        message: 'Password recovery email sent successfully.',
        type: 'info',
      });
    } catch (err) {
      setIsLoading(false);
      addToast({
        title: 'Error',
        message: err.message || 'Failed to process request.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link to={ROUTES.AUTH.LOGIN} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mb-4">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Enter your registered work email and we will issue password recovery instructions.
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recovery Instructions Dispatched</h3>
              <p className="text-xs text-slate-500 mt-2">
                If an account registered to <strong className="text-slate-800">{email}</strong> exists, a password reset link has been dispatched.
              </p>

              {demoResetToken && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-left text-xs text-purple-900">
                  <div className="font-semibold text-purple-950 mb-1">Secure Password Reset Link:</div>
                  <Link
                    to={`/reset-password/${demoResetToken}`}
                    className="text-purple-600 underline font-mono break-all hover:text-purple-800"
                  >
                    Click to Open Password Reset Screen ({demoResetToken.substring(0, 12)}...)
                  </Link>
                </div>
              )}

              <Button variant="secondary" className="w-full mt-2" onClick={() => setIsSubmitted(false)}>
                Request Another Link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email Address"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                Send Password Reset Link
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
