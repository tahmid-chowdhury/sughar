
import React from 'react';

interface HeaderProps {
    title: string;
    tabs?: string[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ title, tabs, activeTab, onTabChange }) => {
    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold font-atkinson text-text-main">{title}</h1>
            {tabs && tabs.length > 0 && (
                <div className="mt-4 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange?.(tab)}
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
            )}
        </header>
    );
}
