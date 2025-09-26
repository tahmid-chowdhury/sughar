import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { FinancialsDashboard } from './components/FinancialsDashboard';
import { BuildingsPage } from './components/BuildingsUnitsDashboard';
import { ServiceRequestsPage } from './components/ServiceRequestsPage';
import { TenantsDashboard } from './components/TenantsDashboard';
import { DocumentsDashboard } from './components/DocumentsDashboard';
import { HomeDashboard } from './components/HomeDashboard';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AccountOverviewPage } from './components/AccountOverviewPage';
import { SettingsPage } from './components/SettingsPage';
import { TenantDetailPage } from './components/TenantDetailPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null);

  if (currentPage === 'login') {
    return <LoginPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'signup') {
    return <SignUpPage setCurrentPage={setCurrentPage} />;
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {viewingTenantId ? (
        <TenantDetailPage tenantId={viewingTenantId} onBack={() => setViewingTenantId(null)} />
      ) : (
        <>
          {currentPage === 'home' && <HomeDashboard setViewingTenantId={setViewingTenantId} />}
          {currentPage === 'financials' && <FinancialsDashboard />}
          {currentPage === 'buildings' && (
            <BuildingsPage 
              onBuildingClick={() => {}} 
              onAddNewBuilding={() => {}} 
            />
          )}
          {currentPage === 'service-requests' && <ServiceRequestsPage />}
          {currentPage === 'tenants' && <TenantsDashboard setViewingTenantId={setViewingTenantId} />}
          {currentPage === 'documents' && <DocumentsDashboard />}
          {currentPage === 'account' && <AccountOverviewPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </>
      )}
    </Layout>
  );
}

export default App;