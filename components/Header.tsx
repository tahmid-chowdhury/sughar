/**
 * Header Component with Tab Navigation
 * 
 * Reusable header component for pages that have multiple tabs/sections.
 * Displays a large title and a horizontal tab navigation bar.
 * 
 * Used by dashboard pages like:
 * - Buildings & Units (tabs: Buildings, Units)
 * - Tenants (tabs: Current Tenants, Applications, Leases Ending Soon, Leases Expired)
 * - Documents (tabs: All Documents, Recent, Starred)
 * 
 * The active tab is highlighted with a pink underline matching the brand color.
 */

import React from 'react';

/**
 * Props for the Header component
 */
interface HeaderProps {
    /** Main page title displayed at the top */
    title: string;
    /** Array of tab names to display */
    tabs: string[];
    /** Currently active/selected tab */
    activeTab: string;
    /** Callback function when a tab is clicked */
    onTabChange: (tab: string) => void;
}

/**
 * Header component with tabbed navigation
 * Provides consistent styling for page titles and tab switching
 */
export const Header: React.FC<HeaderProps> = ({ title, tabs, activeTab, onTabChange }) => {
    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-atkinson text-text-main">{title}</h1>
            <div className="mt-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${
                                    activeTab === tab
                                        ? 'border-brand-pink text-brand-pink'
                                        : 'border-transparent text-inactive-tab hover:text-gray-700 hover:border-gray-300'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}
