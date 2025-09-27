#!/bin/bash

# Test script for Vercel deployment
echo "Testing Vercel Serverless Functions..."

# Test auth endpoint
echo "Testing auth endpoint..."
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'

echo -e "\n\nTesting record endpoint..."
curl http://localhost:3000/api/record

echo -e "\n\nTesting properties endpoint..."
curl http://localhost:3000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

echo -e "\n\nDone!"