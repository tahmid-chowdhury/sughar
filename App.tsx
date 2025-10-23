/**
 * SuGhar Property Management Application
 * 
 * This is the root component that manages all application state and routing.
 * The app is built with React + TypeScript and uses a single-page application (SPA) architecture.
 * 
 * Key Features:
 * - User authentication (demo mode with in-memory users)
 * - Property/building management
 * - Unit tracking and tenant management
 * - Service request handling
 * - Document management
 * - Financial tracking
 * 
 * Architecture:
 * - All state is managed at the root level and passed down via props
 * - Navigation is handled through a simple page state system
 * - Data is stored in-memory (would be replaced with API calls in production)
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { HomeDashboard } from './components/HomeDashboard';
import { TenantHomeDashboard } from './components/TenantHomeDashboard';
import { TenantPaymentsPage } from './components/TenantPaymentsPage';
import { TenantPaymentPage } from './components/TenantPaymentPage';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { TenantDocumentsPage } from './components/TenantDocumentsPage';
import { FinancialsDashboard } from './components/FinancialsDashboard';
import { BuildingsUnitsDashboard } from './components/BuildingsUnitsDashboard';
import { ServiceRequestsPage } from './components/ServiceRequestsPage';
import { TenantServiceRequestsPage } from './components/TenantServiceRequestsPage';
import { TenantsDashboard } from './components/TenantsDashboard';
import { DocumentsDashboard } from './components/DocumentsDashboard';
import { SettingsPage } from './components/SettingsPage';
import { AccountOverviewPage } from './components/AccountOverviewPage';
import { SpecificBuildingPage } from './components/SpecificBuildingPage';
import { SpecificUnitPage } from './components/SpecificUnitPage';
import { TenantDetailPage } from './components/TenantDetailPage';
import { SpecificServiceRequestPage } from './components/SpecificServiceRequestPage';
import { EnhancedServiceRequestPage } from './components/EnhancedServiceRequestPage';
import { LeasesEndingSoonPage } from './components/LeasesEndingSoonPage';
import { LeasesExpiredPage } from './components/LeasesExpiredPage';
// import { SpecificApplicantPage } from './components/SpecificApplicantPage';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { PropertyGroupSelectionPage } from './components/PropertyGroupSelectionPage';
import { ListingsPlatform } from './components/ListingsPlatform';
import { AppData as BaseAppData, BuildingDetail, Document, UnitDetail, User, UserRole, UnitStatus, RentalApplication, ApplicationStatus, ServiceRequest, RequestStatus, ActivityLogItem, ActivityLogType, ServiceRequestComment, ServiceRequestMedia, Contractor } from './types';
import { PropertyListing } from './types/listing';

// Extend AppData to use the correct PropertyListing type
interface AppData extends Omit<BaseAppData, 'propertyListings'> {
  propertyListings: PropertyListing[];
}
import { INITIAL_APP_DATA } from './data';

/**
 * Main App component that manages all application state and routing
 */
