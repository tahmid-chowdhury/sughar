# SuGhar Architecture Documentation

## Overview

SuGhar is a property management SaaS application built with React, TypeScript, and Vite. This document provides a comprehensive overview of the system architecture, data flow, and code organization for developers joining the project.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      App.tsx                            │
│  (Root Component - State & Routing)                     │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │           Application State                     │   │
│  │  - appData (buildings, units, tenants, etc.)   │   │
│  │  - currentUser (authentication)                 │   │
│  │  - currentPage (routing)                        │   │
│  │  - viewingXXXId (detail views)                  │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │         Handler Functions                       │   │
│  │  - handleLogin / handleLogout                   │   │
│  │  - handleNavigate                               │   │
│  │  - handleAddBuilding / handleAddUnit            │   │
│  │  - handleSelectBuilding / handleSelectUnit      │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ├─── Login/Signup (no Layout)
                           │
                           └─── Authenticated Pages
                                      │
                    ┌─────────────────┴──────────────────┐
                    │                                     │
            ┌───────▼───────┐                  ┌─────────▼─────────┐
            │    Layout     │                  │   Page Content    │
            │  (Wrapper)    │                  │   (Dashboard/     │
            │               │                  │    Detail views)  │
            │  ├─ Sidebar   │                  │                   │
            │  └─ Content   │                  └───────────────────┘
            └───────────────┘
```

### Component Hierarchy

```
App
├── LoginPage / SignUpPage (unauthenticated)
└── Layout (authenticated)
    ├── Sidebar
    │   ├── Logo & Brand
    │   ├── Navigation Items
    │   ├── Settings
    │   └── User Profile
    └── Page Content
        ├── HomeDashboard
        ├── FinancialsDashboard
        ├── BuildingsUnitsDashboard
        │   ├── Header (with tabs)
        │   ├── BuildingsPage
        │   └── UnitsPage
        ├── TenantsDashboard
        │   ├── Header (with tabs)
        │   ├── CurrentTenantsPage
        │   ├── ApplicationsPage
        │   └── LeasesEndingSoonPage
        ├── ServiceRequestsPage
        ├── DocumentsDashboard
        ├── SpecificBuildingPage (detail view)
        ├── SpecificUnitPage (detail view)
        ├── TenantDetailPage (detail view)
        └── SpecificServiceRequestPage (detail view)
```

## Data Model

### Core Entities

The application revolves around these main entities:

1. **User** - Property managers and applicants
2. **Building** - Physical properties in the portfolio
3. **Unit** - Individual rental units within buildings
4. **Tenant** - Current and past renters
5. **ServiceRequest** - Maintenance and repair requests
6. **Document** - Leases, invoices, permits, etc.
7. **RentalApplication** - Applications from prospective tenants

### Entity Relationships

```
Building (1) ──────────< (N) Unit
                           │
                           │ currentTenantId
                           │
Unit (N) ───────────> (1) Tenant
                           │
                           │ tenantId
                           │
Tenant (1) ──────────< (N) ServiceRequest
                           │
                           │ unitId
                           │
ServiceRequest (N) ──> (1) Unit

Building (1) ──────────< (N) Document
Unit (1) ───────────< (N) Document

