# SuGhar Phase 1 - Quick Start Guide

## 🚀 Getting Started

### Run the Application
```bash
cd /home/tahmid-chowdhury/Documents/SuGhar/sughar
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 👥 Test Accounts

### Multi-Role User (Property Group Selection Demo)
```
Email: bilal@email.com
Password: bilal123
Role: Building Manager in Group A, Tenant in Group B
```

### Landlord Account
```
Email: monir@ashaproperties.com
Password: password123
Role: Landlord
```

### Demo Landlord
```
Email: demo@sughar.com
Password: demo
Role: Landlord
```

### Tenant Account
```
Email: farzana.akhter@email.com
Password: tenant123
Role: Tenant
```

---

## ✨ Feature Testing Guide

### 1. Property Group Selection
**Test with**: `bilal@email.com`

1. Login with Bilal's credentials
2. You'll see the Property Group Selection screen
3. Two cards will appear:
   - **Asha Properties Group A** (Manager role)
   - **Uttara Residences** (Tenant role)
4. Click on any card to enter that context
5. Dashboard will load with role-appropriate permissions

**What to observe**:
- Beautiful card-based UI with gradients
- Role badges on each card
- Building and unit counts
- Smooth transition to dashboard

---

### 2. Enhanced Service Requests
**Test with**: `monir@ashaproperties.com` (Landlord)

#### A. View Service Request Details
1. Navigate to **Service Requests** from sidebar
2. Click on any service request
3. Explore the **4 tabs**:
   - **Overview**: Request details, contractor assignment
   - **Media**: Photos/videos grid
   - **Activity**: Automatic timeline of all events
   - **Comments**: Real-time messaging

#### B. Upload Media
1. In service request detail, go to **Media** tab
2. Click the upload area
3. Select image or video files
4. Files appear in grid layout
5. Check **Activity** tab - see "Media Uploaded" event

#### C. Add Comments
1. Go to **Comments** tab
2. Type a message in the input box
3. Click **Send**
4. Comment appears with your avatar, name, and role badge
5. Check **Activity** tab - see "Comment Added" event

#### D. Assign Contractor
1. In **Overview** tab, click **"Assign Contractor"**
2. Modal opens with list of 5 contractors
3. Select a contractor (e.g., "Karim Plumbing Services")
4. Observe:
   - Status automatically changes to "In Progress"
   - "Contractor Assigned" appears in Activity timeline
   - "Status Changed" appears in Activity timeline

---

### 3. Tenant Service Request Creation
**Test with**: `farzana.akhter@email.com` (Tenant)

1. Login as tenant
2. Go to **Service Requests**
3. Click **"New Request"** button
4. Fill in:
   - Title: "AC not cooling"
   - Category: HVAC
   - Priority: High
   - Description: Detailed problem description
5. Optional: Upload photos
6. Submit
7. Request appears in "Current" tab
8. Click to view - see your request with all details

**What happens**:
- Activity log automatically created with "Request Created" event
- Landlord can now see this request on their side
- Tenant can add comments and media

---

### 4. Document Sharing
**Test with**: `monir@ashaproperties.com` (Landlord)

1. Navigate to **Documents** → **All Documents**
2. Find any document in the table
3. Click the **"Share"** button (with Users icon)
4. Modal opens showing all tenants with checkboxes
5. Use **"Select All"** or manually select tenants
6. Click **"Save Changes"**
7. Document now shows "X tenants" in the **"Shared With"** column
8. Selected tenants can now view this document in their Documents page

**Test tenant view**:
- Login as `farzana.akhter@email.com`
- Go to **Documents**
- See documents shared with you

---

### 5. Property Listings Platform
**Test with**: `monir@ashaproperties.com` (Landlord)

1. Click **"Listings"** in the sidebar
2. See dashboard with stats:
   - Active Listings
   - Pending
   - Rented
   - Vacant Units

#### Create New Listing
1. In the **"Create New Listing from Vacant Unit"** section
2. Click on any vacant unit card
3. Modal opens with form pre-filled with unit data
4. Customize:
   - Listing Title
   - Description
   - Monthly Rent
   - Listing Type (Rent/Sale)
   - Amenities (comma-separated)
5. Click **"Create Listing"**
6. Listing appears in **Active** tab

#### View Listings
- Switch between tabs: **Active**, **Pending**, **Rented**
- Each listing shows:
  - Unit details (BR, BA, sqft)
  - Building and unit number
  - Amenities
  - Rent price
  - **"View Unit"** button to navigate to unit details

---

## 🎨 UI Features to Notice

### Activity Timeline
- Beautiful vertical timeline with colored icons
- Different colors for different event types:
  - 🔵 Blue: Request Created
  - 🟣 Purple: Viewed by Landlord
  - 🟠 Indigo: Contractor Assigned
  - 🟢 Green: Status Changed
  - 🔴 Pink: Comment Added
  - 🟠 Orange: Media Uploaded

### Comment System
- Chat-style bubbles
- Avatar images
- Role badges (Landlord, Tenant, Contractor)
- Timestamps
- File attachment support

### Property Group Cards
- Gradient backgrounds
- Role-specific colors
- Hover animations
- Stats display (buildings, units)

### Document Sharing Modal
- Searchable tenant list
- Select All / Deselect All
- Visual selection with checkmarks
- Count of selected tenants

---

## 📊 Data Structure Overview

### Property Groups
- **PG-1**: Asha Properties Group A (3 buildings)
- **PG-2**: Uttara Residences (1 building)

### Sample Contractors
1. Karim Plumbing Services (Rating: 4.8)
2. Rahman Electric Co. (Rating: 4.6)
3. Dhaka Pest Control (Rating: 4.7)
4. Modern HVAC Solutions (Rating: 4.9)
5. BuildRight Construction (Rating: 4.5)

### Buildings
- **B-LC**: Lalmatia Court (12 units)
- **B-BH**: Banani Heights (8 units)
- **B-DR**: Dhanmondi Residency (5 units)
- **B-UG**: Uttara Gardens (3 units)

### Sample Service Requests
- 20 service requests with various statuses
- Requests include plumbing, electrical, HVAC, pest control
- Some have contractors assigned, some completed

---

## 🔍 Things to Test

### Cross-User Functionality
1. **Create service request as tenant** → **View as landlord**
2. **Share document as landlord** → **View as tenant**
3. **Assign contractor as landlord** → **See status change**
4. **Add comment as tenant** → **Reply as landlord**

### Activity Log Testing
1. Create new service request → Check Activity tab
2. Open existing request as landlord → Check "Viewed" event
3. Assign contractor → Check "Contractor Assigned" + "Status Changed" events
4. Upload media → Check "Media Uploaded" event
5. Add comment → Check "Comment Added" event

### Listings Platform
1. Create listing from vacant unit
2. View listing in Active tab
3. Click "View Unit" to navigate to unit detail page
4. Check if unit details match listing

---

## 🐛 Known Limitations (Expected Behavior)

1. **Media Storage**: Uses object URLs (temporary). Refresh will lose uploaded images.
2. **Real-time Updates**: No WebSocket - refresh page to see updates from other users
3. **File Upload**: No actual file upload to server, just preview
4. **Search**: Client-side search only, no backend search
5. **Settings Page**: Still needs full implementation (pending)

---

## 💡 Tips for Best Experience

1. **Test in Multiple Browser Tabs**: Open landlord account in one tab, tenant in another
2. **Use Chrome DevTools**: Check console for any errors
3. **Test Mobile View**: Resize browser to see responsive design
4. **Check Network Tab**: See state updates happening (in-memory, no API calls yet)

---

## 🎯 Key Features Implemented

✅ Property Group selection for multi-role users  
✅ Service request media upload (photos/videos)  
✅ Comment/messaging system tied to service requests  
✅ Automatic activity timeline with 7+ event types  
✅ Contractor management with auto-status updates  
✅ Document sharing with tenant selection  
✅ Internal listings platform with unit-to-listing conversion  
✅ Beautiful, responsive UI with SuGhar design language  
✅ Role-based access control (landlord vs tenant views)  
✅ Complete type safety with TypeScript  

---

## 🚦 Next Steps (Phase 2)

1. **User Settings Page**: Make fully functional (profile editing, preferences)
2. **MongoDB Integration**: Connect backend API to frontend
3. **Real-time Notifications**: WebSocket for live updates
4. **File Upload**: S3/Cloudinary integration for media storage
5. **Public Listings**: Expand internal listings to public-facing platform
6. **Email Notifications**: Send emails for comments, assignments
7. **Mobile App**: React Native for iOS/Android

---

## 📝 Notes

- All data is currently in-memory (resets on page refresh)
- Backend models exist in `/api/models/` but not yet connected
- State structure is ready for MongoDB migration
- Refer to `PHASE_1_IMPLEMENTATION_SUMMARY.md` for technical details

---

## 🎉 Enjoy Testing!

If you encounter any issues or have questions, check:
1. `PHASE_1_IMPLEMENTATION_SUMMARY.md` - Detailed technical documentation
2. `ARCHITECTURE.md` - System architecture overview
3. `/types.ts` - All data structures and interfaces
4. Inline comments in component files

**Happy Testing! 🚀**
