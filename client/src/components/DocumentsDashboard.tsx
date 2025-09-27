import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { DOCUMENT_DASHBOARD_STATS, MOST_RECENT_DOCUMENTS, STARRED_DOCUMENTS, DOCUMENT_TYPE_DISTRIBUTION_DATA, DOCUMENTS_UPLOADED_DATA } from '../constants';
import { Document, DocumentDashboardStat } from '../types';
import { DocumentTypeDistributionChart } from './charts/DocumentTypeDistributionChart';
import { DocumentsUploadedChart } from './charts/DocumentsUploadedChart';
import { MoreHorizontal, Star } from './icons';
import { AllDocumentsPage } from './AllDocumentsPage';
import { NewDocumentFormFixed as NewDocumentForm } from './NewDocumentForm';

interface DocumentsDashboardProps {
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
  setViewingTenantId?: (tenantId: string) => void;
}

const StatCard: React.FC<{ stat: DocumentDashboardStat }> = ({ stat }) => (
  <Card className="flex items-center p-4">
    <div className={`p-3 rounded-full ${stat.bgColor}`}>
      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
    </div>
    <div className="ml-4">
      <p className="text-2xl font-bold text-text-main">{stat.value}</p>
      <p className="text-sm text-text-secondary">{stat.label}</p>
    </div>
  </Card>
);

const DocumentTable: React.FC<{ 
  title: string; 
  documents: Document[]; 
  showStar?: boolean;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
}> = ({ title, documents, showStar = false, onBuildingClick, onUnitClick }) => (
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
                        {showStar && <th scope="col" className="px-4 py-3"></th>}
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
                            {showStar && <td className="px-4 py-3"><Star className="w-5 h-5 text-yellow-400 fill-current" /></td>}
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                            <td className="px-4 py-3">
                                {doc.building !== 'N/A' && onBuildingClick ? (
                                    <button 
                                        onClick={() => onBuildingClick(doc.building)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {doc.building}
                                    </button>
                                ) : (
                                    <span className={doc.building === 'N/A' ? 'text-gray-400 italic' : ''}>{doc.building}</span>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {doc.unit !== 'N/A' && onUnitClick ? (
                                    <button 
                                        onClick={() => onUnitClick(doc.building, doc.unit)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {doc.unit}
                                    </button>
                                ) : (
                                    <span className={doc.unit === 'N/A' ? 'text-gray-400 italic' : ''}>{doc.unit}</span>
                                )}
                            </td>
                            <td className="px-4 py-3">{doc.type}</td>
                            <td className="px-4 py-3">{doc.uploadDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const OverviewContent: React.FC<{
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
}> = ({ onBuildingClick, onUnitClick }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {DOCUMENT_DASHBOARD_STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Document Type Distribution</h3>
                    <div className="h-80">
                        <DocumentTypeDistributionChart data={DOCUMENT_TYPE_DISTRIBUTION_DATA} />
                    </div>
                </Card>
                <Card>
                    <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Documents Uploaded</h3>
                    <div className="h-80">
                        <DocumentsUploadedChart data={DOCUMENTS_UPLOADED_DATA} />
                    </div>
                </Card>
            </div>
             <div className="lg:col-span-3 space-y-8">
                <DocumentTable 
                    title="Most Recent Documents" 
                    documents={MOST_RECENT_DOCUMENTS}
                    onBuildingClick={onBuildingClick}
                    onUnitClick={onUnitClick}
                />
                <DocumentTable 
                    title="Starred Documents" 
                    documents={STARRED_DOCUMENTS} 
                    showStar
                    onBuildingClick={onBuildingClick}
                    onUnitClick={onUnitClick}
                />
            </div>
        </div>
    </>
);

export const DocumentsDashboard: React.FC<DocumentsDashboardProps> = ({ onBuildingClick, onUnitClick, setViewingTenantId }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isCreatingDocument, setIsCreatingDocument] = useState(false);

    if (isCreatingDocument) {
        return <NewDocumentForm onBack={() => setIsCreatingDocument(false)} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'All Documents':
                return (
                    <AllDocumentsPage 
                        onAddNewDocument={() => setIsCreatingDocument(true)}
                        onBuildingClick={onBuildingClick}
                        onUnitClick={onUnitClick}
                        setViewingTenantId={setViewingTenantId}
                    />
                );
            case 'Overview':
            default:
                return (
                    <OverviewContent 
                        onBuildingClick={onBuildingClick}
                        onUnitClick={onUnitClick}
                    />
                );
        }
    };

    return (
        <div className="container mx-auto">
            <Header
                title="Documents Dashboard"
                tabs={['Overview', 'All Documents']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
            {renderContent()}
        </div>
    );
};