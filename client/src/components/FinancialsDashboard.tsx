
import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { FINANCIAL_STATS, RECENT_EXPENSE_DOCS, RECENT_INCOME_DOCS, EXPENSE_TYPE_DATA, MONTHLY_REVENUE_DATA } from '../constants';
import { ExpenseDistributionChart } from './charts/ExpenseDistributionChart';
import { MonthlyRevenueChart } from './charts/MonthlyRevenueChart';
import { Document, FinancialStat } from '../types';
import { MoreHorizontal } from './icons';

// FIX: Changed component to use React.FC to properly type props and resolve key assignment error.
const StatCard: React.FC<{ stat: FinancialStat }> = ({ stat }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
      <stat.icon className={`w-6 h-6 ${stat.color}`} />
    </div>
    <div className="ml-4">
      <p className="text-sm text-text-secondary">{stat.label}</p>
      <p className="text-2xl font-bold text-text-main">{stat.value}</p>
    </div>
  </Card>
);

const DocumentTable = ({ title, documents }: { title: string; documents: Document[] }) => (
    <Card className="flex-1">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-xl font-bold text-text-main">{title}</h3>
            <button className="text-text-secondary hover:text-text-main">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-4 py-3">Document Name</th>
                        <th scope="col" className="px-4 py-3">Building</th>
                        <th scope="col" className="px-4 py-3">Unit</th>
                        <th scope="col" className="px-4 py-3">Doc Type</th>
                        <th scope="col" className="px-4 py-3">Date Uploaded</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => (
                        <tr key={doc.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                            <td className="px-4 py-3">{doc.building}</td>
                            <td className="px-4 py-3">{doc.unit}</td>
                            <td className="px-4 py-3">{doc.type}</td>
                            <td className="px-4 py-3">{doc.uploadDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


export const FinancialsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="container mx-auto">
      <Header 
        title="Financial Dashboard"
        tabs={['Overview', 'Units', 'Applications', 'Documents']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {FINANCIAL_STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Document Tables Column */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          <DocumentTable title="Recent Expense Documents" documents={RECENT_EXPENSE_DOCS} />
          <DocumentTable title="Recent Income Documents" documents={RECENT_INCOME_DOCS} />
        </div>
        
        {/* Charts Column */}
        <div className="space-y-8 flex flex-col">
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Expense Type Distribution</h3>
            <div className="h-64">
                <ExpenseDistributionChart data={EXPENSE_TYPE_DATA} />
            </div>
          </Card>
          <Card>
            <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Monthly Revenue</h3>
            <div className="h-64">
                <MonthlyRevenueChart data={MONTHLY_REVENUE_DATA} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};