# SuGhar Property Management API

## Overview
This is the backend API for the SuGhar property management application. It provides REST endpoints for managing properties, units, tenants, service requests, and more.

## Database Schema
The application follows an entity-relationship model with the following main entities:

- **User**: Landlords, tenants, and contractors
- **Property**: Buildings owned by landlords
- **Unit**: Individual rental units within properties
- **RentalApplication**: Applications from tenants for units
- **ServiceRequest**: Maintenance requests from tenants
- **LeaseAgreement**: Rental contracts
- **Payment**: Rent and fee payments
- **Rating**: User ratings and reviews
- **Document**: File uploads and document storage
- **Contractor**: Service provider profiles

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB Atlas** account and connection string
3. **npm** or **yarn** package manager

## Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create or update `config.env` file with:
```
ATLAS_URI=your-mongodb-atlas-connection-string
PORT=5050
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Endpoints

#### Register a New User
```
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "phoneNumber": "123-456-7890",
  "role": "landlord", // or "tenant" or "contractor"
  "password": "securePassword123",
  // Additional fields for contractors:
  "companyName": "Doe Construction", // required for contractors
  "serviceSpecialty": "Plumbing", // required for contractors
  "licenseNumber": "LIC123456", // required for contractors
  "description": "Professional plumbing services",
  "website": "https://doeconstruction.com",
  "businessAddress": "123 Business St"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "123-456-7890",
    "role": "landlord",
    "createdAt": "2025-09-26T...",
    "updatedAt": "2025-09-26T..."
  }
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "landlord"
  }
}
```

#### Get User Profile
```
GET /auth/profile
Authorization: Bearer <jwt_token>
```

### Property Management Endpoints

#### Get All Properties
```
GET /api/properties
Authorization: Bearer <jwt_token>
```

#### Create a Property
```
POST /api/properties
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "address": "123 Main St, City, State",
  "propertyType": "Apartment Complex"
}
```

#### Get Specific Property
```
GET /api/properties/:id
Authorization: Bearer <jwt_token>
```

#### Update Property
```
PUT /api/properties/:id
Authorization: Bearer <jwt_token>
```

#### Delete Property
```
DELETE /api/properties/:id
Authorization: Bearer <jwt_token>
```

### Unit Management Endpoints

#### Get Units for a Property
```
GET /api/properties/:propertyId/units
Authorization: Bearer <jwt_token>
```

#### Create a Unit
```
POST /api/properties/:propertyId/units
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "unitNumber": "1A",
  "squareFootage": 750,
  "bedrooms": 2,
  "bathrooms": 1,
  "monthlyRent": "1500.00",
  "status": "vacant"
}
```

#### Update Unit
```
PUT /api/units/:id
Authorization: Bearer <jwt_token>
```

### Service Request Endpoints

#### Get All Service Requests
```
GET /api/service-requests
Authorization: Bearer <jwt_token>
```

#### Create Service Request
```
POST /api/service-requests
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "unitID": "unit_object_id",
  "description": "Leaky faucet in kitchen sink",
  "priority": "medium"
}
```

#### Update Service Request
```
PUT /api/service-requests/:id
Authorization: Bearer <jwt_token>
```

### Rental Application Endpoints

#### Get All Rental Applications
```
GET /api/rental-applications
Authorization: Bearer <jwt_token>
```

#### Create Rental Application
```
POST /api/rental-applications
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "unitID": "unit_object_id",
  "monthlyIncome": 5000,
  "employmentStatus": "Full-time",
  "references": [
    {
      "name": "Jane Smith",
      "phone": "987-654-3210",
      "relationship": "Previous Landlord"
    }
  ],
  "notes": "Non-smoker, no pets"
}
```

#### Update Application Status
```
PUT /api/rental-applications/:id
Authorization: Bearer <jwt_token>
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses have the format:
```json
{
  "error": "Error message description"
}
```

## Security Features

1. **JWT Authentication**: All protected routes require a valid JWT token
2. **Password Hashing**: User passwords are hashed using bcryptjs
3. **Role-Based Access**: Different user roles (landlord, tenant, contractor) have different permissions
4. **Input Validation**: Mongoose schemas provide data validation

## Database Relationships

- Users can own multiple Properties
- Properties contain multiple Units
- Users can submit RentalApplications for Units
- Users can create ServiceRequests for Units
- Contractors can be assigned to ServiceRequests
- LeaseAgreements link Users to Units
- Payments are tied to LeaseAgreements
- Documents can be associated with Users, Properties, or Units

## Development Notes

1. The API uses ES6 module syntax (`import/export`)
2. All models use Mongoose for MongoDB integration
3. Timestamps are automatically added to all documents
4. The server includes CORS support for frontend integration
5. Environment variables are loaded via dotenv

## Future Enhancements

- File upload endpoints for documents
- Email notifications
- Payment processing integration
- Advanced search and filtering
- Real-time notifications via WebSockets
- API rate limiting
- Request logging and monitoring