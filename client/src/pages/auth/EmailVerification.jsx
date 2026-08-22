import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/feedback/ToastContext';
import { ROUTES } from '../../constants/routes';

export const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, user } = useAuth();
  const { addToast } = useToast();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [newVerificationToken, setNewVerificationToken] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const executeVerification = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token missing.');
        return;
      }

      try {
        const res = await verifyEmail(token);
        if (isMounted) {
          if (res.success) {
            setStatus('success');
            addToast({ title: 'Email Verified', message: 'Your email address is now verified!', type: 'success' });
          } else {
            setStatus('error');
            setErrorMessage(res.message || 'Verification token is invalid or expired.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'Verification token is invalid or expired.');
        }
      }
    };

    executeVerification();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setIsResending(true);
    try {
      const res = await resendVerification(resendEmail);
      setIsResending(false);
      if (res.emailVerificationToken) {
        setNewVerificationToken(res.emailVerificationToken);
      }
      addToast({
        title: 'New Verification Issued',
        message: 'A new verification link has been generated.',
        type: 'info',
      });
    } catch (err) {
      setIsResending(false);
      addToast({ title: 'Resend Failed', message: err.message, type: 'error' });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Email Verification
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Validating authorization token with DayFlow server.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {status === 'verifying' && (
          <div className="py-8 space-y-4 text-center">
            <RefreshCw size={36} className="text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-300">Validating verification token...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-4 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white">Email Verified Successfully!</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Your email address has been confirmed. Full platform features are unlocked for your account.
            </p>
            <Button
              variant="primary"
              className="w-full mt-3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30"
              onClick={() =>
                navigate(user?.role === 'employee' ? ROUTES.EMPLOYEE.DASHBOARD : ROUTES.ADMIN.DASHBOARD)
              }
              rightIcon={<ArrowRight size={18} />}
            >
              Continue to Dashboard
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-4 space-y-4 text-left">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-2">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-extrabold text-white">Verification Failed</h3>
              <p className="text-xs text-red-400 font-medium mt-1">{errorMessage}</p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Resend Verification Email</h4>
              <form onSubmit={handleResend} className="space-y-3">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  required
                />
                <Button type="submit" variant="secondary" className="w-full bg-slate-800 text-white hover:bg-slate-700 border-slate-700" isLoading={isResending}>
                  Request New Verification Token
                </Button>
              </form>

              {newVerificationToken && (
                <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                  <div className="font-bold text-indigo-300 mb-1">New Generated Verification Link:</div>
                  <Link
                    to={`/verify-email/${newVerificationToken}`}
                    className="text-indigo-400 underline font-mono break-all"
                  >
                    Verify Email ({newVerificationToken.substring(0, 12)}...)
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
