import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ROLES } from '../constants/roles';

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState(ROLES.ADMIN);

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === ROLES.ADMIN ? ROLES.EMPLOYEE : ROLES.ADMIN));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        role={currentRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Header Bar */}
        <Header
          role={currentRole}
          onToggleRole={toggleRole}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Main View Container */}
        <main className="flex-1 pt-20 pb-10 px-6 max-w-7xl w-full mx-auto">
          <Outlet context={{ currentRole, toggleRole }} />
        </main>
      </div>
    </div>
  );
};
