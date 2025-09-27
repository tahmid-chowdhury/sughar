// Debug script to test dashboard functionality
// Run this in your browser console on the deployed site

console.log('=== Dashboard Debug Script ===');

// Check if we're on the right page
console.log('Current URL:', window.location.href);

// Check localStorage for auth token
const token = localStorage.getItem('authToken');
console.log('Auth token in localStorage:', token ? 'Present' : 'Missing');
if (token) {
  console.log('Token preview:', token.substring(0, 20) + '...');
}

// Test API base URL
const API_BASE_URL = '/api';
console.log('API_BASE_URL:', API_BASE_URL);

// Test basic API connectivity
async function testConnectivity() {
  try {
    console.log('\n1. Testing basic API connectivity...');
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ API Health:', healthData);
    
    console.log('\n2. Testing database connection...');
    const dbResponse = await fetch('/api/db-test');
    const dbData = await dbResponse.json();
    console.log('Database test:', dbData);
    
    if (!token) {
      console.log('\n3. No token found - testing login...');
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'monir@ashaproperties.com',
          password: 'password123'
        })
      });
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginData.token) {
        localStorage.setItem('authToken', loginData.token);
        console.log('✅ Token saved to localStorage');
      }
    }
    
    console.log('\n4. Testing dashboard API...');
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      const dashboardResponse = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });
      console.log('Dashboard response status:', dashboardResponse.status);
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard data:', dashboardData);
    } else {
      console.log('❌ No token available for dashboard test');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testConnectivity();

// Also check if there are any React error boundaries triggered
setTimeout(() => {
  const errorElements = document.querySelectorAll('[data-error], .error, .alert-danger');
  if (errorElements.length > 0) {
    console.log('Found error elements on page:', errorElements);
  }
}, 2000);