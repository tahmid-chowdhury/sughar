# Tenant Portal Implementation Guide

## Overview
The SuGhar application now includes a complete tenant-side portal with role-based access control. Tenants see a simplified, customized interface focused on their rental unit and service requests.

## Changes Made

### 1. User Role System
- **Added `UserRole` enum** to `types.ts`:
  - `Landlord` - Property managers/owners
  - `Tenant` - Current renters
  - `Applicant` - Prospective tenants
- **Updated `User` interface** to include required `role` field

### 2. Data Generation
- **Updated `data.ts`**:
  - All existing users assigned `Landlord` role
  - Created user accounts for all 27 tenants with `Tenant` role
  - Email format: `firstname.lastname@email.com`
  - Default password for all tenant accounts: `tenant123`
  - Applicants assigned `Applicant` role

### 3. Tenant Dashboard Pages

#### TenantHomeDashboard (`components/TenantHomeDashboard.tsx`)
Personalized dashboard showing:
- **Key Stats Cards**:
  - Monthly Rent amount
  - Current rent status (Paid/Overdue)
  - Number of open service requests
  - Days until lease ends
- **Property Details Card**: Building, unit number, bedrooms, bathrooms, square footage
- **Lease Information Card**: Lease dates, progress bar, tenant since date
- **Recent Service Requests**: Quick view of recent requests with status

#### TenantServiceRequestsPage (`components/TenantServiceRequestsPage.tsx`)
Service requests management:
- Shows only tenant's own service requests (filtered by tenant ID)
- Full search and filter functionality
- Status filtering (All, Pending, In Progress, Complete)
- "New Request" button for submitting new requests
- Click request ID to view details

### 4. Updated SpecificServiceRequestPage
- **Added `currentUser` prop** to identify user role
- **Message alignment updated**:
  - Tenant messages display on the right
  - Landlord messages display on the left
  - Uses `currentUserName` to determine message ownership
- **Contractor ads hidden**: "Did You Know?" card and suggested vendors section not shown to tenants in Contacts tab

### 5. Role-Based Routing (App.tsx)
Implemented conditional rendering based on `currentUser.role`:

**Tenant Access**:
- ✅ Home (TenantHomeDashboard)
- ✅ Service Requests (TenantServiceRequestsPage)
- ✅ Specific Service Request details
- ✅ Settings
- ✅ Account

**Landlord-Only Pages** (show "Access Denied" for tenants):
- ❌ Financials Dashboard
- ❌ Buildings & Units
- ❌ Tenants Management
- ❌ Documents
- ❌ Building/Unit detail pages
- ❌ Tenant detail pages
- ❌ Leases pages

### 6. Updated Sidebar Navigation
- **Landlord Navigation** (full menu):
  - Home
  - Financials
  - Buildings & Units
  - Service Requests
  - Tenants
  - Documents
  
- **Tenant Navigation** (simplified):
  - Home
  - My Service Requests

## Payment Flow

The tenant portal includes a complete payment processing system:

### Payment Hub (`TenantPaymentsPage`)
- Overview of rent and utility charges
- Payment breakdown with itemized costs
- Recent payment activity history
- Financial documents table
- "Pay Now" button to initiate payment

### Make a Payment (`TenantPaymentPage`)
- Multiple payment method selection:
  - Checking Account
  - Credit Card
  - Debit Card
  - bKash (mobile payment)
  - Add new card option
- Form to enter new card details
- Payment summary sidebar
- "Confirm Payment" button

### Payment Success (`PaymentSuccessPage`)
- Success confirmation with checkmark icon
- Order ID generation (format: SUG-YYYY-XXXXXX)
- Payment details display
- Total amount confirmation
- "Return to Payments Hub" button

**Payment Flow:**
1. Tenant Dashboard → Click "Pay Rent Now" (Action Center)
2. OR Payments Hub → Click "Pay Now"
3. Make a Payment → Select payment method → Click "Confirm Payment"
4. Payment Success → Click "Return to Payments Hub"

## Testing the Tenant Portal

### Test Tenant Accounts
All tenants have user accounts. Example credentials:

```
Email: farzana.akhter@email.com
Password: tenant123

Email: shahriar.karim@email.com
Password: tenant123

Email: imran.chowdhury@email.com
Password: tenant123
```

