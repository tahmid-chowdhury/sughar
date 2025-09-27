// Test login functionality
const testLogin = async () => {
  const API_URL = 'https://your-domain.vercel.app'; // Replace with your actual domain
  
  console.log('Testing login with correct credentials...');
  
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'monir@ashaproperties.com',
        password: 'password123'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.token) {
      console.log('✅ Login successful!');
      
      // Test dashboard with the token
      console.log('\nTesting dashboard with token...');
      const dashboardResponse = await fetch(`${API_URL}/api/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log('Dashboard response status:', dashboardResponse.status);
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard data:', JSON.stringify(dashboardData, null, 2));
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Usage: Replace the API_URL with your actual Vercel domain and run this in browser console
console.log('Copy this script and run it in your browser console, replacing the API_URL with your actual domain');
console.log(testLogin.toString());