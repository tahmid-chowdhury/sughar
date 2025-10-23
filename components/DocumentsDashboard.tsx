
import React, { useState } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { DOCUMENT_DASHBOARD_STATS, MOST_RECENT_DOCUMENTS, STARRED_DOCUMENTS, DOCUMENT_TYPE_DISTRIBUTION_DATA, DOCUMENTS_UPLOADED_DATA } from '../constants';
import { AppData, Document, DocumentDashboardStat, DocumentType } from '../types';
import { DocumentTypeDistributionChart } from './charts/DocumentTypeDistributionChart';
import { DocumentsUploadedChart } from './charts/DocumentsUploadedChart';
import { AllDocumentsPage } from './AllDocumentsPage';
import { NewDocumentForm } from './NewDocumentForm';
import { DocumentTable } from './DocumentTable';

interface DocumentsDashboardProps {
  onSelectBuilding: (buildingId: string) => void;
  onSelectUnit: (unitId: string) => void;
  appData: AppData;
  onAddDocument: (docData: Omit<Document, 'id' | 'uploadDate'>) => void;
  onUpdateDocumentSharing: (documentId: string, sharedWith: string[]) => void;
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

const OverviewContent: React.FC<{ onSelectBuilding: (id: string) => void; onSelectUnit: (id: string) => void; appData: AppData; }> = ({ onSelectBuilding, onSelectUnit, appData }) => (
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
                <DocumentTable title="Most Recent Documents" documents={MOST_RECENT_DOCUMENTS} onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />
                <DocumentTable title="Starred Documents" documents={STARRED_DOCUMENTS} showStar onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />
            </div>
        </div>
    </>
);

export const DocumentsDashboard: React.FC<DocumentsDashboardProps> = ({ onSelectBuilding, onSelectUnit, appData, onAddDocument, onUpdateDocumentSharing }) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isCreatingDocument, setIsCreatingDocument] = useState(false);

    if (isCreatingDocument) {
        return <NewDocumentForm onBack={() => setIsCreatingDocument(false)} onAddDocument={onAddDocument} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'All Documents':
                return <AllDocumentsPage onAddNewDocument={() => setIsCreatingDocument(true)} onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} onUpdateDocumentSharing={onUpdateDocumentSharing} />;
            case 'Overview':
            default:
                return <OverviewContent onSelectBuilding={onSelectBuilding} onSelectUnit={onSelectUnit} appData={appData} />;
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
