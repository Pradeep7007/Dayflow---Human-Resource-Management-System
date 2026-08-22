import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';
import { ROUTES } from '../../constants/routes';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
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
          Enter your registered work email and we will send you a password recovery link.
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recovery Email Sent</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6">
                We have sent a password reset link to <strong className="text-slate-800">{email}</strong>.
              </p>
              <Button variant="secondary" className="w-full" onClick={() => setIsSubmitted(false)}>
                Resend Link
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
                Send Reset Link
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
