
import React from 'react';
import { Card } from './Card';
// FIX: Changed import to relative path.
import { FINANCIAL_STATS, RECENT_EXPENSE_DOCS, RECENT_INCOME_DOCS, EXPENSE_TYPE_DATA, MONTHLY_REVENUE_DATA } from '../constants';
import { ExpenseDistributionChart } from './charts/ExpenseDistributionChart';
import { MonthlyRevenueChart } from './charts/MonthlyRevenueChart';
// FIX: Changed import to relative path.
import { AppData, FinancialStat } from '../types';
import { DocumentTable } from './DocumentTable';

interface FinancialsDashboardProps {
  onSelectBuilding: (buildingId: string) => void;
  onSelectUnit: (unitId: string) => void;
  appData: AppData;
}


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

export const FinancialsDashboard: React.FC<FinancialsDashboardProps> = ({ onSelectBuilding, onSelectUnit, appData }) => {

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-atkinson text-text-main">Financial Dashboard</h1>
      </header>

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
          <DocumentTable title="Recent Expense Documents" documents={RECENT_EXPENSE_DOCS} onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />
          <DocumentTable title="Recent Income Documents" documents={RECENT_INCOME_DOCS} onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />
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