User (1) ───────────< (N) RentalApplication
```

### Data Flow

1. **Initial Load**: `data.ts` generates mock data → `INITIAL_APP_DATA` → `App.tsx` state
2. **User Action**: Button click in component → calls handler prop → executes handler in `App.tsx`
3. **State Update**: Handler updates state using `setAppData()` or other setters
4. **Re-render**: React propagates new props down component tree → UI updates

## File Organization

### Core Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `types.ts` | TypeScript type definitions | All interfaces and enums |
| `data.ts` | Mock data generation | `INITIAL_APP_DATA` |
| `constants.tsx` | Static data and configs | Dashboard stats, chart data |
| `App.tsx` | Root component, state, routing | `App` component |
| `index.tsx` | Application entry point | Renders App to DOM |

### Component Files

| Directory/File | Contents |
|----------------|----------|
| `components/Layout.tsx` | Main layout wrapper |
| `components/Sidebar.tsx` | Navigation sidebar |
| `components/Header.tsx` | Page header with tabs |
| `components/*Dashboard.tsx` | Main dashboard pages |
| `components/*Page.tsx` | Sub-pages and detail views |
| `components/*Form.tsx` | Forms for data entry |
| `components/charts/` | Chart visualization components |
| `components/icons.tsx` | Icon component library |

## State Management

### Current Approach
- **Centralized State**: All in `App.tsx`
- **Props Drilling**: State passed down via props
- **Handler Functions**: Passed as callbacks for mutations

### State Structure

```typescript
// Main application data
appData: AppData {
  users: User[]
  buildings: BuildingDetail[]
  units: UnitDetail[]
  tenants: Tenant[]
  documents: Document[]
  serviceRequests: ServiceRequest[]
  rentalApplications: RentalApplication[]
}

// UI state
currentPage: string              // 'home', 'buildings', etc.
currentUser: User | null         // Authenticated user
targetTab: string | undefined    // Tab to open on navigation
viewingBuildingId: string | null // Detail view tracking
viewingUnitId: string | null
viewingTenantId: string | null
viewingServiceRequestId: string | null
```

### Production Considerations

For production, consider:
- **Redux** or **Zustand** for state management
- **React Query** for server state and caching
- **React Router** for proper routing with URLs
- **Context API** for theme/user preferences

## Routing System

### Current Implementation (Simple State-Based)

```typescript
// In App.tsx
const [currentPage, setCurrentPage] = useState('login');

const renderPage = () => {
  switch (currentPage) {
    case 'home': return <HomeDashboard ... />;
    case 'buildings': return <BuildingsUnitsDashboard ... />;
    // ... etc
  }
};
```

### Detail Views

Detail views use separate state variables:

```typescript
// User clicks on building → stores ID
setViewingBuildingId(buildingId);
setCurrentPage('specific-building');

// Render specific building page with that ID
<SpecificBuildingPage buildingId={viewingBuildingId} ... />
```

### Production Router Structure

For production with React Router:

```
/login
/signup
/ (home dashboard)
/financials
/buildings
/buildings/:buildingId
/buildings/:buildingId/units/:unitId
/tenants
/tenants/:tenantId
/service-requests
/service-requests/:requestId
/documents
/settings
/account
```

## Key Design Patterns

### 1. Prop Drilling Pattern
Data flows down from App → Layout → Page → Subcomponent

```typescript
<BuildingsUnitsDashboard
  appData={appData}
  onSelectBuilding={handleSelectBuilding}
  onAddBuilding={handleAddBuilding}
/>
```

### 2. Handler Functions Pattern
Parent passes callbacks for child actions

```typescript
// In App.tsx
const handleAddBuilding = (buildingData) => {
  setAppData(prevData => ({
    ...prevData,
    buildings: [...prevData.buildings, newBuilding]
  }));
};

// Passed to child
<BuildingsUnitsDashboard onAddBuilding={handleAddBuilding} />
```

### 3. Immutable State Updates
Always create new objects/arrays when updating

```typescript
// ❌ Wrong - mutates state
appData.buildings.push(newBuilding);

// ✅ Correct - creates new array
setAppData(prevData => ({
  ...prevData,
  buildings: [...prevData.buildings, newBuilding]
}));
```

### 4. Conditional Rendering Pattern
Show/hide UI based on state

```typescript
{isLoading ? <Spinner /> : <DataTable data={data} />}

{user.role === 'admin' && <AdminPanel />}

{items.length === 0 ? <EmptyState /> : <ItemList items={items} />}
```

## Styling Approach

### Tailwind CSS (Inline Classes)
- All styling done with Tailwind utility classes
- No separate CSS files
- Colors use custom CSS variables defined in `index.html`

### Design System

**Colors:**
- Primary: `brand-pink` (#E91E63)
- Background: `bg-gray-50`
- Cards: `bg-white`
- Text: `text-gray-800` / `text-gray-600`
- Borders: `border-gray-200`

**Typography:**
- Font: Inter (default) and Atkinson Hyperlegible (headings)
- Heading: `text-4xl font-bold`
- Body: `text-sm` or `text-base`

**Spacing:**
- Card padding: `p-6`
- Section spacing: `mb-6` or `mb-8`
- Grid gaps: `gap-6`

## Adding New Features

### Adding a New Entity Type

1. **Define Type** in `types.ts`:
```typescript
export interface NewEntity {
  id: string;
  // ... other fields
}
```

2. **Add to AppData** in `types.ts`:
```typescript
export interface AppData {
  // ... existing fields
  newEntities: NewEntity[];
}
```

3. **Generate Mock Data** in `data.ts`:
```typescript
const newEntities: NewEntity[] = [
  // ... sample data
];
return { ...existingData, newEntities };
```

4. **Create Handler** in `App.tsx`:
```typescript
const handleAddNewEntity = (data) => {
  setAppData(prev => ({
    ...prev,
    newEntities: [...prev.newEntities, newEntity]
  }));
};
```

### Adding a New Page

1. **Create Component** in `components/`:
```typescript
// components/NewFeaturePage.tsx
export const NewFeaturePage: React.FC<Props> = (props) => {
  return <div>...</div>;
};
```

2. **Import in App.tsx**:
```typescript
import { NewFeaturePage } from './components/NewFeaturePage';
```

3. **Add Route Case**:
```typescript
case 'new-feature':
  return <NewFeaturePage appData={appData} />;
```

4. **Add Navigation** in `Sidebar.tsx`:
```typescript
{ icon: IconName, label: 'New Feature', page: 'new-feature' }
```

## Authentication

### Current Implementation (Demo Mode)
- Plain text passwords stored in `users` array
- Simple email/password matching in `handleLogin()`
- No JWT, no sessions, no password hashing

### Production Implementation
Should include:
- Secure password hashing (bcrypt)
- JWT tokens for authentication
- HTTP-only cookies for token storage
- Refresh token mechanism
- OAuth integration (Google, Microsoft, etc.)
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)

## Performance Considerations

### Current State
- All data loaded at once in memory
- No pagination
- No lazy loading
- No memoization

### Production Optimizations
- **React.memo()** for expensive components
- **useMemo() / useCallback()** for computed values
- **Virtual scrolling** for long lists
- **Code splitting** with React.lazy()
- **Image optimization** and lazy loading
- **Debouncing** search inputs
- **Pagination** for large datasets

## Testing Strategy

### Recommended Testing Layers

1. **Unit Tests** (Jest + React Testing Library)
   - Test individual components in isolation
   - Test utility functions
   - Test data transformations

2. **Integration Tests**
   - Test component interactions
   - Test form submissions
   - Test navigation flows

3. **E2E Tests** (Playwright or Cypress)
   - Test critical user flows
   - Test authentication
   - Test CRUD operations

### Example Test Structure
```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── types/
├── integration/
│   ├── dashboard.test.tsx
│   └── tenant-management.test.tsx
└── e2e/
    ├── login-flow.spec.ts
    └── service-request-flow.spec.ts
```

## Security Considerations

### Current Gaps
- ⚠️ No input sanitization
- ⚠️ No XSS protection
- ⚠️ Plain text passwords
- ⚠️ No CSRF protection
- ⚠️ No rate limiting

### Production Requirements
- ✅ Input validation and sanitization
- ✅ HTTPS everywhere
- ✅ Content Security Policy (CSP)
- ✅ Secure password storage
- ✅ CSRF tokens
- ✅ Rate limiting on API endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ Regular security audits

## Deployment

### Build Process
```bash
npm run build  # Creates optimized production build in dist/
```

### Deployment Targets
- **Vercel** - Zero-config deployment for Vite apps
- **Netlify** - Simple deployment with form handling
- **AWS S3 + CloudFront** - Scalable static hosting
- **Docker** - Containerized deployment

### Environment Variables
Create `.env.production`:
```
VITE_API_URL=https://api.sughar.com
VITE_GEMINI_API_KEY=your-api-key
```

## Future Roadmap

### Phase 1: Backend Integration
- Replace mock data with REST API calls
- Implement proper authentication
- Add data persistence (PostgreSQL/MongoDB)

### Phase 2: Enhanced Features
- Real-time notifications (WebSocket)
- Email integration
- PDF generation for leases/invoices
- Payment processing (Stripe)

### Phase 3: Mobile & Tenant Portal
- React Native mobile app
- Separate tenant-facing portal
- Mobile-responsive optimizations

### Phase 4: Advanced Analytics
- Financial forecasting
- Occupancy trends
- Maintenance cost analytics
- Custom reporting tools

## Common Development Tasks

### Running the App
```bash
npm install        # Install dependencies
npm run dev        # Start dev server on localhost:5173
npm run build      # Build for production
npm run preview    # Preview production build
```

### Debugging Tips
1. Use React DevTools browser extension
2. Add `console.log()` in handler functions
3. Check TypeScript errors in IDE
4. Use browser Network tab for API calls (when added)

### Code Style
- Use TypeScript for type safety
- Prefer functional components with hooks
- Use descriptive variable names
- Keep components focused (Single Responsibility)
- Extract reusable logic into custom hooks

## Getting Help

### Key Files to Review
1. Start with `README.md` for setup
2. Read `types.ts` to understand data structures
3. Trace through `App.tsx` to see state management
4. Look at `data.ts` to see data relationships
5. Check `constants.tsx` for UI configurations

### Documentation Resources
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Vite: https://vitejs.dev/guide/
- Tailwind CSS: https://tailwindcss.com/docs
- Recharts: https://recharts.org/

## Conclusion

This architecture provides a solid foundation for a property management system while maintaining simplicity for development and learning. As the project grows, consider migrating to more robust solutions for state management, routing, and backend integration.

For questions or clarifications, refer to the inline JSDoc comments throughout the codebase or reach out to the development team.
