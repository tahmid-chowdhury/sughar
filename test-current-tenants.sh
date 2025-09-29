#!/bin/bash

echo "Testing Current Tenants API Endpoint..."
echo "======================================"

# Test endpoint (assuming server is running on localhost:5050)
API_URL="http://localhost:5050/api/current-tenants"

# Test user credentials (modify as needed)
EMAIL="landlord@example.com"
PASSWORD="password123"

echo "Step 1: Login to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5050/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response (assuming JSON format {"token": "..."})
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token"
    echo "Please ensure:"
    echo "1. Server is running (npm start in /server directory)"
    echo "2. User exists with email: $EMAIL"
    echo "3. Database is connected"
    exit 1
fi

echo "✅ Got authentication token: ${TOKEN:0:20}..."
echo ""

echo "Step 2: Test Current Tenants endpoint..."
TENANTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" $API_URL)

echo "Current Tenants API Response:"
echo "=========================="
echo $TENANTS_RESPONSE | python3 -m json.tool 2>/dev/null || echo $TENANTS_RESPONSE

echo ""
echo "Step 3: Validate response structure..."

# Check if response is valid JSON and contains expected fields
if echo $TENANTS_RESPONSE | python3 -c "
import sys
import json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        if len(data) > 0:
            tenant = data[0]
            required_fields = ['id', 'name', 'avatar', 'rating', 'building', 'unit', 'leaseProgress', 'rentStatus', 'requests']
            missing_fields = [field for field in required_fields if field not in tenant]
            if missing_fields:
                print(f'❌ Missing fields: {missing_fields}')
                sys.exit(1)
            else:
                print(f'✅ Found {len(data)} tenants with correct structure')
                print(f'✅ Sample tenant: {tenant[\"name\"]} in {tenant[\"building\"]}, Unit {tenant[\"unit\"]}')
        else:
            print('✅ API returned empty array (no current tenants)')
    else:
        print(f'❌ Expected array, got: {type(data)}')
        sys.exit(1)
except json.JSONDecodeError as e:
    print(f'❌ Invalid JSON response: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ Validation error: {e}')
    sys.exit(1)
" 2>/dev/null; then
    echo "✅ API endpoint working correctly!"
else
    echo "❌ API response validation failed"
fi

echo ""
echo "Test completed!"