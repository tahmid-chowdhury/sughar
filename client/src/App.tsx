
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeDashboard } from './components/HomeDashboard';
import { FinancialsDashboard } from './components/FinancialsDashboard';
import { BuildingsUnitsDashboard } from './components/BuildingsUnitsDashboard';
import { ServiceRequestsPage } from './components/ServiceRequestsPage';
import { TenantsDashboard } from './components/TenantsDashboard';
import { DocumentsDashboard } from './components/DocumentsDashboard';
import { SettingsPage } from './components/SettingsPage';
import { AccountOverviewPage } from './components/AccountOverviewPage';
import { SpecificBuildingPage } from './components/SpecificBuildingPage';
import { SpecificUnitPage } from './components/SpecificUnitPage';
import { TenantDetailPage } from './components/TenantDetailPage';
import { SpecificServiceRequestPage } from './components/SpecificServiceRequestPage';
import { LeasesEndingSoonPage } from './components/LeasesEndingSoonPage';
import { LeasesExpiredPage } from './components/LeasesExpiredPage';
// import { SpecificApplicantPage } from './components/SpecificApplicantPage';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { AppData, BuildingDetail, Document, UnitDetail, User, UnitStatus, RentalApplication, ApplicationStatus } from './types';
import { INITIAL_APP_DATA } from './data';

