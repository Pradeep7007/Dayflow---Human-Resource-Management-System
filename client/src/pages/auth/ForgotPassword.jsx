import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
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
        message: 'Password recovery link generated.',
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
        <Link to={ROUTES.AUTH.LOGIN} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Reset Password
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Enter your registered work email address to receive recovery instructions.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-lg font-bold text-white">Recovery Instructions Sent</h3>
            <p className="text-xs text-slate-300">
              If an account registered to <strong className="text-white">{email}</strong> exists, recovery instructions have been dispatched.
            </p>

            {demoResetToken && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-left text-xs text-purple-200">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <Sparkles size={14} /> Secure Password Reset Link:
                </div>
                <Link
                  to={`/reset-password/${demoResetToken}`}
                  className="text-purple-400 underline font-mono break-all hover:text-purple-300"
                >
                  Open Reset Screen ({demoResetToken.substring(0, 12)}...)
                </Link>
              </div>
            )}

            <Button
              variant="secondary"
              className="w-full mt-2 bg-slate-800 text-white hover:bg-slate-700 border-slate-700"
              onClick={() => setIsSubmitted(false)}
            >
              Request Another Link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30"
              isLoading={isLoading}
            >
              Send Password Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
