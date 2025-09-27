# API Test Script
# This script demonstrates how to interact with the SuGhar API

# 1. Register a new landlord
echo "=== Registering a new landlord ==="
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "123-456-7890",
    "role": "landlord",
    "password": "securePassword123"
  }' | json_pp

echo -e "\n\n"

# 2. Register a tenant
echo "=== Registering a new tenant ==="
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "987-654-3210",
    "role": "tenant",
    "password": "tenantPassword123"
  }' | json_pp

echo -e "\n\n"

# 3. Register a contractor
echo "=== Registering a new contractor ==="
curl -X POST http://localhost:5050/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mike",
    "lastName": "Wilson",
    "email": "mike.wilson@example.com",
    "phoneNumber": "555-123-4567",
    "role": "contractor",
    "password": "contractorPassword123",
    "companyName": "Wilson Plumbing",
    "serviceSpecialty": "Plumbing",
    "licenseNumber": "PL123456",
    "description": "Professional plumbing services with 15 years experience",
    "website": "https://wilsonplumbing.com",
    "businessAddress": "456 Business Ave"
  }' | json_pp

echo -e "\n\n"

# 4. Login as landlord
echo "=== Logging in as landlord ==="
LANDLORD_TOKEN=$(curl -s -X POST http://localhost:5050/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Landlord token: $LANDLORD_TOKEN"
echo -e "\n\n"

# 5. Create a property
echo "=== Creating a property ==="
PROPERTY_RESPONSE=$(curl -s -X POST http://localhost:5050/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LANDLORD_TOKEN" \
  -d '{
    "address": "123 Main Street, Springfield, IL",
    "propertyType": "Apartment Complex"
  }')

echo $PROPERTY_RESPONSE | json_pp

PROPERTY_ID=$(echo $PROPERTY_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['_id'])")
echo "Property ID: $PROPERTY_ID"
echo -e "\n\n"

# 6. Create units for the property
echo "=== Creating units ==="
curl -X POST http://localhost:5050/api/properties/$PROPERTY_ID/units \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LANDLORD_TOKEN" \
  -d '{
    "unitNumber": "1A",
    "squareFootage": 750,
    "bedrooms": 2,
    "bathrooms": 1,
    "monthlyRent": "1500.00",
    "status": "vacant"
  }' | json_pp

echo -e "\n\n"

curl -X POST http://localhost:5050/api/properties/$PROPERTY_ID/units \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $LANDLORD_TOKEN" \
  -d '{
    "unitNumber": "1B",
    "squareFootage": 850,
    "bedrooms": 2,
    "bathrooms": 1,
    "monthlyRent": "1650.00",
    "status": "vacant"
  }' | json_pp

echo -e "\n\n"

# 7. Get all properties
echo "=== Getting all properties ==="
curl -X GET http://localhost:5050/api/properties \
  -H "Authorization: Bearer $LANDLORD_TOKEN" | json_pp

echo -e "\n\n"

# 8. Get units for the property
echo "=== Getting units for property ==="
UNITS_RESPONSE=$(curl -s -X GET http://localhost:5050/api/properties/$PROPERTY_ID/units \
  -H "Authorization: Bearer $LANDLORD_TOKEN")

echo $UNITS_RESPONSE | json_pp

UNIT_ID=$(echo $UNITS_RESPONSE | python3 -c "import sys, json; units = json.load(sys.stdin); print(units[0]['_id'] if units else 'NO_UNITS')")
echo "Unit ID: $UNIT_ID"
echo -e "\n\n"

# 9. Login as tenant
echo "=== Logging in as tenant ==="
TENANT_TOKEN=$(curl -s -X POST http://localhost:5050/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "tenantPassword123"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Tenant token: $TENANT_TOKEN"
echo -e "\n\n"

# 10. Create a rental application
if [ "$UNIT_ID" != "NO_UNITS" ]; then
  echo "=== Creating rental application ==="
  curl -X POST http://localhost:5050/api/rental-applications \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TENANT_TOKEN" \
    -d '{
      "unitID": "'$UNIT_ID'",
      "monthlyIncome": 5000,
      "employmentStatus": "Full-time Software Developer",
      "references": [
        {
          "name": "Alice Johnson",
          "phone": "555-987-6543",
          "relationship": "Previous Landlord"
        }
      ],
      "notes": "Non-smoker, no pets, excellent credit score"
    }' | json_pp

  echo -e "\n\n"

  # 11. Create a service request
  echo "=== Creating service request ==="
  curl -X POST http://localhost:5050/api/service-requests \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TENANT_TOKEN" \
    -d '{
      "unitID": "'$UNIT_ID'",
      "description": "Kitchen faucet is leaking and needs repair",
      "priority": "medium"
    }' | json_pp
fi

echo -e "\n\n"

# 12. Get user profile
echo "=== Getting landlord profile ==="
curl -X GET http://localhost:5050/auth/profile \
  -H "Authorization: Bearer $LANDLORD_TOKEN" | json_pp

echo -e "\n\nAPI test completed successfully!"