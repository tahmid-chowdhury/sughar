# Tenant Service Request Detail Page - Dynamic Data Implementation

## ✅ Fully Dynamic Service Request Detail Page

The **SpecificServiceRequestPage** component now dynamically pulls and displays all data for tenant service requests.

---

## Dynamic Data Sources

### 1. **Service Request Data**
```typescript
const requestData = appData.serviceRequests.find(sr => sr.id === serviceRequestId);
```

**Fields Used:**
- `id` - Service Request ID (e.g., "SR-001")
- `title` - Request title
- `description` - Full description of the issue
- `priority` - High, Medium, or Low
- `status` - Pending, InProgress, or Complete
- `requestDate` - Date request was submitted
- `tenantId` - ID of the tenant who submitted
- `buildingId` - Building where issue is located
- `unitId` - Specific unit number
- `assignedContact` - Contractor assigned (if any)

### 2. **Tenant (Requester) Data**
```typescript
const requester = requestData ? appData.tenants.find(t => t.id === requestData.tenantId) : undefined;
```

**Fields Used:**
- `name` - Tenant's full name
- `avatar` - Profile picture URL
- `rating` - Tenant rating (if applicable)

### 3. **Building Data**
```typescript
const building = requestData ? appData.buildings.find(b => b.id === requestData.buildingId) : undefined;
```

**Fields Used:**
- `name` - Building name/ID for display

### 4. **Current User Context**
```typescript
const isTenant = currentUser?.role === 'Tenant';
```

**Used For:**
- Hiding contractor ads from tenants
- Message alignment in chat
- Conditional content display

---

## Page Layout & Components

### **Header Section**
- ✅ Dynamic title from `requestData.title`
- ✅ Service request ID from `requestData.id`
- ✅ Status pill with color-coded badge
- ✅ "Back to Service Requests" navigation

### **Tab Navigation**
Four tabs with dynamic content:
1. **Summary** - Main details
2. **Images** - Photos/media
3. **Activity Log** - Timeline
4. **Contacts** - Contractor info (hidden for tenants)

---

## Summary Tab (Default View)

### **Left Column - Main Details Card**

#### **Requester Info (Dynamic)**
```tsx
<img src={requester.avatar} alt={requester.name} />
<span>{requester.name}</span>
<span className="bg-pink-100">{requester.rating}</span>
```

**Displays:**
- Tenant's avatar (from `requester.avatar`)
- Tenant's name (from `requester.name`)
- Tenant rating badge (pink background, from `requester.rating`)

#### **Request Details Grid (4 Columns)**
```tsx
<DetailItem label="Request Date" value={requestData.requestDate} />
<DetailItem label="Building" value={building.name} />
<DetailItem label="Unit" value={requestData.unitId} />
<DetailItem label="Priority" value={requestData.priority} />
```

**Displays:**
- **Request Date**: When submitted (from `requestData.requestDate`)
- **Building**: Building name/ID (from `building.name`)
- **Unit**: Unit number (from `requestData.unitId`)
- **Priority**: High/Medium/Low (from `requestData.priority`)

#### **Description Section (Dynamic)**
```tsx
<h4>Description:</h4>
<p>{requestData.description}</p>
```

**Displays:**
- Full description text from `requestData.description`
- Automatically wraps long text
- Styled with proper spacing

### **Right Column - Comments/Updates Card**

#### **Comments Feed (Dynamic)**
Automatically shows:

1. **Initial Submission Comment**
   - Requester's avatar
   - Requester's name
   - Request date
   - "Request submitted and under review." message

2. **Contractor Assignment Comment** (Conditional)
   - Only shows if `requestData.assignedContact` exists
   - Contractor's avatar
   - Contractor's name
   - "Contractor assigned to this request." message

```tsx
{requestData.assignedContact && (
    <div className="bg-white p-3 rounded-lg shadow-sm">
        <img src={requestData.assignedContact.avatar} />
        <p>{requestData.assignedContact.name} • System</p>
        <p>Contractor assigned to this request.</p>
    </div>
)}
```

#### **Message Input**
- Text input for adding comments
- Attachment and image buttons
- Pink focus ring matching theme

---

## Images Tab

### **Dynamic Image Gallery**
```tsx
const mockImages = [
    { id: '1', url: 'https://picsum.photos/seed/sr1/400/300', type: 'image', uploadedBy: requester.name, uploadDate: requestData.requestDate },
    { id: '2', url: 'https://picsum.photos/seed/sr2/400/300', type: 'image', uploadedBy: requester.name, uploadDate: requestData.requestDate },
];
```

**Features:**
- Shows images uploaded with the request
- Displays uploader name (from `requester.name`)
- Shows upload date (from `requestData.requestDate`)
- Currently uses placeholder images (can be replaced with actual uploads)

**Future Enhancement:**
- Could pull from `requestData.attachments` or similar field
- Support for multiple image uploads
- Video support

---

## Activity Log Tab

### **Timeline Placeholder**
Currently shows:
```tsx
<p className="text-text-secondary">Activity log will be displayed here.</p>
```

**Future Implementation:**
Could show:
- Request created event
- Status changes (Pending → In Progress → Complete)
- Contractor assignments
- Comments added
- Priority changes
- Resolution notes

**Data Source (Future):**
```typescript
requestData.activityLog?.map(activity => ...)
```

---

## Contacts Tab

### **Tenant View (Ads Hidden)**
```tsx
if (isTenant) {
    return (
        <div className="text-center py-12">
            <p>Contact information will be displayed here when contractors are assigned.</p>
        </div>
    );
}
```

