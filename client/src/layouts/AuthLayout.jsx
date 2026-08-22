import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, Users, Clock, Award } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Left Branding Showcase Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Glow backdrop decorative subtle circle */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
              D
            </div>
            <div>
              <span className="font-extrabold text-2xl text-white tracking-tight">DayFlow</span>
              <span className="block text-xs font-semibold text-indigo-400 tracking-widest uppercase">HR & Workforce System</span>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Streamline your organization's workforce & HR operations.
          </h1>
          <p className="text-slate-400 text-base max-w-md leading-relaxed">
            Enterprise-grade leave management, automated payroll, real-time attendance tracking, and intuitive employee self-service.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 my-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Users size={24} className="text-indigo-400 mb-2" />
            <h4 className="text-white font-semibold text-sm">Employee Directory</h4>
            <p className="text-slate-400 text-xs mt-1">Unified records & profile governance.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Clock size={24} className="text-emerald-400 mb-2" />
            <h4 className="text-white font-semibold text-sm">Real-time Attendance</h4>
            <p className="text-slate-400 text-xs mt-1">Automated check-ins & shift tracking.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <ShieldCheck size={24} className="text-purple-400 mb-2" />
            <h4 className="text-white font-semibold text-sm">Approval Workflows</h4>
            <p className="text-slate-400 text-xs mt-1">Multi-tier leave & expense approval.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Award size={24} className="text-amber-400 mb-2" />
            <h4 className="text-white font-semibold text-sm">Payroll & Reports</h4>
            <p className="text-slate-400 text-xs mt-1">Instant slip generation & audit logs.</p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} DayFlow HRMS Platform. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
