# Current Tenants Dynamic Data - Usage Guide

## Quick Start

The Current Tenants page now displays real data from your database instead of static mock data. Here's how it works:

## Backend Setup

1. **Database Requirements**:
   - MongoDB with collections: `users`, `properties`, `units`, `leaseagreements`, `payments`, `servicerequests`, `ratings`
   - Active lease agreements (startDate ≤ today ≤ endDate)
   - User authentication system with JWT tokens

2. **API Endpoint**: `GET /api/current-tenants`
   - **Authentication**: Bearer token required
   - **Returns**: Array of current tenant objects
   - **Filters**: Only tenants in properties owned by authenticated user

## Frontend Integration

The `CurrentTenantsPage` component automatically:

1. **Loads on Mount**: Fetches data when component loads
2. **Shows Loading State**: Spinner and "Loading tenants data..." message
3. **Handles Errors**: Error message with retry button
4. **Displays Data**: Dynamic table with real tenant information

## Data Mapping

| Database Source | Display Field | Description |
|----------------|---------------|-------------|
| `User.firstName + lastName` | `name` | Full tenant name |
| `ui-avatars.com` | `avatar` | Generated avatar image |
| `Rating.rating` | `rating` | Tenant rating (default 4.0) |
| `Property.address` | `building` | Building name/address |
| `Unit.unitNumber` | `unit` | Unit number |
| Calculated % | `leaseProgress` | Lease completion percentage |
| Payment history | `rentStatus` | Paid/Overdue/Pending |
| Count from DB | `requests` | Service request count |

## Rent Status Logic

```javascript
// Rent status determination:
if (payment_received_this_month && payment.status === 'completed') {
    status = 'Paid'
} else if (today > 5th_of_month && no_payment_this_month) {
    status = 'Overdue'  
} else {
    status = 'Pending'
}
```

## Lease Progress Calculation

```javascript
// Lease progress percentage:
const totalDays = (leaseEnd - leaseStart) / (1000 * 60 * 60 * 24);
const daysPassed = (today - leaseStart) / (1000 * 60 * 60 * 24);
const percentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

// Progress bar variant:
const variant = percentage > 50 ? 'dark' : 'light';
```

## Features Available

### ✅ Real-time Data
- Live data from database
- Automatic updates on page refresh
- Proper error handling and recovery

### ✅ Advanced Filtering
- **Building**: Filter by property/building
- **Rent Status**: Paid/Overdue/Pending
- **Search**: Name, building, or unit search
- **Lease Progress**: Min/max percentage range

### ✅ Sorting
- All columns sortable (name, building, unit, lease progress, rent status, requests)
- Visual sort indicators
- Ascending/descending toggle

### ✅ Interactive Elements  
- Click tenant name → view tenant details
- Click building name → navigate to building page
- Click unit number → navigate to unit page

## Testing

### Backend Test
```bash
# Run the test script
./test-current-tenants.sh

# Manual cURL test
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5050/api/current-tenants
```

### Frontend Test
1. Open browser developer console
2. Navigate to Current Tenants page
3. Run: `testCurrentTenantsIntegration()`
4. Check console for test results

## Troubleshooting

### No Data Showing
1. **Check Authentication**: Ensure user is logged in with valid JWT
2. **Verify Lease Agreements**: Must have active leases (startDate ≤ today ≤ endDate)
3. **Property Ownership**: Tenants only show for properties owned by logged-in user
4. **Database Connection**: Verify MongoDB connection in server logs

### Loading Forever
1. **API Endpoint**: Check if `/api/current-tenants` is accessible
2. **CORS Issues**: Verify CORS configuration for frontend domain
3. **Network**: Check browser network tab for failed requests

### Error Messages
- **"Failed to load tenants data"**: API call failed (check server logs)
- **"Access token required"**: User not authenticated (login again)
- **"Invalid or expired token"**: JWT expired (login again)

## Sample Response

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe", 
    "avatar": "https://ui-avatars.com/api/?name=John+Doe&background=random",
    "rating": 4.5,
    "building": "123 Main Street",
    "unit": 101,
    "leaseProgress": {
      "value": 75,
      "variant": "dark"
    },
    "rentStatus": "Paid",
    "requests": 2
  }
]
```

## Performance Notes

- **Database Queries**: Optimized with proper populate() calls
- **Response Size**: Only essential data returned
- **Caching**: Consider Redis for production
- **Pagination**: Add for 100+ tenants

## Security

- ✅ JWT authentication required
- ✅ User can only see their own tenants
- ✅ No sensitive data in responses
- ✅ Proper error handling (no data leakage)