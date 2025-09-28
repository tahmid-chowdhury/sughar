#!/bin/bash

echo "Testing financial API endpoint..."

# First login to get token
echo "Step 1: Login..."
LOGIN_RESPONSE=$(curl -s -X POST https://sughar.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "monir@ashaproperties.com",
    "password": "MonirAsha2025!"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token (simple approach - in real world you'd use jq)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token!"
  exit 1
fi

echo "Token extracted: ${TOKEN:0:50}..."

# Test financial stats endpoint
echo "Step 2: Get financial stats..."
STATS_RESPONSE=$(curl -s -X GET https://sughar.vercel.app/api/dashboard/financial-stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "Financial stats response: $STATS_RESPONSE"