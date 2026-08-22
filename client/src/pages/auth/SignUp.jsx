import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const SignUp = () => {
  return (
    <div className="df-auth-card">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(79, 70, 229, 0.15)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <ShieldAlert size={32} />
        </div>

        <h2 className="df-auth-card-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          Managed Account Provisioning
        </h2>

        <p className="df-auth-card-subtitle" style={{ textAlign: 'center', lineHeight: 1.6, maxWidth: '22rem', margin: '0 auto 1.5rem auto' }}>
          Public self-registration is disabled for DayFlow HRMS. New workforce accounts are created directly by your company's <strong style={{ color: '#ffffff' }}>HR Manager or System Administrator</strong>.
        </p>

        <div style={{ padding: '0.875rem 1rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #1e293b', borderRadius: '0.75rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>
            Are you a new employee?
          </span>
          <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
            Check your corporate email inbox for an onboarding invitation containing your temporary credentials.
          </span>
        </div>

        <Link
          to={ROUTES.AUTH.LOGIN}
          className="df-auth-btn-primary"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Return to Sign In
        </Link>
      </div>
    </div>
  );
};
