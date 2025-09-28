#!/bin/bash

echo "Testing financial API endpoint with fresh user..."

# Create a unique test user
TEST_EMAIL="test$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123!"

echo "Step 1: Register test user..."
REGISTER_RESPONSE=$(curl -s -X POST https://sughar.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"phoneNumber\": \"555-123-4567\",
    \"role\": \"landlord\"
  }")

echo "Register response: $REGISTER_RESPONSE"

# Login with test user
echo "Step 2: Login with test user..."
LOGIN_RESPONSE=$(curl -s -X POST https://sughar.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "Login response: $LOGIN_RESPONSE"

# Extract token (simple approach - in real world you'd use jq)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token!"
  exit 1
fi

echo "Token extracted: ${TOKEN:0:50}..."

# Test financial stats endpoint
echo "Step 3: Get financial stats..."
STATS_RESPONSE=$(curl -s -X GET https://sughar.vercel.app/api/dashboard/financial-stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Financial stats response: $STATS_RESPONSE"