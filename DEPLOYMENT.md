# Vercel Deployment Guide for Sughar

## Project Structure Changes

Your backend has been refactored to use Vercel Serverless Functions. Here's what was changed:

### 1. New API Structure
- Created `/api/` directory with serverless functions
- Moved models to `/api/models/`
- Created utility functions in `/api/_utils/`
- API routes are now handled by serverless functions

### 2. Key Files Created
- `/api/auth/[...slug].js` - Handles authentication (register, login, verify)
- `/api/[...slug].js` - Handles main API routes (properties, units, service requests, etc.)
- `/api/record/[...slug].js` - Handles record CRUD operations
- `/api/_utils/db.js` - Database connection utility
- `/api/_utils/auth.js` - Authentication utilities
- `/vercel.json` - Vercel deployment configuration
- `/package.json` - Root package.json with API dependencies
- `/client/src/vite-env.d.ts` - TypeScript environment definitions

### 3. Client API Configuration Updated
- Updated API base URL to work with both development and production
- Added environment variable support for `VITE_API_URL`

## Deployment Steps

### Step 1: Environment Variables
In your Vercel dashboard, set these environment variables:
- `ATLAS_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key

### Step 2: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set the root directory to `/` (the monorepo root)
3. Vercel will automatically detect the `vercel.json` configuration
4. Deploy!

### Step 3: Update Client Environment (Optional)
If you want to use a different API URL in production, set:
- `VITE_API_URL` - Custom API URL (optional, defaults to `/api` in production)

## API Endpoints

All API endpoints are now available at:
- Production: `https://your-domain.vercel.app/api/...`
- Development: `http://localhost:5050/...` (if running the old server)

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Main API Endpoints
- `GET/POST /api/properties` - Properties CRUD
- `GET/POST /api/units` - Units CRUD
- `GET/POST /api/service-requests` - Service requests CRUD
- `GET/POST /api/rental-applications` - Rental applications CRUD

### Record Endpoints (Legacy)
- `GET/POST/PATCH/DELETE /api/record` - Record operations

## Development

### For Frontend Development
```bash
cd client
npm run dev
```

### For Full-Stack Development with Vercel CLI
```bash
npm install -g vercel
vercel dev
```

This will start both the frontend and serverless functions locally.

## Troubleshooting

### "Failed to fetch" Error
This error was likely caused by:
1. Frontend trying to call `/api/...` routes that didn't exist on Vercel
2. CORS issues
3. Missing environment variables

The serverless functions now:
- Handle CORS automatically
- Use the same environment variables as your original server
- Provide the same API endpoints

### Database Connection
The serverless functions use connection pooling to avoid database connection issues common with serverless architectures.

### Authentication
JWT tokens work the same way as before, but are now handled by serverless functions.

## Migration from Original Server

If you want to keep using the original Express server for development:
1. The original server files are still in `/server/`
2. Set `VITE_API_URL=http://localhost:5050` in your client `.env` file
3. Run both client and server separately

For production, everything now runs on Vercel serverless functions.