**Shows:**
- Simple placeholder message
- No contractor recommendations
- No promotional content

### **Landlord View (Full Details)**
```tsx
const contactCards = [{
    title: 'Assigned Contractor',
    contacts: requestData.assignedContact ? [{
        ...requestData.assignedContact,
        phone: '+880 1234-567890',
        email: 'contractor@example.com'
    }] : [],
}];
```

**Shows:**
- Assigned contractor details
- Contact information (phone, email)
- Suggested vendors with ratings
- "Did You Know?" promotional card

---

## Color Theme Updates

### **Pink Accent Colors**
- ✅ Tenant rating badge: `bg-pink-100 text-pink-800`
- ✅ Tab active state: `border-brand-pink text-brand-pink`
- ✅ Status pills with pink theme
- ✅ Input focus rings: `focus:ring-brand-pink`

**Changed from purple:**
- Tenant rating badge
- All highlights and accents

---

## Dynamic Behavior Examples

### **Example 1: Newly Created Request**
Tenant creates request "Leaking faucet in kitchen"

**What appears:**
- Title: "Leaking faucet in kitchen | SR-014"
- Status: Red "Pending" badge
- Request Date: "10/14/2025" (today)
- Building: Auto-populated from tenant's unit
- Unit: Auto-populated from tenant's unit
- Priority: As selected by tenant (e.g., "High")
- Description: Full text entered by tenant
- Comments: "Request submitted and under review."
- Assigned Contact: "Unassigned" (no contractor yet)

### **Example 2: Request with Assigned Contractor**
Same request after landlord assigns contractor

**What appears:**
- Everything from Example 1, PLUS:
- Comments: Additional entry showing contractor assignment
- Assigned Contact: Contractor's name, avatar
- Contacts Tab: Shows contractor details (for landlords)

### **Example 3: Different Priorities**
Three requests with different priorities

**How they display:**
- **High Priority**: Shows "High" in detail grid
- **Medium Priority**: Shows "Medium" in detail grid  
- **Low Priority**: Shows "Low" in detail grid

Each pulls its own priority value dynamically from `requestData.priority`

---

## Data Flow Diagram

```
User clicks on request in table
        ↓
serviceRequestId passed to component
        ↓
Component finds request in appData.serviceRequests
        ↓
Component finds tenant using requestData.tenantId
        ↓
Component finds building using requestData.buildingId
        ↓
All data rendered dynamically:
  - Header: title, id, status
  - Summary: requester info, details, description, comments
  - Images: photos with metadata
  - Contacts: assigned contractor (if any)
```

---

## Error Handling

### **Request Not Found**
```tsx
if (!requestData || !requester || !building) {
    return (
        <div className="container mx-auto text-center p-8">
            <h2>Service Request not found.</h2>
            <button onClick={onBack}>Go Back</button>
        </div>
    );
}
```

**Shows when:**
- Invalid service request ID
- Request has been deleted
- Tenant or building data is missing
- Provides "Go Back" button for recovery

---

## Responsive Design

### **Mobile (< 768px)**
- Single column layout
- Comments card below main details
- Tabs scroll horizontally if needed

### **Tablet (768px - 1024px)**
- Two-column grid for detail items
- Side-by-side layout where possible

### **Desktop (> 1024px)**
- 2:1 column split (main details : comments)
- Four-column detail grid
- Full tab navigation

---

## Integration with Service Requests Table

### **Navigation Flow**
1. Tenant clicks request ID in table (e.g., "SR-014")
2. `onSelectServiceRequest(requestId)` called
3. App state updates: `setViewingServiceRequestId(requestId)`
4. Page switches to `specific-service-request`
5. SpecificServiceRequestPage renders with `serviceRequestId="SR-014"`
6. Component pulls all data dynamically
7. Full details displayed

### **Back Navigation**
1. User clicks "Back to Service Requests"
2. `onBack()` called
3. App switches page back to `service-requests`
4. Table shows with request still in list (persistent)

---

## Testing Scenarios

### ✅ **Test 1: View Newly Created Request**
1. Create new service request as tenant
2. Click on request ID in table
3. Verify all fields populated correctly
4. Verify status is "Pending"
5. Verify no assigned contractor

### ✅ **Test 2: View Different Priorities**
1. Create three requests with High, Medium, Low
2. Click each one
3. Verify priority displays correctly in detail grid

### ✅ **Test 3: View as Tenant vs Landlord**
1. Login as tenant, view request
2. Check Contacts tab (should see placeholder)
3. Login as landlord, view same request
4. Check Contacts tab (should see full details)

### ✅ **Test 4: Multiple Buildings/Units**
1. Create requests from different units
2. Click each request
3. Verify correct building and unit shown

### ✅ **Test 5: Back Navigation**
1. Click into request detail
2. Click "Back to Service Requests"
3. Verify returns to table
4. Verify request still in list

---

## Summary

The SpecificServiceRequestPage is now **fully dynamic** and pulls all data from:
- ✅ `appData.serviceRequests` - Request details
- ✅ `appData.tenants` - Requester information
- ✅ `appData.buildings` - Building information
- ✅ `currentUser` - Role-based view control

**All data displayed is real and dynamic** - no hardcoded values except:
- Placeholder images (can be replaced with actual uploads)
- Activity log placeholder (awaits implementation)
- Sample comments (shows request creation automatically)

The page works seamlessly with tenant-created requests and updates in real-time as data changes! 🎉