**Full list of tenant emails** (all use password `tenant123`):
- farzana.akhter@email.com
- amrul.hoque@email.com
- shahriar.karim@email.com
- tania.akter@email.com
- imran.chowdhury@email.com
- sumi.akhter@email.com
- hasan.mahmud@email.com
- shuvo.islam@email.com
- maruf.khan@email.com
- mahin.alam@email.com
- saima.binte.noor@email.com
- javed.rahman@email.com
- sadia.hossain@email.com
- kamal.uddin@email.com
- mehnaz.sultana@email.com
- tanvir.ahmed@email.com
- nasrin.akter@email.com
- mithun.das@email.com
- zahid.hasan@email.com
- roksana.begum@email.com
- shila.rahman@email.com
- arefin.chowdhury@email.com
- rezaul.karim@email.com
- nadia.islam@email.com
- selina.yasmin@email.com
- abdul.malek@email.com
- rafsan.chowdhury@email.com

### Test Landlord Accounts
```
Email: demo@sughar.com
Password: demo

Email: monir@ashaproperties.com
Password: password123
```

### Testing Checklist

1. **Login as Tenant**:
   - [ ] Verify simplified sidebar shows only Home and My Service Requests
   - [ ] Check tenant dashboard displays correct property and lease info
   - [ ] Verify stats cards show accurate data
   - [ ] Test navigation to service requests page

2. **Service Requests (Tenant View)**:
   - [ ] Verify only tenant's own requests are shown
   - [ ] Test search and filter functionality
   - [ ] Click on a request to view details
   - [ ] Check that message alignment is correct (tenant on right)
   - [ ] Verify no contractor ads appear in Contacts tab

3. **Access Control**:
   - [ ] Try navigating to landlord pages via URL or direct navigation
   - [ ] Verify "Access Denied" message appears
   - [ ] Confirm tenant cannot see other tenants' data

4. **Login as Landlord**:
   - [ ] Verify full navigation menu appears
   - [ ] Check access to all landlord features
   - [ ] View service request details (landlord messages on left)
   - [ ] Verify contractor ads appear in Contacts tab

## Architecture Notes

### Data Access Pattern
Tenant data is filtered at the component level using `appData.tenants.find(t => t.name === currentUser.name)` to match user account to tenant profile. In production, this should use a proper `userId` field on the Tenant type.

### Security Considerations
Current implementation uses client-side role checking. In production:
- Role verification must happen on the backend
- API endpoints should validate user role before returning data
- JWT tokens should include role claims
- Implement proper RBAC (Role-Based Access Control)

### Future Enhancements
Potential additions to the tenant portal:
- Online rent payment
- Maintenance request photo upload
- Lease document viewing
- Communication history with landlord
- Rent payment history
- Move-in/move-out inspection reports
- Community bulletin board
- Amenity booking

## File Structure

```
/components
  ├── TenantHomeDashboard.tsx          # New - Tenant home page
  ├── TenantServiceRequestsPage.tsx    # New - Tenant service requests
  ├── SpecificServiceRequestPage.tsx   # Updated - Role-aware messaging
  ├── Sidebar.tsx                       # Updated - Role-based navigation
  └── ...

/types.ts                               # Updated - Added UserRole enum
/data.ts                                # Updated - Generate tenant users
/App.tsx                                # Updated - Role-based routing
```

## Implementation Details

### Message Alignment Logic
In `SpecificServiceRequestPage.tsx`:
```typescript
const ChatBubble: React.FC<{ message: ChatMessage; currentUserName?: string }> = 
  ({ message, currentUserName }) => {
    const isSelf = currentUserName ? message.sender.name === currentUserName : message.isSelf;
    // ... rest of component
};
```

### Role-Based Filtering
In `App.tsx`:
```typescript
const renderPage = () => {
  const isTenant = currentUser?.role === UserRole.Tenant;
  
  switch (currentPage) {
    case 'home':
      if (isTenant && currentUser) {
        return <TenantHomeDashboard ... />;
      }
      return <HomeDashboard ... />;
    // ... more cases
  }
};
```

## Known Issues & Limitations

1. **Tenant-User Linking**: Currently uses name matching. Should use proper foreign key relationship in production.
2. **No New Request Form**: "New Request" button exists but form not yet implemented.
3. **Static Contacts Tab**: Tenant view shows placeholder message instead of assigned contractor info.
4. **No Photo Upload**: Service request image upload not implemented.
5. **Hardcoded Passwords**: All tenants use same password - should have unique passwords or use invitation system.

## Deployment Notes

When deploying to production:
1. Update all tenant passwords to unique, secure values
2. Implement proper authentication with JWT
3. Add backend API endpoints with role validation
4. Remove hardcoded test credentials
5. Add email verification for tenant accounts
6. Implement password reset functionality
7. Add audit logging for access control violations
