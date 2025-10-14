<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SuGhar v2 - Property Management System

A modern, intuitive SaaS platform for landlords and tenants in the real estate sector. Built with React, TypeScript, and Vite.

View your app in AI Studio: https://ai.studio/apps/drive/1KGyq6tDOZ5atbb_gTYCP67V_iikzTHEz

## Features

- **Dashboard Overview**: Real-time insights into portfolio performance, occupancy rates, and financial metrics
- **Building & Unit Management**: Track properties, units, occupancy status, and rental details
- **Tenant Management**: Manage current tenants, review applications, track lease expirations
- **Service Requests**: Handle maintenance requests with priority tracking and assignment
- **Document Management**: Organize leases, invoices, permits, and other important documents
- **Financial Tracking**: Monitor income, expenses, rent collection, and profitability
- **User Authentication**: Secure login system (demo mode with sample credentials)

## Project Structure

```
sughar-v2/
├── components/          # React components organized by feature
│   ├── Layout.tsx      # Main layout wrapper with sidebar/header
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Header.tsx      # Top header with user info
│   ├── *Dashboard.tsx  # Dashboard pages (Home, Financials, Tenants, etc.)
│   ├── *Page.tsx       # Feature-specific pages
│   ├── *Form.tsx       # Form components for data entry
│   ├── charts/         # Chart components using Recharts
│   └── icons.tsx       # Icon components library
├── types.ts            # TypeScript type definitions
├── data.ts             # Mock data generator
├── constants.tsx       # Static constants and configurations
├── App.tsx             # Root component with routing logic
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling (via inline classes)
- **Lucide Icons** - Icon library

## Architecture

### State Management
- All application state is managed at the root level in `App.tsx`
- State is passed down to components via props
- In production, this would be replaced with a state management library (Redux, Zustand, etc.)

### Data Flow
1. **Initial Data**: Generated in `data.ts` and loaded into `App.tsx`
2. **User Actions**: Trigger handler functions in `App.tsx`
3. **State Updates**: Immutable state updates using React's `setState`
4. **Re-render**: Components receive new props and update UI

### Routing
- Simple page-based routing using state (`currentPage`)
- No external router library (keeps the app lightweight)
- Detail views tracked with separate state variables (e.g., `viewingBuildingId`)

### Components
- **Pages**: Full-page components for different views
- **Forms**: Reusable form components for data entry
- **Charts**: Visualization components wrapping Recharts
- **Layout**: Structural components (Sidebar, Header, etc.)

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (optional, for AI features)

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Demo Credentials

- **Email**: `demo@sughar.com`
- **Password**: `demo`

OR

- **Email**: `monir@ashaproperties.com`
- **Password**: `password123`

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Key Files to Understand

- **`types.ts`**: All TypeScript interfaces and enums - start here to understand data structures
- **`App.tsx`**: Main application logic, routing, and state management
- **`data.ts`**: Mock data generation - shows how data is structured and interconnected
- **`constants.tsx`**: Static data and configurations used throughout the app

## Development Notes

### Adding a New Page
1. Create component in `components/` directory
2. Import it in `App.tsx`
3. Add case to `renderPage()` switch statement
4. Add navigation link in `Sidebar.tsx`

### Adding New Data Types
1. Define interface in `types.ts`
2. Add to `AppData` interface
3. Initialize in `data.ts`
4. Update handlers in `App.tsx` if needed

### Styling
- Uses Tailwind CSS classes inline
- Color scheme: Blue primary, with accent colors for different categories
- Responsive design with mobile-first approach

## Future Enhancements

- Backend API integration
- Real authentication with JWT
- Advanced analytics and reporting
- Email notifications
- Mobile app version
- Multi-language support
- Payment processing integration

## License

Proprietary - All rights reserved
