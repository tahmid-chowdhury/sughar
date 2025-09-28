const jwt = require('jsonwebtoken');
const axios = require('axios');

// Test the financial API endpoint
async function testFinancialAPI() {
  try {
    // First login to get a token
    const loginResponse = await axios.post('https://sughar.vercel.app/api/login', {
      email: 'monir@ashaproperties.com',
      password: 'MonirAsha2025!'
    });

    console.log('Login response:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // Now test the financial stats endpoint
    const statsResponse = await axios.get('https://sughar.vercel.app/api/dashboard/financial-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Financial stats response:', statsResponse.data);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testFinancialAPI();