
import React, { useState } from 'react';
import { Card } from './Card';
import { User, AppData, DocumentType } from '../types';
import { FileText, HomeIcon, Mail, Zap, Wrench, Star, MoreHorizontal, Search } from './icons';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TenantDocumentsPageProps {
  currentUser: User;
  appData: AppData;
}

type TabType = 'Overview' | 'All Documents';

const StatCard: React.FC<{ 
  icon: React.ElementType; 
  iconBg: string;
  iconColor: string;
  value: string; 
  label: string;
}> = ({ icon: Icon, iconBg, iconColor, value, label }) => {
    return (
        <Card className="h-full">
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${iconBg}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-text-main">{value}</p>
                    <p className="text-sm text-text-secondary mt-1">{label}</p>
                </div>
            </div>
        </Card>
    );
};

export const TenantDocumentsPage: React.FC<TenantDocumentsPageProps> = ({ currentUser, appData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  // Find the tenant profile for this user
  const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
  const tenantUnit = tenantProfile ? appData.units.find(u => u.currentTenantId === tenantProfile.id) : undefined;
  const tenantBuilding = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : undefined;

  // Get documents for this tenant (filter by building and unit)
  const tenantDocuments = appData.documents.filter(doc => 
    doc.building === tenantBuilding?.id && doc.unit === tenantProfile?.unit
  );

  // Document type distribution data
  const documentTypeData = [
    { name: 'Leases', value: 35, color: '#10B981' },
    { name: 'Service Contracts / Invoices', value: 30, color: '#A78BFA' },
    { name: 'Utilities / Bills', value: 25, color: '#F59E0B' },
    { name: 'Income / Tax Docs', value: 10, color: '#EC4899' },
  ];

  // Documents uploaded over time (mock data)
  const uploadTrendData = [
    { month: 'Jan', count: 130 },
    { month: 'Feb', count: 140 },
    { month: 'Mar', count: 145 },
    { month: 'Apr', count: 155 },
    { month: 'May', count: 165 },
    { month: 'Jun', count: 180 },
    { month: 'Jul', count: 195 },
    { month: 'Aug', count: 210 },
    { month: 'Sep', count: 230 },
    { month: 'Oct', count: 245 },
    { month: 'Nov', count: 260 },
    { month: 'Dec', count: 280 },
  ];

  // Sample recent documents (would come from actual data)
  const recentDocuments = [
    { name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: 'Lease', date: '10/10/2025' },
    { name: 'Basundhara Electric Invoice', building: 'BLDG-0001', unit: 'A2', type: 'Utilities / Bills', date: '10/15/2025' },
    { name: 'Gulshan Towers Water Bill', building: 'BLDG-0004', unit: 'A7', type: 'Utilities / Bills', date: '9/28/2025' },
    { name: 'Shakti Pest Svcs Contract', building: 'BLDG-0023', unit: 'B2', type: 'Service / Contract', date: '9/31/2025' },
    { name: 'Jamuna Palaces Income Statement', building: 'BLDG-0014', unit: 'B9', type: 'Income / Tax', date: '11/14/2025' },
    { name: 'Baridhara Court Compliance Certificate', building: 'BLDG-0009', unit: 'C3', type: 'Certifications', date: '11/23/2025' },
    { name: 'Green View Apartments Insurance Policy', building: 'BLDG-0003', unit: 'C5', type: 'Insurance', date: '12/14/2025' },
    { name: 'Mirpur Elevator Maintenance Contract', building: 'BLDG-0005', unit: 'C6', type: 'Service / Contract', date: '12/24/2025' },
    { name: 'Lakeview Residences Tax Receipt', building: 'BLDG-0008', unit: 'C11', type: 'Income / Tax', date: '12/27/2025' },
    { name: 'City Lights Plumbing Service Invoice', building: 'BLDG-0012', unit: 'D1', type: 'Service / Contract', date: '12/28/2025' },
    { name: 'Uttara Regency Renovation Permit', building: 'BLDG-0009', unit: 'D3', type: 'Certifications', date: '12/31/2025' },
  ];

  const starredDocuments = [
    { name: 'Unit 12A Lease Agreement', building: 'BLDG-0001', unit: 'A1', type: 'Lease', date: '10/10/2025' },
  ];

  const tabs: TabType[] = ['Overview', 'All Documents'];

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-atkinson text-text-main">Documents Dashboard</h1>
      </header>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${
                activeTab === tab
                  ? 'border-brand-pink text-brand-pink'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={FileText}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              value="450"
              label="Recent Documents"
            />
            <StatCard
              icon={HomeIcon}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              value="85"
              label="Rent Receipts"
            />
            <StatCard
              icon={Mail}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              value="65"
              label="Notices & Letters"
            />
            <StatCard
              icon={Zap}
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
              value="120"
              label="Recent Utilities / Bills"
            />
            <StatCard
              icon={Wrench}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              value="105"
              label="Service Documents"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-1 space-y-6">
              {/* Document Type Distribution */}
              <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Document Type Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {documentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {documentTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-text-secondary">{item.name}</span>
                      </div>
                      <span className="font-medium text-text-main">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Documents Uploaded */}
              <Card>
                <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Documents Uploaded</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={uploadTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#A78BFA" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Right Column - Document Tables */}
            <div className="lg:col-span-2 space-y-6">
              {/* Most Recent Documents */}
              <Card className="!p-0">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="font-atkinson text-lg font-bold text-text-main">Most Recent Documents</h3>
                  <button className="text-text-secondary hover:text-text-main">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentDocuments.slice(0, 10).map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">{doc.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.building}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Starred Documents */}
              <Card className="!p-0">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="font-atkinson text-lg font-bold text-text-main">Starred Documents</h3>
                  <button className="text-text-secondary hover:text-text-main">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {starredDocuments.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">{doc.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.building}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </>
      ) : (
        // All Documents Tab
        <>
          <div className="mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-lg text-sm focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
          </div>
          
          <Card className="!p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doc Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentDocuments.map((doc, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-sm text-blue-600 hover:underline cursor-pointer font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.building}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">{doc.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(Math.random() * 5 + 0.5).toFixed(1)} MB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button className="text-brand-pink hover:text-pink-600 font-medium">View</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1 to 11 of 450 documents
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
                <button className="px-3 py-1 bg-brand-pink text-white rounded hover:bg-pink-600 text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