const App: React.FC = () => {
  // ============ State Management ============
  
  /** Core application data containing all buildings, units, tenants, etc. */
  const [appData, setAppData] = useState<AppData>(INITIAL_APP_DATA);
  
  /** Current page being displayed (used for simple routing) */
  const [currentPage, setCurrentPage] = useState('login');
  
  /** Optional tab to open when navigating to a page with multiple tabs */
  const [targetTab, setTargetTab] = useState<string | undefined>(undefined);
  
  /** Currently logged-in user (null if not authenticated) */
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  /** Selected property group ID */
  const [selectedPropertyGroupId, setSelectedPropertyGroupId] = useState<string | null>(null);
  
  /** User's active role in the selected property group */
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  // ============ Detail View State ============
  // These track which specific item is being viewed on detail pages
  
  /** ID of building currently being viewed in detail */
  const [viewingBuildingId, setViewingBuildingId] = useState<string | null>(null);
  
  /** ID of unit currently being viewed in detail */
  const [viewingUnitId, setViewingUnitId] = useState<string | null>(null);
  
  /** ID of tenant currently being viewed in detail */
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null);
  
  /** ID of service request currently being viewed in detail */
  const [viewingServiceRequestId, setViewingServiceRequestId] = useState<string | null>(null);
  
  /** Payment transaction data for success page */
  const [paymentData, setPaymentData] = useState<{ orderId: string; amount: number; date: string } | null>(null);
  
  // FIX: Removed state for missing SpecificApplicantPage feature
  // const [viewingApplicantId, setViewingApplicantId] = useState<string | null>(null);


  // ============ Authentication Handlers ============
  
  /**
   * Handles user login by validating credentials
   * @param email - User's email address
   * @param password - User's password
   * @returns true if login successful, false otherwise
   * @note In production, this should call a secure authentication API
   */
  const handleLogin = (email: string, password: string): boolean => {
    const user = appData.users.find(u => u.email === email && u.password === password);
    if (user) {
        setCurrentUser(user);
        // Check if user has multiple property groups
        const hasMultipleGroups = user.propertyGroupRoles && user.propertyGroupRoles.length > 1;
        if (hasMultipleGroups) {
            setCurrentPage('property-group-selection');
        } else if (user.propertyGroupRoles && user.propertyGroupRoles.length === 1) {
            // Auto-select the only group
            const singleGroup = user.propertyGroupRoles[0];
            setSelectedPropertyGroupId(singleGroup.groupId);
            setActiveRole(singleGroup.role);
            setCurrentPage('home');
        } else {
            // No property groups, use default role
            setActiveRole(user.role);
            setCurrentPage('home');
        }
        return true;
    }
    return false;
  };
  
  /**
   * Handles property group selection
   */
  const handleSelectPropertyGroup = (groupId: string, role: UserRole) => {
    setSelectedPropertyGroupId(groupId);
    setActiveRole(role);
    setCurrentPage('home');
  };
  
  /**
   * Logs out the current user and returns to login page
   */
  const handleLogout = () => {
      setCurrentUser(null);
      setSelectedPropertyGroupId(null);
      setActiveRole(null);
      setCurrentPage('login');
  };

  // ============ Navigation Handlers ============
  
  /**
   * Navigates to a different page in the app
   * @param page - Page identifier to navigate to
   * @param tab - Optional tab to open on the destination page
   */
  const handleNavigate = (page: string, tab?: string) => {
      resetViews();
      setCurrentPage(page);
      setTargetTab(tab);
  };
  
  /**
   * Navigates to the detail view of a specific building
   * @param buildingId - ID of the building to view
   */
  const handleSelectBuilding = (buildingId: string) => {
    setViewingBuildingId(buildingId);
    setCurrentPage('specific-building');
  };

  /**
   * Navigates to the detail view of a specific unit
   * @param unitId - ID of the unit to view
   */
  const handleSelectUnit = (unitId: string) => {
    setViewingUnitId(unitId);
    setCurrentPage('specific-unit');
  };
  
  /**
   * Navigates to the detail view of a specific tenant
   * @param tenantId - ID of the tenant to view
   */
  const handleSetViewingTenantId = (tenantId: string) => {
      setViewingTenantId(tenantId);
      setCurrentPage('tenant-detail');
  };

  /**
   * Navigates to the detail view of a specific service request
   * @param requestId - ID of the service request to view
   */
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

  /**
   * Resets all detail view states (clears selected items)
   * Used when navigating away from detail pages
   */
  const resetViews = () => {
    setViewingBuildingId(null);
    setViewingUnitId(null);
    setViewingTenantId(null);
    setViewingServiceRequestId(null);
    // setViewingApplicantId(null);
    setTargetTab(undefined);
  };

  /**
   * Navigates back to a parent page and resets detail views
   * @param page - Page identifier to navigate back to
   */
  const handleBackTo = (page: string) => {
      resetViews();
      setCurrentPage(page);
  }

  // ============ Data Mutation Handlers ============
  
  /**
   * Adds a new building to the portfolio
   * @param buildingData - Building information (auto-generates ID and defaults)
   */
  const handleAddBuilding = (buildingData: Omit<BuildingDetail, 'id' | 'vacantUnits' | 'requests' | 'occupation' | 'rentCollection' | 'contact'> & { totalUnits: number }) => {
     setAppData(prevData => {
         const newBuilding: BuildingDetail = {
             ...buildingData,
             id: `B-NEW-${Math.random().toString(36).substr(2, 5)}`,
             vacantUnits: buildingData.totalUnits, // All units start as vacant
             requests: 0,
             occupation: 0,
             rentCollection: 100, // Default to 100% collection rate
             contact: { name: 'Unassigned', avatar: `https://i.pravatar.cc/40?u=unassigned` },
         };
         return { ...prevData, buildings: [...prevData.buildings, newBuilding] };
     });
  };
  
  /**
   * Adds a new unit to a building
   * @param unitData - Unit information (auto-generates ID and sets initial vacant status)
   */
  const handleAddUnit = (unitData: Omit<UnitDetail, 'id' | 'status' | 'currentTenantId' | 'previousTenantId'| 'rentStatus' | 'leaseStartDate' | 'leaseEndDate' | 'requests'>) => {
      setAppData(prevData => {
          const newUnit: UnitDetail = {
              ...unitData,
              id: `U-NEW-${Math.random().toString(36).substr(2, 5)}`,
              status: UnitStatus.Vacant, // New units start as vacant
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

  /**
   * Adds a new document to the system
   * @param docData - Document information (auto-generates ID and upload date)
   */
  const handleAddDocument = (docData: Omit<Document, 'id' | 'uploadDate'>) => {
       setAppData(prevData => {
          const newDoc: Document = {
              ...docData,
              id: `DOC-${prevData.documents.length + 1}`,
              uploadDate: new Date().toLocaleDateString(),
          };
          return { ...prevData, documents: [...prevData.documents, newDoc] };
      });
  };

  /**
   * Adds a new service request to the system
   * @param requestData - Service request information (auto-generates ID and date)
   */
  const handleAddServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'requestDate' | 'status' | 'assignedContact'>) => {
      setAppData(prevData => {
          const newRequestId = `SR-${String(prevData.serviceRequests.length + 1).padStart(4, '0')}`;
          const requestDate = new Date().toISOString();
          
          const newRequest: ServiceRequest = {
              ...requestData,
              id: newRequestId,
              requestDate: requestDate,
              status: RequestStatus.Pending,
              assignedContact: undefined, // No contact assigned initially
              viewedByLandlord: false,
              comments: [],
          };
          
          // Create activity log for new request
          const activityLog: ActivityLogItem = {
              id: `AL-${newRequestId}-1`,
              type: ActivityLogType.Created,
              title: 'Service Request Created',
              timestamp: requestDate,
              description: 'New service request submitted by tenant',
              userId: requestData.tenantId,
              userName: appData.tenants.find(t => t.id === requestData.tenantId)?.name || 'Tenant',
              relatedEntityId: newRequestId,
              relatedEntityType: 'ServiceRequest',
          };
          
          return { 
              ...prevData, 
              serviceRequests: [...prevData.serviceRequests, newRequest],
              activityLogs: [...prevData.activityLogs, activityLog],
          };
      });
  };

  /**
   * Updates the status of a rental application (approve/deny)
   * @param applicantUserId - ID of the applicant user
   * @param status - New status to set (Approved, Denied, or Pending)
   */
   const handleUpdateApplicationStatus = (applicantUserId: string, status: ApplicationStatus) => {
    setAppData(prevData => {
      const updatedApplications = prevData.rentalApplications.map(app => 
        app.userId === applicantUserId ? { ...app, status } : app
      );
      return { ...prevData, rentalApplications: updatedApplications };
    });
  };

  /**
   * Adds a comment to a service request
   */
  const handleAddComment = (serviceRequestId: string, comment: ServiceRequestComment) => {
    setAppData(prevData => {
      const updatedRequests = prevData.serviceRequests.map(req => {
        if (req.id === serviceRequestId) {
          return {
            ...req,
            comments: [...(req.comments || []), comment],
          };
        }
        return req;
      });
      
      // Add activity log
      const activityLog: ActivityLogItem = {
        id: `AL-${serviceRequestId}-${Date.now()}`,
        type: ActivityLogType.CommentAdded,
        title: 'Comment Added',
        timestamp: comment.timestamp,
        description: `${comment.userName} added a comment`,
        userId: comment.userId,
        userName: comment.userName,
        relatedEntityId: serviceRequestId,
        relatedEntityType: 'ServiceRequest',
      };
      
      return {
        ...prevData,
        serviceRequests: updatedRequests,
        activityLogs: [...prevData.activityLogs, activityLog],
      };
    });
  };

  /**
   * Adds media to a service request
   */
  const handleAddMedia = (serviceRequestId: string, media: ServiceRequestMedia[]) => {
    setAppData(prevData => {
      const updatedRequests = prevData.serviceRequests.map(req => {
        if (req.id === serviceRequestId) {
          return {
            ...req,
            media: [...(req.media || []), ...media],
          };
        }
        return req;
      });
      
      // Add activity log
      const activityLog: ActivityLogItem = {
        id: `AL-${serviceRequestId}-media-${Date.now()}`,
        type: ActivityLogType.MediaUploaded,
        title: 'Media Uploaded',
        timestamp: new Date().toISOString(),
        description: `${media.length} file(s) uploaded`,
        relatedEntityId: serviceRequestId,
        relatedEntityType: 'ServiceRequest',
      };
      
      return {
        ...prevData,
        serviceRequests: updatedRequests,
        activityLogs: [...prevData.activityLogs, activityLog],
      };
    });
  };

  /**
   * Assigns a contractor to a service request (by contractor ID)
   */
  const handleAssignContractorById = (serviceRequestId: string, contractorId: string) => {
    const contractor = appData.contractors.find(c => c.id === contractorId);
    if (!contractor) return;
    handleAssignContractor(serviceRequestId, contractor);
  };

  /**
   * Assigns a contractor to a service request
   */
  const handleAssignContractor = (serviceRequestId: string, contractor: Contractor) => {
    setAppData(prevData => {
      const updatedRequests = prevData.serviceRequests.map(req => {
        if (req.id === serviceRequestId) {
          return {
            ...req,
            assignedContractor: {
              id: contractor.id,
              name: contractor.name,
              avatar: contractor.avatar,
              rating: contractor.rating,
            },
            status: RequestStatus.InProgress, // Auto-update status
          };
        }
        return req;
      });
      
      // Add activity log for contractor assignment
      const activityLog: ActivityLogItem = {
        id: `AL-${serviceRequestId}-contractor-${Date.now()}`,
        type: ActivityLogType.ContractorAssigned,
        title: 'Contractor Assigned',
        timestamp: new Date().toISOString(),
        description: `${contractor.name} assigned to this request`,
        userId: currentUser?.id,
        userName: currentUser?.name || 'Landlord',
        relatedEntityId: serviceRequestId,
        relatedEntityType: 'ServiceRequest',
      };
      
      // Add status change activity log
      const statusLog: ActivityLogItem = {
        id: `AL-${serviceRequestId}-status-${Date.now()}`,
        type: ActivityLogType.StatusChanged,
        title: 'Status Changed to In Progress',
        timestamp: new Date().toISOString(),
        description: 'Status automatically updated when contractor was assigned',
        userId: currentUser?.id,
        userName: currentUser?.name || 'System',
        relatedEntityId: serviceRequestId,
        relatedEntityType: 'ServiceRequest',
      };
      
      return {
        ...prevData,
        serviceRequests: updatedRequests,
        activityLogs: [...prevData.activityLogs, activityLog, statusLog],
      };
    });
  };

  /**
   * Marks a service request as viewed by landlord
   */
  const handleMarkAsViewed = (serviceRequestId: string) => {
    setAppData(prevData => {
      const request = prevData.serviceRequests.find(req => req.id === serviceRequestId);
      if (!request || request.viewedByLandlord) return prevData; // Already viewed
      
      const updatedRequests = prevData.serviceRequests.map(req => {
        if (req.id === serviceRequestId) {
          return {
            ...req,
            viewedByLandlord: true,
            viewedAt: new Date().toISOString(),
          };
        }
        return req;
      });
      
      // Add activity log
      const activityLog: ActivityLogItem = {
        id: `AL-${serviceRequestId}-viewed-${Date.now()}`,
        type: ActivityLogType.Viewed,
        title: 'Viewed by Landlord',
        timestamp: new Date().toISOString(),
        description: `${currentUser?.name || 'Landlord'} viewed this request`,
        userId: currentUser?.id,
        userName: currentUser?.name || 'Landlord',
        relatedEntityId: serviceRequestId,
        relatedEntityType: 'ServiceRequest',
      };
      
      return {
        ...prevData,
        serviceRequests: updatedRequests,
        activityLogs: [...prevData.activityLogs, activityLog],
      };
    });
  };

  /**
   * Creates a property listing from a unit
   */
  const handleCreateListing = (listing: PropertyListing) => {
    setAppData(prevData => ({
      ...prevData,
      propertyListings: [...prevData.propertyListings, listing],
    }));
  };

  /**
   * Updates document sharing
   */
  const handleUpdateDocumentSharing = (documentId: string, sharedWith: string[]) => {
    setAppData(prevData => {
      const updatedDocuments = prevData.documents.map(doc => 
        doc.id === documentId ? { ...doc, sharedWith } : doc
      );
      return { ...prevData, documents: updatedDocuments };
    });
  };


  // ============ Page Rendering ============
  
  /**
   * Renders the appropriate page component based on currentPage state and user role
   * This implements a simple client-side routing system with role-based access
   * @returns The React component for the current page
   */
  const renderPage = () => {
    const isTenant = currentUser?.role === UserRole.Tenant;
    
    switch (currentPage) {
      case 'home':
        // Show tenant-specific dashboard for tenants
        if (isTenant && currentUser) {
          return <TenantHomeDashboard currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
        }
        return <HomeDashboard setViewingTenantId={handleSetViewingTenantId} currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
      case 'financials':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return <FinancialsDashboard onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} />;
      case 'buildings':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return <BuildingsUnitsDashboard setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} onAddBuilding={handleAddBuilding} onAddUnit={handleAddUnit} />;
      case 'payments':
        // Tenant-only payments page
        if (isTenant && currentUser) {
          return <TenantPaymentsPage currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
        }
        // Redirect landlords to financials or show access denied
        return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
      case 'make-payment':
        // Tenant-only payment processing page
        if (isTenant && currentUser) {
          const handlePaymentSuccess = () => {
            // Generate payment data
            const orderId = `SUG-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
            const tenantUnit = tenantProfile ? appData.units.find(u => u.currentTenantId === tenantProfile.id) : undefined;
            const amount = (tenantUnit?.monthlyRent || 25000) + 3500;
            const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            setPaymentData({ orderId, amount, date });
            setCurrentPage('payment-success');
          };
          
          return <TenantPaymentPage currentUser={currentUser} appData={appData} onBack={() => handleBackTo('payments')} onPaymentSuccess={handlePaymentSuccess} />;
        }
        return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
      case 'payment-success':
        // Payment success confirmation page
        if (isTenant && paymentData) {
          return <PaymentSuccessPage orderId={paymentData.orderId} amountPaid={paymentData.amount} paymentDate={paymentData.date} onReturnToHub={() => handleBackTo('payments')} />;
        }
        return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
      case 'service-requests':
        // Show tenant-specific service requests page for tenants
        if (isTenant && currentUser) {
          return <TenantServiceRequestsPage currentUser={currentUser} onSelectServiceRequest={handleSelectServiceRequest} appData={appData} onAddServiceRequest={handleAddServiceRequest} />;
        }
        return <ServiceRequestsPage onSelectBuilding={handleSelectBuilding} onSelectServiceRequest={handleSelectServiceRequest} appData={appData} />;
      case 'tenants':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return <TenantsDashboard initialTab={targetTab} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} />;
      case 'documents':
        // Show tenant-specific documents page for tenants
        if (isTenant && currentUser) {
          return <TenantDocumentsPage currentUser={currentUser} appData={appData} />;
        }
        // Landlords see full documents dashboard
        return <DocumentsDashboard onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} appData={appData} onAddDocument={handleAddDocument} onUpdateDocumentSharing={handleUpdateDocumentSharing} />;
      case 'settings':
        return <SettingsPage />;
      case 'account':
        return <AccountOverviewPage />;
      case 'specific-building':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return viewingBuildingId && <SpecificBuildingPage buildingId={viewingBuildingId} appData={appData} onBack={() => handleBackTo('buildings')} onSelectUnit={handleSelectUnit} setViewingTenantId={handleSetViewingTenantId} />;
      case 'specific-unit':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return viewingUnitId && <SpecificUnitPage unitId={viewingUnitId} appData={appData} setAppData={setAppData} onBack={() => handleBackTo('buildings')} setViewingTenantId={handleSetViewingTenantId} />;
      case 'tenant-detail':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return viewingTenantId && <TenantDetailPage tenantId={viewingTenantId} appData={appData} onBack={() => handleBackTo('tenants')} />;
      /* FIX: Commented out case for missing SpecificApplicantPage feature
      case 'applicant-detail':
        return viewingApplicantId && <SpecificApplicantPage applicantUserId={viewingApplicantId} appData={appData} onBack={() => handleBackTo('tenants')} onUpdateStatus={handleUpdateApplicationStatus} />;
      */
      case 'specific-service-request':
        return viewingServiceRequestId && <EnhancedServiceRequestPage 
          serviceRequestId={viewingServiceRequestId} 
          appData={appData} 
          onBack={() => handleBackTo('service-requests')} 
          currentUser={currentUser || undefined}
          onAddComment={handleAddComment}
          onAddMedia={handleAddMedia}
          onAssignContractor={handleAssignContractorById}
          onMarkAsViewed={handleMarkAsViewed}
        />;
      case 'leases-ending-soon':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return <LeasesEndingSoonPage appData={appData} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} />;
      case 'leases-expired':
        // Landlord-only page
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return <LeasesExpiredPage appData={appData} setViewingTenantId={handleSetViewingTenantId} onSelectBuilding={handleSelectBuilding} onSelectUnit={handleSelectUnit} />;
      case 'listings':
        // Landlord-only page for property listings
        if (isTenant) return <div className="container mx-auto text-center p-8"><h2 className="text-2xl text-text-secondary">Access Denied</h2></div>;
        return (
          <ListingsPlatform 
            isInternal={true}
            listings={appData.propertyListings || []}
            onAddListing={() => { /* TODO: Implement add listing navigation */ }}
            onEditListing={(id) => { /* TODO: Implement edit listing navigation */ }}
            onToggleVisibility={(id) => { /* TODO: Implement toggle visibility */ }}
            appData={appData}
            onCreateListing={handleCreateListing}
            onSelectUnit={handleSelectUnit}
          />
        );
      case 'property-group-selection':
        return currentUser && <PropertyGroupSelectionPage currentUser={currentUser} appData={appData} onSelectGroup={handleSelectPropertyGroup} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      default:
        if (isTenant && currentUser) {
          return <TenantHomeDashboard currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
        }
        return <HomeDashboard setViewingTenantId={handleSetViewingTenantId} currentUser={currentUser} appData={appData} onNavigate={handleNavigate} />;
    }
  };

  // ============ Root Render ============
  
  // If user is not authenticated or selecting property group, show pages without Layout
  if (currentPage === 'login' || currentPage === 'signup' || currentPage === 'property-group-selection') {
      return renderPage();
  }

  // For authenticated users, wrap content in the main Layout (with sidebar, header, etc.)
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
