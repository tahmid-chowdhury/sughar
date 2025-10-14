/**
 * Layout Component
 * 
 * This is the main layout wrapper for all authenticated pages in the application.
 * It provides the consistent structure with sidebar navigation and content area.
 * 
 * Layout Structure:
 * - Left sidebar with navigation menu
 * - Main content area (right side) with scrollable content
 * 
 * This component is only rendered for logged-in users. Login/signup pages bypass this layout.
 */

import React from 'react';
import { Sidebar } from './Sidebar';
// FIX: Changed import to relative path.
import { User } from '../types';

/**
 * Props for the Layout component
 */
interface LayoutProps {
  /** Page content to render in the main area */
  children: React.ReactNode;
  /** Current active page identifier */
  currentPage: string;
  /** Function to navigate to a different page */
  setCurrentPage: (page: string) => void;
  /** Currently logged-in user */
  currentUser: User | null;
  /** Function to handle user logout */
  onLogout: () => void;
}

/**
 * Main layout component that wraps all authenticated pages
 */
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