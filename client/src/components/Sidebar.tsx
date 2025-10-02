
import React from 'react';
import { HomeIcon, DollarSign, Building, Wrench, Users, FileText, Settings, LogOut } from './icons';
// FIX: Changed import to relative path.
import { User } from '../types';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  page: string;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}> = ({ icon: Icon, label, page, currentPage, setCurrentPage }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
        ${
          currentPage === page
            ? 'bg-brand-pink text-white shadow-lg'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
);

const UserProfile: React.FC<{ user: User, onAccountClick: () => void, isAccountPage: boolean }> = ({ user, onAccountClick, isAccountPage }) => {
    const { name, email, avatarUrl } = user;
    const avatarSrc = avatarUrl || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=EBD4F8&color=8645B1`;
    const buttonClass = `flex items-center w-full mt-4 p-2 rounded-lg text-left transition-colors ${
        isAccountPage ? 'bg-gray-100' : 'hover:bg-gray-100'
    }`;

    return (
        <button
            onClick={onAccountClick}
            className={buttonClass}
        >
            <img 
                src={avatarSrc} 
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
                <p className="text-sm font-semibold text-text-main">{name}</p>
                <p className="text-xs text-text-secondary">{email}</p>
            </div>
        </button>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, currentUser, onLogout }) => {
  const navItems = [
    { icon: HomeIcon, label: 'Home', page: 'home' },
    { icon: DollarSign, label: 'Financials', page: 'financials' },
    { icon: Building, label: 'Buildings & Units', page: 'buildings' },
    { icon: Wrench, label: 'Service Requests', page: 'service-requests' },
    { icon: Users, label: 'Tenants', page: 'tenants' },
    { icon: FileText, label: 'Documents', page: 'documents' },
  ];

  return (
    <aside className="w-64 flex flex-col bg-card-bg border-r border-gray-200 p-4">
      <div className="flex items-center mb-10 px-2">
        <div className="bg-brand-pink p-2 rounded-lg">
          <HomeIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="ml-3 text-2xl font-bold font-atkinson text-text-main">
          SuGhar
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.page} {...item} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        ))}
      </nav>

      <div className="mt-auto">
        <div className="border-t border-gray-200 pt-4 space-y-2">
           <button
              onClick={() => setCurrentPage('settings')}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentPage === 'settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Log Out</span>
            </button>
        </div>
        {currentUser && (
            <UserProfile 
                user={currentUser} 
                onAccountClick={() => setCurrentPage('account')}
                isAccountPage={currentPage === 'account'}
            />
        )}
      </div>
    </aside>
  );
};