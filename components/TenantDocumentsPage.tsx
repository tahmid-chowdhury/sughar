
import React, { useState, useMemo } from 'react';
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
  const tenantProfile = appData.tenants.find(t => t.id === currentUser.id || t.name === currentUser.name);
  const tenantUnit = tenantProfile ? appData.units.find(u => u.currentTenantId === tenantProfile.id) : undefined;
  const tenantBuilding = tenantUnit ? appData.buildings.find(b => b.id === tenantUnit.buildingId) : undefined;

  // Get documents for this tenant (filter by building and unit)
  const tenantDocuments = appData.documents.filter(doc => {
    // Show documents that are either:
    // 1. Uploaded by this tenant
    // 2. Shared with this tenant
    // 3. Associated with this tenant's unit
    const isUploadedByTenant = doc.uploadedBy === currentUser.id;
    const isSharedWithTenant = doc.sharedWith?.includes(currentUser.id);
    const isForTenantUnit = doc.unit === tenantUnit?.id || doc.tenant === tenantProfile?.id;
    
    return isUploadedByTenant || isSharedWithTenant || isForTenantUnit;
  });
  
  // Group documents by type for the overview
  const documentsByType = tenantDocuments.reduce((acc, doc) => {
    const type = doc.type || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {} as Record<string, typeof tenantDocuments>);

  // Generate document type distribution from actual data
  const documentTypeData = Object.entries(documentsByType).map(([type, docs]) => {
    const colorMap: Record<string, string> = {
      'lease': '#10B981',
      'contract': '#A78BFA',
      'invoice': '#3B82F6',
      'utility': '#F59E0B',
      'tax': '#EC4899',
      'other': '#9CA3AF'
    };
    
    const typeKey = type.toLowerCase();
    const color = Object.keys(colorMap).find(key => typeKey.includes(key)) ? 
      colorMap[Object.keys(colorMap).find(key => typeKey.includes(key))!] : 
      colorMap['other'];
      
    return {
      name: type,
      value: docs.length,
      color,
      count: docs.length
    };
  }).filter(item => item.count > 0);

  // Generate upload trend data from actual documents
  const uploadTrendData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // Get last 6 months
    
    // Initialize monthly counts
    const monthlyCounts: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize with 0 counts for the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyCounts[monthKey] = 0;
    }
    
    // Count documents per month
    tenantDocuments.forEach(doc => {
      if (!doc.uploadDate) return;
      
      const uploadDate = new Date(doc.uploadDate);
      if (uploadDate >= sixMonthsAgo) {
        const monthKey = `${monthNames[uploadDate.getMonth()]} ${uploadDate.getFullYear()}`;
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
      }
    });
    
    // Convert to array and sort by date
    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        month: month.split(' ')[0],
        count
      }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  }, [tenantDocuments]);

  // Get recent documents (most recent 5)
  const recentDocuments = useMemo(() => {
    return [...tenantDocuments]
      .sort((a, b) => new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime())
      .slice(0, 5)
      .map(doc => {
        const building = doc.building ? appData.buildings.find(b => b.id === doc.building) : null;
        const unit = doc.unit ? appData.units.find(u => u.id === doc.unit) : null;
        
        return {
          id: doc.id,
          name: doc.name,
          building: building?.name || 'Unknown Building',
          unit: unit?.unitNumber || 'Unknown Unit',
          type: doc.type || 'Document',
          date: doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A',
          fileUrl: doc.fileUrl,
          isStarred: doc.isStarred
        };
      });
  }, [tenantDocuments, appData.buildings, appData.units]);

  // Get starred documents
  const starredDocuments = useMemo(() => {
    return tenantDocuments
      .filter(doc => doc.isStarred)
      .map(doc => {
        const building = doc.building ? appData.buildings.find(b => b.id === doc.building) : null;
        const unit = doc.unit ? appData.units.find(u => u.id === doc.unit) : null;
        
        return {
          id: doc.id,
          name: doc.name,
          building: building?.name || 'Unknown Building',
          unit: unit?.unitNumber || 'Unknown Unit',
          type: doc.type || 'Document',
          date: doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A',
          fileUrl: doc.fileUrl
        };
      });
  }, [tenantDocuments, appData.buildings, appData.units]);

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
