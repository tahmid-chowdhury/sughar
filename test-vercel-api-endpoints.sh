#!/bin/bash

echo "Testing Updated API Endpoints..."
echo "==============================="

# Base URL - adjust if needed
BASE_URL="https://sughar.vercel.app"  # Change to http://localhost:5050 for local testing

# Test user credentials (modify as needed)
EMAIL="landlord@example.com"
PASSWORD="password123"

echo "Step 1: Login to get JWT token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token"
    echo "Response was: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Got authentication token: ${TOKEN:0:20}..."
echo ""

echo "Step 2: Test Debug Lease Agreements endpoint..."
DEBUG_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/debug/lease-agreements")
echo "Debug Response:"
echo $DEBUG_RESPONSE
echo ""

echo "Step 3: Test Fixed Lease Agreements endpoint..."
LEASES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/lease-agreements")
echo "Lease Agreements Response:"
echo $LEASES_RESPONSE | head -c 200  # First 200 chars
echo ""

echo "Step 4: Test Current Tenants endpoint..."
TENANTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/current-tenants")
echo "Current Tenants Response:"
echo $TENANTS_RESPONSE | head -c 300  # First 300 chars
echo ""

echo "Step 5: Validate responses..."

# Check if responses contain expected data or error messages
if echo $LEASES_RESPONSE | grep -q "Error fetching lease agreements"; then
    echo "❌ Lease agreements endpoint still has errors"
else
    echo "✅ Lease agreements endpoint working"
fi

if echo $TENANTS_RESPONSE | grep -q "Error fetching current tenants"; then
    echo "❌ Current tenants endpoint has errors"
elif echo $TENANTS_RESPONSE | grep -q '\[\]'; then
    echo "✅ Current tenants endpoint working (empty data)"
elif echo $TENANTS_RESPONSE | grep -q '"name"'; then
    echo "✅ Current tenants endpoint working (with data)"
else
    echo "⚠️ Current tenants endpoint response unclear"
fi

echo ""
echo "Test completed!"
echo "=============="