import React, { useState } from 'react';
import { Card } from './Card';
import {
    SETTINGS_DATA,
    LANGUAGE_OPTIONS,
    CURRENCY_OPTIONS,
    TIMEZONE_OPTIONS,
} from '../constants';
import { SettingsData, Theme } from '../types';
import { Globe, Sun, Moon, Settings, Shield, Trash, ChevronDown } from './icons';

const SettingsRow: React.FC<{ label: string, description: string, children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex flex-col md:flex-row items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
        <div className="mb-2 md:mb-0">
            <h4 className="font-semibold text-text-main">{label}</h4>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className="w-full md:w-auto flex justify-end">
            {children}
        </div>
    </div>
);

const SelectInput: React.FC<{ value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ value, options, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            className="w-56 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 pr-8 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-accent-secondary"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
);

const ThemeSelector: React.FC<{ selectedTheme: Theme, onChange: (theme: Theme) => void }> = ({ selectedTheme, onChange }) => {
    const themes: { name: Theme, icon: React.ElementType }[] = [
        { name: 'Light', icon: Sun },
        { name: 'Dark', icon: Moon },
        { name: 'System', icon: Settings },
    ];
    return (
        <div className="flex space-x-2 rounded-lg bg-gray-100 p-1">
            {themes.map(({ name, icon: Icon }) => (
                <button
                    key={name}
                    onClick={() => onChange(name)}
                    className={`flex items-center justify-center w-24 py-2 px-3 text-sm font-semibold rounded-md transition-colors
                    ${selectedTheme === name ? 'bg-white text-accent-secondary shadow-sm' : 'text-text-secondary hover:bg-gray-200'}`}
                >
                    <Icon className="w-4 h-4 mr-2" />
                    {name}
                </button>
            ))}
        </div>
    );
};

const ToggleSwitch: React.FC<{ enabled: boolean, onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors
        ${enabled ? 'bg-accent-secondary' : 'bg-gray-300'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SettingsData>(SETTINGS_DATA);

    const handleGeneralChange = (field: keyof SettingsData['general'], value: string) => {
        setSettings(prev => ({ ...prev, general: { ...prev.general, [field]: value } }));
    };

    const handleThemeChange = (theme: Theme) => {
        setSettings(prev => ({ ...prev, appearance: { ...prev.appearance, theme } }));
    };
    
    const handle2FAChange = (enabled: boolean) => {
         setSettings(prev => ({ ...prev, security: { ...prev.security, twoFactorEnabled: enabled } }));
    };

    return (
        <div className="container mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account settings and set preferences.</p>
            </header>
            
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-2">General</h3>
                    <SettingsRow label="Language" description="Choose your preferred language.">
                        <SelectInput value={settings.general.language} options={LANGUAGE_OPTIONS} onChange={(e) => handleGeneralChange('language', e.target.value)} />
                    </SettingsRow>
                    <SettingsRow label="Currency" description="Set your default currency for financial data.">
                        <SelectInput value={settings.general.currency} options={CURRENCY_OPTIONS} onChange={(e) => handleGeneralChange('currency', e.target.value)} />
                    </SettingsRow>
                     <SettingsRow label="Timezone" description="Select your local timezone.">
                        <SelectInput value={settings.general.timezone} options={TIMEZONE_OPTIONS} onChange={(e) => handleGeneralChange('timezone', e.target.value)} />
                    </SettingsRow>
                </Card>

                <Card>
                     <h3 className="font-atkinson text-xl font-bold text-text-main mb-2">Appearance</h3>
                     <SettingsRow label="Theme" description="Customize the look and feel of your dashboard.">
                        <ThemeSelector selectedTheme={settings.appearance.theme} onChange={handleThemeChange} />
                     </SettingsRow>
                </Card>

                 <Card>
                     <h3 className="font-atkinson text-xl font-bold text-text-main mb-2">Security</h3>
                     <SettingsRow label="Change Password" description="Update your password regularly to keep your account secure.">
                        <button className="px-4 py-2 text-sm font-bold text-accent-secondary border border-accent-secondary rounded-lg hover:bg-purple-50 transition-colors">
                            Change Password
                        </button>
                     </SettingsRow>
                     <SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                        <ToggleSwitch enabled={settings.security.twoFactorEnabled} onChange={handle2FAChange} />
                     </SettingsRow>
                </Card>
                
                 <Card>
                     <h3 className="font-atkinson text-xl font-bold text-text-main mb-2">Data & Privacy</h3>
                     <SettingsRow label="Export Data" description="Download a copy of your account data.">
                        <button className="px-4 py-2 text-sm font-bold text-accent-secondary border border-accent-secondary rounded-lg hover:bg-purple-50 transition-colors">
                            Request Data Export
                        </button>
                     </SettingsRow>
                     <SettingsRow label="Delete Account" description="Permanently delete your account and all associated data.">
                        <button className="px-4 py-2 text-sm font-bold text-status-error-text bg-status-error rounded-lg hover:bg-red-200 transition-colors">
                            Delete Account
                        </button>
                     </SettingsRow>
                </Card>

                 <div className="flex justify-end pt-4">
                    <button className="px-6 py-3 bg-accent-secondary text-white font-bold rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};