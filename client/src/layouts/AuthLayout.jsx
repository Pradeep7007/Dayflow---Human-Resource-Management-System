import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, Users, Clock, Award } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Branding Showcase Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Glow backdrop decorative subtle circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 lg:mb-10">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl lg:text-2xl shadow-lg">
              D
            </div>
            <div>
              <span className="font-extrabold text-xl lg:text-2xl text-white tracking-tight">DayFlow</span>
              <span className="block text-[10px] lg:text-xs font-semibold text-indigo-400 tracking-widest uppercase">HR & Workforce System</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 lg:mb-4">
            Streamline your organization's workforce & HR operations.
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm lg:text-base max-w-md leading-relaxed hidden sm:block">
            Enterprise-grade leave management, automated payroll, real-time attendance tracking, and intuitive employee self-service.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-3 lg:gap-4 my-6 lg:my-8 hidden sm:grid">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Users size={20} className="text-indigo-400 mb-1.5" />
            <h4 className="text-white font-semibold text-xs lg:text-sm">Employee Directory</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Unified records & profile governance.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Clock size={20} className="text-emerald-400 mb-1.5" />
            <h4 className="text-white font-semibold text-xs lg:text-sm">Real-time Attendance</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Automated check-ins & shift tracking.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <ShieldCheck size={20} className="text-purple-400 mb-1.5" />
            <h4 className="text-white font-semibold text-xs lg:text-sm">Approval Workflows</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Multi-tier leave & expense approval.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xs">
            <Award size={20} className="text-amber-400 mb-1.5" />
            <h4 className="text-white font-semibold text-xs lg:text-sm">Payroll & Reports</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Instant slip generation & audit logs.</p>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-500 hidden lg:block">
          © {new Date().getFullYear()} DayFlow HRMS Platform. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:w-1/2 bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 flex-1">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
