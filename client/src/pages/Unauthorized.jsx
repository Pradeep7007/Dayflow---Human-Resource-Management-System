import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleDashboardRedirect = () => {
    if (role === ROLES.ADMIN || role === ROLES.HR) {
      navigate(ROUTES.ADMIN.DASHBOARD);
    } else {
      navigate(ROUTES.EMPLOYEE.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-slate-800 bg-slate-900 text-white shadow-2xl">
        <CardBody className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 ring-8 ring-red-500/5">
            <ShieldAlert size={36} />
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">403 - Access Forbidden</h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            You do not have administrative permission to access this page or resource. Your current role is{' '}
            <span className="font-semibold text-amber-400 uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-slate-800">
              {role || 'Guest'}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
              className="flex-1 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              leftIcon={<Home size={16} />}
              onClick={handleDashboardRedirect}
              className="flex-1"
            >
              My Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
