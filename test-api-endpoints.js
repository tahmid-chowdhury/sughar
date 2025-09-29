// Simple test to verify API endpoints are working
// Run this in the browser console to test API connections

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...');
  
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('❌ No auth token found. Please log in first.');
    return;
  }
  
  console.log('✅ Auth token found');
  
  const endpoints = [
    { name: 'Properties', url: '/api/properties' },
    { name: 'Units', url: '/api/units' },
    { name: 'Current Tenants', url: '/api/current-tenants' },
    { name: 'Rental Applications', url: '/api/rental-applications' },
    { name: 'All Tenants', url: '/api/tenants' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing ${endpoint.name}...`);
      
      const response = await fetch(endpoint.url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: Success (${Array.isArray(data) ? data.length : 'object'} items)`);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log(`Sample data:`, data[0]);
        } else if (Array.isArray(data)) {
          console.log(`Empty array returned`);
        } else {
          console.log(`Response:`, data);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${endpoint.name}: Error ${response.status}`);
        console.error(`Error details:`, errorText);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name}: Network error`, error);
    }
  }
  
  console.log('\n🏁 API endpoint testing completed');
}

// Auto-run the test
testAPIEndpoints();

// Also make it available globally for manual testing
window.testAPIEndpoints = testAPIEndpoints;

console.log('API Test loaded. Run testAPIEndpoints() in console to test endpoints.');