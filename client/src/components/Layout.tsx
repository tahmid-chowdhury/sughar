
import React from 'react';
import { Sidebar } from './Sidebar';
// FIX: Changed import to relative path.
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, currentUser, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-8">
            {children}
        </div>
      </main>
    </div>
  );
};