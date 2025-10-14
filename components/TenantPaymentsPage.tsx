
import React from 'react';
import { Card } from './Card';
import { User, AppData, Document, DocumentType } from '../types';
import { DollarSign, Calendar, CheckCircle2, Zap, TrendingUp, MoreHorizontal } from './icons';

interface TenantPaymentsPageProps {
  currentUser: User;
  appData: AppData;
  onNavigate: (page: string) => void;
}

const StatCard: React.FC<{ 
  icon: React.ElementType; 
  iconBg: string;
  iconColor: string;
  label: string; 
  value: string;
}> = ({ icon: Icon, iconBg, iconColor, label, value }) => {
    return (
        <Card className="h-full">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs text-text-secondary mb-2">{label}</p>
                    <p className="text-2xl font-bold text-text-main">{value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${iconBg}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </Card>
    );
};

const PaymentBreakdownRow: React.FC<{ label: string; amount: string; isTotal?: boolean }> = ({ label, amount, isTotal = false }) => {
    return (
        <div className={`flex justify-between ${isTotal ? 'pt-4 border-t font-bold' : ''}`}>
            <span className={isTotal ? 'text-text-main' : 'text-text-secondary'}>{label}</span>
            <span className={isTotal ? 'text-text-main' : 'text-text-main font-medium'}>{amount}</span>
        </div>
    );
};

const ActivityItem: React.FC<{ title: string; date: string; amount: string; isPositive: boolean }> = ({ title, date, amount, isPositive }) => {
    return (
        <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
            <div>
                <p className="text-sm font-medium text-text-main">{title}</p>
                <p className="text-xs text-text-secondary mt-1">{date}</p>
            </div>
            <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : '-'}৳{amount}
            </span>
        </div>
    );
};

export const TenantPaymentsPage: React.FC<TenantPaymentsPageProps> = ({ currentUser, appData, onNavigate }) => {
  // Find the tenant profile for this user
  const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
  
  if (!tenantProfile) {
    return (
      <div className="container mx-auto text-center p-8">
        <h2 className="text-2xl text-text-secondary">Tenant profile not found.</h2>
      </div>
    );
  }

  // Get tenant's unit details
  const tenantUnit = appData.units.find(u => u.currentTenantId === tenantProfile.id);
  const tenantBuilding = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : undefined;
  
  const monthlyRent = tenantUnit?.monthlyRent || 25000;
  const utilityCharges = 3500;
  const previousBalance = 0;
  const lateFees = 0;
  const credits = 0;
  const totalDue = monthlyRent + utilityCharges + previousBalance + lateFees - credits;

  // Get financial documents for this tenant
  const tenantDocuments = appData.documents.filter(doc => 
    doc.building === tenantBuilding?.id && doc.unit === tenantProfile.unit
  );

  // Recent activity (mock data - would come from payment history in real app)
  const recentActivity = [
    { title: 'Rent Payment - September', date: 'Sep 1, 2025', amount: '25,000.00', isPositive: false },
    { title: 'Utility Bill - Water', date: 'Aug 28, 2025', amount: '1,200.00', isPositive: false },
    { title: 'Late Fee Assessed', date: 'Aug 15, 2025', amount: '500.00', isPositive: true },
    { title: 'Rent Payment - August', date: 'Aug 1, 2025', amount: '25,000.00', isPositive: false },
  ];

  return (
    <div className="container mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-atkinson text-text-main">Payments Hub</h1>
      </header>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Rent Amount"
          value={`৳${monthlyRent.toLocaleString()}`}
        />
        <StatCard
          icon={Calendar}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Rent Due Date"
          value="Oct 1, 2025"
        />
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          label="Rent Status"
          value="Paid"
        />
        <StatCard
          icon={Zap}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          label="Total Utility Costs"
          value={`৳${utilityCharges.toLocaleString()}`}
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          label="On Time Payment Rate"
          value="98%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Breakdown & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Breakdown */}
          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Payment Breakdown</h3>
            <div className="space-y-3 text-sm">
              <PaymentBreakdownRow label="Previous Balance" amount={`৳${previousBalance.toFixed(2)}`} />
              <PaymentBreakdownRow label="Current Rent" amount={`৳${monthlyRent.toLocaleString()}.00`} />
              <PaymentBreakdownRow label="Utility Charges" amount={`৳${utilityCharges.toLocaleString()}.00`} />
              <PaymentBreakdownRow label="Late Fees" amount={`৳${lateFees.toFixed(2)}`} />
              <PaymentBreakdownRow label="Credits" amount={`৳${credits.toFixed(2)}`} />
              
              <div className="py-3 text-sm">
                <p className="text-text-secondary mb-1">Due Date</p>
                <p className="text-text-main font-medium">October 1, 2025</p>
              </div>
              
              <PaymentBreakdownRow 
                label="Total Amount Due" 
                amount={`৳${totalDue.toLocaleString()}.00`} 
                isTotal 
              />
            </div>
            
            <button 
              onClick={() => onNavigate('make-payment')}
              className="w-full mt-6 bg-brand-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Pay Now
            </button>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Recent Activity</h3>
            <div>
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Financial Documents */}
        <div className="lg:col-span-2">
          <Card className="!p-0">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-atkinson text-lg font-bold text-text-main">Financial Documents</h3>
              <button className="text-text-secondary hover:text-text-main">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Building
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Doc Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Date Uploaded
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample financial documents */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Unit 12A Lease Agreement</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Lease</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">9/15/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Gulshan Towers Water Bill</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-004</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A7</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Utilities / Bills</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">8/26/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Shakti Pest Svcs Contract</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-0023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">B2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Service / Contract</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">9/31/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Jamuna Palaces Income Statement</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-0014</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">B9</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Income / Tax</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">9/14/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">City Lights Plumbing Service Invoice</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-0012</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">D1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Service / Contract</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">9/28/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Rent Receipt - September</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Receipt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">9/1/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Rent Receipt - August</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Receipt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">8/1/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Electricity Bill - August</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Utilities / Bills</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">8/15/2025</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">Security Deposit Receipt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">BLDG-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">A1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Receipt</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">1/15/2025</td>
                  </tr>
                  {/* Add actual tenant documents if available */}
                  {tenantDocuments.slice(0, 2).map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{doc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.building}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{doc.uploadDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
