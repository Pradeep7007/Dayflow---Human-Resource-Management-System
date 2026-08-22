import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Email Verification
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Verifying your account email status with the DayFlow authorization server.
        </p>
      </div>

      <Card>
        <CardBody className="p-6 text-center">
          {status === 'verifying' && (
            <div className="py-8 space-y-4">
              <RefreshCw size={36} className="text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Validating verification token...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Email Verified Successfully!</h3>
              <p className="text-xs text-slate-500">
                Your email address has been confirmed in the DayFlow database. Full features are now unlocked for your account.
              </p>
              <Button
                variant="primary"
                className="w-full mt-2"
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
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Verification Failed</h3>
                <p className="text-xs text-red-600 font-medium mt-1">{errorMessage}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Resend Verification Email</h4>
                <form onSubmit={handleResend} className="space-y-3">
                  <Input
                    label="Work Email Address"
                    placeholder="name@company.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" variant="secondary" className="w-full" isLoading={isResending}>
                    Request New Verification Token
                  </Button>
                </form>

                {newVerificationToken && (
                  <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900">
                    <div className="font-semibold text-indigo-950 mb-1">New Generated Verification Link:</div>
                    <Link
                      to={`/verify-email/${newVerificationToken}`}
                      className="text-indigo-600 underline font-mono break-all"
                    >
                      Click to Verify Email ({newVerificationToken.substring(0, 12)}...)
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
