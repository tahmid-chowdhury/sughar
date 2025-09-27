console.log('=== Dashboard Debug Test ===');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    console.log('Running in browser environment');
    
    // Test API configuration
    const API_BASE_URL = '/api';
    console.log('API_BASE_URL:', API_BASE_URL);
    
    // Test login
    async function testLoginFlow() {
        console.log('\n1. Testing login...');
        
        try {
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "monir@ashaproperties.com",
                    password: "password123"
                })
            });
            
            console.log('Login response status:', loginResponse.status);
            const loginData = await loginResponse.json();
            console.log('Login response data:', loginData);
            
            if (loginData.token) {
                // Store token
                localStorage.setItem('authToken', loginData.token);
                console.log('✅ Login successful, token stored');
                
                // Test profile endpoint
                console.log('\n2. Testing profile endpoint...');
                const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                console.log('Profile response status:', profileResponse.status);
                const profileData = await profileResponse.json();
                console.log('Profile response data:', profileData);
                
                if (profileResponse.ok) {
                    console.log('✅ Profile fetch successful');
                    
                    // Test dashboard API
                    console.log('\n3. Testing dashboard API...');
                    const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/stats`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${loginData.token}`
                        }
                    });
                    
                    console.log('Dashboard response status:', dashboardResponse.status);
                    const dashboardData = await dashboardResponse.json();
                    console.log('Dashboard response data:', dashboardData);
                    
                    if (dashboardResponse.ok) {
                        console.log('✅ Dashboard API successful');
                        console.log('Properties:', dashboardData.properties);
                        console.log('Total Units:', dashboardData.totalUnits);
                        console.log('Occupancy Rate:', dashboardData.occupancyRate);
                    } else {
                        console.log('❌ Dashboard API failed');
                    }
                } else {
                    console.log('❌ Profile fetch failed');
                }
            } else {
                console.log('❌ Login failed');
            }
        } catch (error) {
            console.error('Error during testing:', error);
        }
    }
    
    // Run the test
    testLoginFlow();
} else {
    console.log('Running in Node.js environment - browser APIs not available');
}