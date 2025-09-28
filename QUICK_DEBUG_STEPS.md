# Quick Financial Dashboard Debug Instructions

## Most Likely Issues:

### 1. Server Not Running
**Check**: Is your backend server running?
```bash
cd server
npm run dev
```
Should show: "Server is running on http://localhost:5050"

### 2. Authentication Issue
**Check**: Are you logged in to the application?
- Open browser DevTools → Application → Local Storage
- Look for "authToken" 
- If missing, log in to the application first

### 3. API Endpoint Issue
**Test**: Open browser and go to: `http://localhost:5050/api/dashboard/stats`
- If you get a JSON response or 401 error = server is running
- If connection error = server not running

## Quick Fix: Temporarily Remove Auth Requirement

To test if authentication is the issue, you can temporarily modify the server endpoint:

In `/server/routes/api.js`, change line ~625 from:
```javascript
router.get('/dashboard/financial-stats', authenticateToken, async (req, res) => {
```

To:
```javascript  
router.get('/dashboard/financial-stats', async (req, res) => {
    // Temporarily bypass auth for testing
    req.user = { userId: '507f1f77bcf86cd799439011' }; // Use any valid ObjectId
```

This will bypass authentication temporarily to test if the API works.

## Debug Console Commands

Open browser console on the Financial Dashboard page and run:

```javascript
// Check if auth token exists
console.log('Auth token:', localStorage.getItem('authToken'));

// Test API call manually
fetch('/api/dashboard/financial-stats', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
        'Content-Type': 'application/json'
    }
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

## Expected Behavior

When working correctly, you should see in browser console:
```
Fetching financial stats...
Making API request to: http://localhost:5050/api/dashboard/financial-stats
Response status: 200
Financial stats received: {revenueThisMonth: 0, incomingRent: 0, ...}
```