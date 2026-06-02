import React from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => (
  <div className="flex min-h-screen">
    {/* Sidebar: shown via drawer on mobile, normal layout on desktop */}
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-4 sm:p-8 pb-20 overflow-x-hidden">
        {children}
      </main>
    </div>
  </div>
);
