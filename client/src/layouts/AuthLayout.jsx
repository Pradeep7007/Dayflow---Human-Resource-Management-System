import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShieldCheck, Users, Clock, Award, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../constants/routes';
import '../styles/AuthPages.css';

export const AuthLayout = () => {
  return (
    <div className="df-auth-page">
      {/* LEFT BRANDING PANEL (Desktop >= 1024px) */}
      <div className="df-auth-branding-panel">
        <div className="df-auth-glow-1" />
        <div className="df-auth-glow-2" />

        {/* Top Branding Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="df-auth-logo-badge">
            <Link to={ROUTES.AUTH.LOGIN} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div className="df-auth-logo-icon">D</div>
              <div>
                <span style={{ fontWeight: 800, fontSize: '1.375rem', color: '#ffffff', letterSpacing: '-0.02em' }}>DayFlow</span>
                <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#818cf8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  HRMS & Workforce Platform
                </span>
              </div>
            </Link>
          </div>

          <div>
            <h1 className="df-auth-hero-title">
              Automate workforce management with effortless intelligence.
            </h1>
            <p className="df-auth-hero-subtitle">
              Unified employee profile management, automated attendance logging, multi-tier leave approval workflows, and Indian tax compliant payroll.
            </p>
          </div>
        </div>

        {/* Feature Highlights Showcase */}
        <div className="df-auth-feature-list" style={{ position: 'relative', zIndex: 10 }}>
          <div className="df-auth-feature-item">
            <div className="df-auth-feature-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Users size={18} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem' }}>Employee Directory & Governance</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.6875rem', marginTop: '0.125rem' }}>Centralized profile records & role permissions.</p>
            </div>
          </div>

          <div className="df-auth-feature-item">
            <div className="df-auth-feature-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <Clock size={18} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem' }}>Real-Time Shift & Attendance Logging</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.6875rem', marginTop: '0.125rem' }}>Automated check-ins & weekly/monthly metrics.</p>
            </div>
          </div>

          <div className="df-auth-feature-item">
            <div className="df-auth-feature-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem' }}>Multi-Tier Leave Approval Workflows</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.6875rem', marginTop: '0.125rem' }}>Instant leave submission & HR governance queue.</p>
            </div>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#64748b', paddingTop: '1rem', borderTop: '1px solid rgba(30, 41, 59, 0.6)' }}>
          <span>© {new Date().getFullYear()} DayFlow HRMS Platform</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
            <CheckCircle2 size={13} style={{ color: '#34d399' }} /> Enterprise Certified
          </span>
        </div>
      </div>

      {/* RIGHT AUTH FORM PANEL */}
      <div className="df-auth-form-panel">
        {/* Mobile Header Banner (<1024px) */}
        <div className="df-auth-mobile-header">
          <Link to={ROUTES.AUTH.LOGIN} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div className="df-auth-logo-icon" style={{ width: '2.25rem', height: '2.25rem', fontSize: '1.125rem' }}>D</div>
            <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#ffffff' }}>DayFlow HRMS</span>
          </Link>
        </div>

        {/* Dynamic Auth Page Outlet */}
        <Outlet />
      </div>
    </div>
  );
};
