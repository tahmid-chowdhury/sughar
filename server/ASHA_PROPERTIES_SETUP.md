# Asha Properties Database Setup Instructions

This directory contains scripts to populate your database with the Asha Properties dummy data as specified.

## Files Created

1. **`populate-asha-properties.js`** - Main script to populate the database with all dummy data
2. **`verify-asha-data.js`** - Script to verify the data was created correctly

## Data Structure Created

### Organization Information
- **Company Name:** Asha Properties
- **Owner:** Monir Rahman
- **Portfolio:** 4 buildings | 28 total units | ~90% occupied

### Buildings & Units
1. **Lalmatia Court** (12 Units) - Units 1A-4A, 1B-4B, 1C-4C
2. **Banani Heights** (8 Units) - Units 1A-4A, 1B-4B  
3. **Dhanmondi Residency** (5 Units) - Units 1A-5A
4. **Uttara Gardens** (3 Units) - Units 1-3

### Key Features
- **Current Tenants:** All named tenants with proper lease end dates
- **Service Requests:** 9 service requests with SR-0001 through SR-0009 IDs
- **Rental Applications:** 6 rental applicants with detailed employment and income data
- **Ratings:** Previous tenant ratings where specified
- **Special Cases:** 
  - Unit 2A in Lalmatia Court is vacant (lease ended today) - clicking should prompt to rate former tenant Amrul Hoque
  - All lease end dates match the specification exactly

## How to Run

### Prerequisites
Make sure you have Node.js installed and your MongoDB connection is configured in `config.env`.

### Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Populate the database**:
   ```bash
   node populate-asha-properties.js
   ```

3. **Verify the data was created correctly**:
   ```bash
   node verify-asha-data.js
   ```

## Database Collections Created

- **Users:** Landlord (Monir Rahman), 27+ tenants, 6 rental applicants
- **Properties:** 4 buildings with proper addresses
- **Units:** 28 units with correct status (occupied/vacant), rent amounts
- **LeaseAgreements:** Active leases with proper start/end dates
- **ServiceRequests:** 9 service requests with proper descriptions and dates
- **RentalApplications:** 6 applications with employment and income details
- **Payments:** Recent payment history for current tenants
- **Ratings:** Tenant ratings where specified

## Important Notes

- All passwords are set to "password123" (hashed with bcrypt)
- Email addresses follow the pattern: firstname.lastname@example.com
- Phone numbers are in Bangladesh format (+880-17xx-xxxxxx)
- Lease end dates match exactly as specified in your requirements
- Service request dates are from September 2025 as specified
- Unit 2A (Lalmatia Court) is marked as vacant with former tenant data preserved for rating

## Troubleshooting

If you encounter any issues:

1. Make sure your MongoDB connection string in `config.env` is correct
2. Ensure you have proper network access to MongoDB Atlas
3. Check that all dependencies are installed (`npm install`)
4. Verify Node.js version compatibility (the project uses ES modules)

The scripts will clear existing data before populating, so you can run them multiple times safely.