const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData>(INITIAL_APP_DATA);
  const [currentPage, setCurrentPage] = useState('login'); // Start with login page
  const [targetTab, setTargetTab] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [viewingBuildingId, setViewingBuildingId] = useState<string | null>(null);
  const [viewingUnitId, setViewingUnitId] = useState<string | null>(null);
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null);
  const [viewingServiceRequestId, setViewingServiceRequestId] = useState<string | null>(null);
  // FIX: Removed state for missing SpecificApplicantPage feature
  // const [viewingApplicantId, setViewingApplicantId] = useState<string | null>(null);


  const handleLogin = (email: string, password: string): boolean => {
    const user = appData.users.find(u => u.email === email && u.password === password);
    if (user) {
        setCurrentUser(user);
        setCurrentPage('home');
        return true;
    }
    return false;
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentPage('login');
  };

  const handleNavigate = (page: string, tab?: string) => {
      resetViews();
      setCurrentPage(page);
      setTargetTab(tab);
  };
  
  const handleSelectBuilding = (buildingId: string) => {
    setViewingBuildingId(buildingId);
    setCurrentPage('specific-building');
  };

  const handleSelectUnit = (unitId: string) => {
    setViewingUnitId(unitId);
    setCurrentPage('specific-unit');
  };
  
  const handleSetViewingTenantId = (tenantId: string) => {
      setViewingTenantId(tenantId);
      setCurrentPage('tenant-detail');
  };

  const handleSelectServiceRequest = (requestId: string) => {
    setViewingServiceRequestId(requestId);
    setCurrentPage('specific-service-request');
  };
  
  /* FIX: Commented out handler for missing SpecificApplicantPage feature
  const handleSelectApplicant = (applicantUserId: string) => {
      setViewingApplicantId(applicantUserId);
      setCurrentPage('applicant-detail');
  }
  */

  const resetViews = () => {
    setViewingBuildingId(null);
    setViewingUnitId(null);
    setViewingTenantId(null);
    setViewingServiceRequestId(null);
    // setViewingApplicantId(null);
    setTargetTab(undefined);
  };

  const handleBackTo = (page: string) => {
      resetViews();
      setCurrentPage(page);
  }

  const handleAddBuilding = (buildingData: Omit<BuildingDetail, 'id' | 'vacantUnits' | 'requests' | 'occupation' | 'rentCollection' | 'contact'> & { totalUnits: number }) => {
     setAppData(prevData => {
         const newBuilding: BuildingDetail = {
             ...buildingData,
             id: `B-NEW-${Math.random().toString(36).substr(2, 5)}`,
             vacantUnits: buildingData.totalUnits,
             requests: 0,
             occupation: 0,
             rentCollection: 100, // Default value
             contact: { name: 'Unassigned', avatar: `https://i.pravatar.cc/40?u=unassigned` },
         };
         return { ...prevData, buildings: [...prevData.buildings, newBuilding] };
     });
  };
  
  const handleAddUnit = (unitData: Omit<UnitDetail, 'id' | 'status' | 'currentTenantId' | 'previousTenantId'| 'rentStatus' | 'leaseStartDate' | 'leaseEndDate' | 'requests'>) => {
      setAppData(prevData => {
          const newUnit: UnitDetail = {
              ...unitData,
              id: `U-NEW-${Math.random().toString(36).substr(2, 5)}`,
              status: UnitStatus.Vacant,
              currentTenantId: null,
              previousTenantId: null,
              rentStatus: null,
              leaseStartDate: null,
              leaseEndDate: null,
              requests: 0,
          };
          return { ...prevData, units: [...prevData.units, newUnit] };
      });
  };

  const handleAddDocument = (docData: Omit<Document, 'id' | 'uploadDate'>) => {
       setAppData(prevData => {
          const newDoc: Document = {
              ...docData,
              id: `DOC-NEW-${Math.random().toString(36).substr(2, 5)}`,
              uploadDate: new Date().toISOString().split('T')[0],
          };
          return { ...prevData, documents: [...prevData.documents, newDoc] };
      });
  };
  
   const handleUpdateApplicationStatus = (applicantUserId: string, status: ApplicationStatus) => {
    setAppData(prevData => {
      const updatedApplications = prevData.rentalApplications.map(app => 
        app.userId === applicantUserId ? { ...app, status } : app
      );
      return { ...prevData, rentalApplications: updatedApplications };
    });
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeDashboard setViewingTenantId={handleSetViewingTenantId} currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
      case 'financials':
        return <FinancialsDashboard onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} />;
      case 'buildings':
        return <BuildingsUnitsDashboard setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} onAddBuilding={handleAddBuilding} onAddUnit={handleAddUnit} />;
      case 'service-requests':
        return <ServiceRequestsPage onSelectBuilding={handleSelectBuilding} onSelectServiceRequest={handleSelectServiceRequest} appData={appData} />;
      case 'tenants':
        return <TenantsDashboard initialTab={targetTab} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} />;
      case 'documents':
        return <DocumentsDashboard onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} onAddDocument={handleAddDocument} />;
      case 'settings':
        return <SettingsPage />;
      case 'account':
        return <AccountOverviewPage />;
      case 'specific-building':
        return viewingBuildingId && <SpecificBuildingPage buildingId={viewingBuildingId} appData={appData} onBack={() => handleBackTo('buildings')} onSelectUnit={handleSelectUnit} setViewingTenantId={handleSetViewingTenantId} />;
      case 'specific-unit':
        return viewingUnitId && <SpecificUnitPage unitId={viewingUnitId} appData={appData} setAppData={setAppData} onBack={() => handleBackTo('buildings')} setViewingTenantId={handleSetViewingTenantId} />;
      case 'tenant-detail':
        return viewingTenantId && <TenantDetailPage tenantId={viewingTenantId} appData={appData} onBack={() => handleBackTo('tenants')} />;
      /* FIX: Commented out case for missing SpecificApplicantPage feature
      case 'applicant-detail':
        return viewingApplicantId && <SpecificApplicantPage applicantUserId={viewingApplicantId} appData={appData} onBack={() => handleBackTo('tenants')} onUpdateStatus={handleUpdateApplicationStatus} />;
      */
      case 'specific-service-request':
        return viewingServiceRequestId && <SpecificServiceRequestPage serviceRequestId={viewingServiceRequestId} appData={appData} onBack={() => handleBackTo('service-requests')} />;
      case 'leases-ending-soon':
        return <LeasesEndingSoonPage appData={appData} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} />;
      case 'leases-expired':
        return <LeasesExpiredPage appData={appData} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomeDashboard setViewingTenantId={handleSetViewingTenantId} currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
    }
  };

  if (currentPage === 'login' || currentPage === 'signup') {
      return renderPage();
  }

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
