// Simple test script to check if the API endpoint is working
// Run this in browser console on any page of your app

console.log('=== Financial Dashboard API Test ===');

// Test the API endpoint directly
fetch('/api/dashboard/financial-stats')
  .then(response => {
    console.log('✅ Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ API Response received:', data);
    console.log('✅ Revenue This Month: $' + data.revenueThisMonth.toLocaleString());
    console.log('✅ Incoming Rent: $' + data.incomingRent.toLocaleString());
    console.log('✅ Overdue Rent: $' + data.overdueRent.toLocaleString());
    console.log('✅ Service Costs: $' + data.serviceCosts.toLocaleString());
    console.log('✅ Utilities Costs: $' + data.utilitiesCosts.toLocaleString());
    console.log('🎉 Financial stats API is working correctly!');
  })
  .catch(error => {
    console.error('❌ API Test Failed:', error);
    console.log('💡 This means either:');
    console.log('  1. Backend server is not running');
    console.log('  2. Wrong API endpoint URL');
    console.log('  3. Network connectivity issue');
    console.log('');
    console.log('💡 To fix:');
    console.log('  1. Start backend: cd server && npm run dev');
    console.log('  2. Ensure server runs on http://localhost:5050');
    console.log('  3. Check browser network tab for the failed request');
  });

console.log('Test started... check output above ↑');