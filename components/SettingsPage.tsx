import React, { useState } from 'react';
import { Card } from './Card';
import { SettingsData, Theme } from '../types';
import { Sun, Moon, Settings, ChevronDown, User, Bell, CreditCard, Users, Key, Check, X, Plus, Trash } from './icons';

// Tab component for navigation
const Tab: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string }> = 
  ({ active, onClick, icon: Icon, label }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'bg-accent-secondary/10 text-accent-secondary' 
          : 'text-text-secondary hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-5 h-5 mr-2 ${active ? 'text-accent-secondary' : 'text-gray-400'}`} />
      {label}
    </button>
  );

// Reusable settings row component
const SettingsRow: React.FC<{ 
  label: string; 
  description: string; 
  children: React.ReactNode;
  fullWidth?: boolean;
}> = ({ label, description, children, fullWidth = false }) => (
  <div className="flex flex-col md:flex-row items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
    <div className="mb-2 md:mb-0 md:max-w-[60%]">
      <h4 className="font-semibold text-text-main">{label}</h4>
      <p className="text-sm text-text-secondary mt-1">{description}</p>
    </div>
    <div className={`w-full ${!fullWidth ? 'md:w-auto' : ''} flex justify-end`}>
      {children}
    </div>
  </div>
);

// Input components
const TextInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}> = ({ value, onChange, placeholder, className = '', type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-secondary focus:border-transparent ${className}`}
  />
);

const SelectInput: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, options, onChange, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-secondary"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}> = ({ enabled, onChange, label }) => (
  <div className="flex items-center">
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`${
        enabled ? 'bg-accent-secondary' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-secondary focus:ring-offset-2`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
    {label && <span className="ml-3 text-sm text-text-main">{label}</span>}
  </div>
);

// Main Settings Page Component
export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      profilePictureUrl: '/default-avatar.png',
      language: 'en',
      timezone: 'America/New_York',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      serviceRequestUpdates: true,
      paymentReminders: true,
    },
    apiKeys: {
      keys: [
        {
          id: '1',
          label: 'Mobile App',
          createdAt: '2023-01-15',
          lastUsed: '2023-10-20',
        },
      ],
    },
    billing: {
      plan: 'pro',
      renewalDate: '2023-12-15',
      paymentMethod: {
        brand: 'visa',
        last4: '4242',
        expiry: '12/25',
      },
      invoices: [
        {
          id: 'INV-001',
          amount: 29.99,
          date: '2023-09-15',
          status: 'paid',
        },
      ],
    },
    team: {
      members: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'owner',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
        },
      ],
    },
  });

  // Tab navigation
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'apiKeys', label: 'API Keys', icon: Key },
  ];

  // Handle form updates
  const updateProfile = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      profile: { ...prev.profile, [field]: value },
    }));
  };

  const toggleNotification = (field: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Add API call to update profile
      // For now, just show a success message
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={settings.profile.profilePictureUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 bg-accent-secondary text-white p-1 rounded-full">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{settings.profile.fullName}</h3>
                <p className="text-sm text-text-secondary">{settings.profile.email}</p>
              </div>
            </div>

            <SettingsRow
              label="Full Name"
              description="Your name as it appears on your profile"
            >
              <TextInput
                value={settings.profile.fullName}
                onChange={(value) => updateProfile('fullName', value)}
                className="w-full md:w-64"
              />
            </SettingsRow>

            <SettingsRow
              label="Email"
              description="Your email address for account notifications"
            >
              <TextInput
                value={settings.profile.email}
                onChange={(value) => updateProfile('email', value)}
                className="w-full md:w-64"
                type="email"
              />
            </SettingsRow>

            <SettingsRow
              label="Phone Number"
              description="Your phone number for account security and notifications"
            >
              <TextInput
                value={settings.profile.phone || ''}
                onChange={(value) => updateProfile('phone', value)}
                className="w-full md:w-64"
                placeholder="+1 (___) ___-____"
              />
            </SettingsRow>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors"
              >
                Save Profile Changes
              </button>
            </div>

            <SettingsRow
              label="Language"
              description="Preferred language for the application"
            >
              <SelectInput
                value={settings.profile.language || 'en'}
                onChange={(value) => updateProfile('language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' },
                ]}
                className="w-full md:w-64"
              />
            </SettingsRow>

            <SettingsRow
              label="Timezone"
              description="Your local timezone for all date and time displays"
            >
              <SelectInput
                value={settings.profile.timezone || 'UTC'}
                onChange={(value) => updateProfile('timezone', value)}
                options={[
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                ]}
                className="w-full md:w-64"
              />
            </SettingsRow>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            
            <SettingsRow
              label="Email Notifications"
              description="Receive email notifications for important updates"
            >
              <ToggleSwitch
                enabled={settings.notifications.emailNotifications}
                onChange={(enabled) => toggleNotification('emailNotifications', enabled)}
              />
            </SettingsRow>

            <SettingsRow
              label="SMS Notifications"
              description="Receive text message notifications (standard rates may apply)"
            >
              <ToggleSwitch
                enabled={settings.notifications.smsNotifications || false}
                onChange={(enabled) => toggleNotification('smsNotifications', enabled)}
              />
            </SettingsRow>

            <h3 className="text-lg font-semibold mt-8 mb-4">Notification Preferences</h3>

            <SettingsRow
              label="In-App Notifications"
              description="Show notifications within the application"
            >
              <ToggleSwitch
                enabled={settings.notifications.inAppNotifications}
                onChange={(enabled) => toggleNotification('inAppNotifications', enabled)}
              />
            </SettingsRow>

            <SettingsRow
              label="Service Request Updates"
              description="Get notified about service request status changes"
            >
              <ToggleSwitch
                enabled={settings.notifications.serviceRequestUpdates}
                onChange={(enabled) => toggleNotification('serviceRequestUpdates', enabled)}
              />
            </SettingsRow>

            <SettingsRow
              label="Payment Reminders"
              description="Receive reminders for upcoming or missed payments"
            >
              <ToggleSwitch
                enabled={settings.notifications.paymentReminders}
                onChange={(enabled) => toggleNotification('paymentReminders', enabled)}
              />
            </SettingsRow>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Current Plan</h3>
                  <p className="text-2xl font-bold">{settings.billing?.plan ? settings.billing.plan.charAt(0).toUpperCase() + settings.billing.plan.slice(1) : 'Free'} Plan</p>
                  {settings.billing?.renewalDate && (
                    <p className="text-sm text-text-secondary mt-1">
                      Renews on {new Date(settings.billing.renewalDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors">
                  Change Plan
                </button>
              </div>
            </div>

            {settings.billing?.paymentMethod && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-lg mr-4">
                      {settings.billing.paymentMethod.brand === 'visa' ? (
                        <span className="text-blue-600 font-bold">VISA</span>
                      ) : (
                        <span className="text-gray-600">••••</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• {settings.billing.paymentMethod.last4}</p>
                      <p className="text-sm text-text-secondary">Expires {settings.billing.paymentMethod.expiry}</p>
                    </div>
                  </div>
                  <button className="text-accent-secondary hover:text-accent-secondary/80">
                    Edit
                  </button>
                </div>
              </div>
            )}

            {settings.billing?.invoices && settings.billing.invoices.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Download</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {settings.billing.invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                invoice.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-accent-secondary hover:text-accent-secondary/80"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Team Members</h3>
                <p className="text-sm text-text-secondary">
                  Manage who has access to your properties
                </p>
              </div>
              <button className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {settings.team?.members.map((member) => (
                  <li key={member.id}>
                    <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                            {member.role === 'owner' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Owner
                              </span>
                            )}
                            {member.role === 'admin' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                      {member.role !== 'owner' && (
                        <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                          Remove
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {settings.team?.invitations && settings.team.invitations.length > 0 && (
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Pending Invitations</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {settings.team.invitations.map((invite, index) => (
                      <li key={index}>
                        <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {invite.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                Invited as {invite.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                              Cancel
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                              Resend
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 'apiKeys':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">API Keys</h3>
                <p className="text-sm text-text-secondary">
                  Manage your API keys for integrating with other services
                </p>
              </div>
              <button className="px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create New Key
              </button>
            </div>

            {settings.apiKeys?.keys && settings.apiKeys.keys.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {settings.apiKeys.keys.map((key) => (
                    <li key={key.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-accent-secondary truncate">
                            {key.label}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              Created on {new Date(key.createdAt).toLocaleDateString()}
                            </p>
                            {key.lastUsed && (
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Last used {new Date(key.lastUsed).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <button className="text-red-600 hover:text-red-900 mr-4">
                              Revoke
                            </button>
                            <button className="text-accent-secondary hover:text-accent-secondary/80">
                              Copy Key
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new API key.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-secondary hover:bg-accent-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-secondary"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    New API Key
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your API keys carry many privileges. Be sure to keep them secure and
                      do not share them in publicly accessible areas such as GitHub,
                      client-side code, and so forth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view settings</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Sidebar Navigation */}
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <Card className="p-6">{renderTabContent()}</Card>
        </div>
      </div>
    </div>
  );
};