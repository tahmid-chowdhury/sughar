import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { FinancialsDashboard } from './components/FinancialsDashboard';
import { BuildingsPage } from './components/BuildingsUnitsDashboard';
import { NewBuildingForm } from './components/NewBuildingForm';
import { NewUnitForm } from './components/NewUnitForm';
import { SpecificBuildingPage } from './components/SpecificBuildingPage';
import { ServiceRequestsPage } from './components/ServiceRequestsPage';
import { TenantsDashboard } from './components/TenantsDashboard';
import { DocumentsDashboard } from './components/DocumentsDashboard';
import { HomeDashboard } from './components/HomeDashboard';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AccountOverviewPage } from './components/AccountOverviewPage';
import { SettingsPage } from './components/SettingsPage';
import { TenantDetailPage } from './components/TenantDetailPage';
import { SpecificUnitPage } from './components/SpecificUnitPage';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null);
  const [viewingBuildingId, setViewingBuildingId] = useState<string | null>(null);
  const [viewingUnitId, setViewingUnitId] = useState<string | null>(null);
  const [showNewBuildingForm, setShowNewBuildingForm] = useState(false);
  const [showNewUnitForm, setShowNewUnitForm] = useState(false);
  const [tenantsInitialTab, setTenantsInitialTab] = useState('Overview');

  // Custom navigation function to handle tab-specific navigation
  const handlePageNavigation = (page: string, options?: { tab?: string }) => {
    setCurrentPage(page);
    if (page === 'tenants' && options?.tab) {
      setTenantsInitialTab(options.tab);
    } else if (page === 'tenants' && !options?.tab) {
      setTenantsInitialTab('Overview'); // Reset to overview when navigating normally
    } else if (page !== 'tenants') {
      setTenantsInitialTab('Overview'); // Reset tab when navigating away from tenants
    }
  };

  // Wrapper for regular page navigation that also resets tabs
  const handleRegularNavigation = (page: string) => {
    handlePageNavigation(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={handleRegularNavigation}>
      {viewingTenantId ? (
        <TenantDetailPage tenantId={viewingTenantId} onBack={() => setViewingTenantId(null)} />
      ) : viewingUnitId ? (
        <SpecificUnitPage 
          unitId={viewingUnitId} 
          onBack={() => setViewingUnitId(null)}
          setViewingTenantId={setViewingTenantId}
        />
      ) : (
        <>
          {currentPage === 'home' && <HomeDashboard setViewingTenantId={setViewingTenantId} setCurrentPage={handleRegularNavigation} handlePageNavigation={handlePageNavigation} />}
          {currentPage === 'financials' && <FinancialsDashboard />}
          {currentPage === 'buildings' && !viewingBuildingId && !showNewBuildingForm && !showNewUnitForm && (
            <BuildingsPage 
              setViewingTenantId={setViewingTenantId}
              onBuildingClick={(id: string) => setViewingBuildingId(id)} 
              onAddNewBuilding={() => setShowNewBuildingForm(true)}
              onAddNewUnit={() => setShowNewUnitForm(true)} 
            />
          )}
          {currentPage === 'buildings' && viewingBuildingId && (
            <SpecificBuildingPage 
              buildingId={viewingBuildingId}
              onBack={() => setViewingBuildingId(null)}
              setViewingTenantId={setViewingTenantId}
              onUnitClick={setViewingUnitId}
            />
          )}
          {currentPage === 'buildings' && showNewBuildingForm && (
            <NewBuildingForm onBack={() => setShowNewBuildingForm(false)} />
          )}
          {currentPage === 'buildings' && showNewUnitForm && (
            <NewUnitForm onBack={() => setShowNewUnitForm(false)} />
          )}
          {currentPage === 'service-requests' && (
            <ServiceRequestsPage 
              onBuildingClick={(id: string) => {
                setViewingBuildingId(id);
                setCurrentPage('buildings');
              }}
              onUnitClick={(buildingId: string, unitId: number) => {
                setViewingUnitId(`U${unitId.toString().padStart(3, '0')}`);
              }}
              setViewingTenantId={setViewingTenantId}
            />
          )}
          {currentPage === 'tenants' && (
            <TenantsDashboard 
              setViewingTenantId={setViewingTenantId}
              initialTab={tenantsInitialTab}
            />
          )}
          {currentPage === 'documents' && (
            <DocumentsDashboard 
              onBuildingClick={(id: string) => {
                setViewingBuildingId(id);
                handleRegularNavigation('buildings');
              }}
              onUnitClick={(buildingId: string, unitId: string) => {
                setViewingUnitId(unitId);
                handleRegularNavigation('buildings');
              }}
              setViewingTenantId={setViewingTenantId}
            />
          )}
          {currentPage === 'account' && <AccountOverviewPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </>
      )}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;