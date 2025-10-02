# Copilot Instructions for AI Agents

## Project Overview
- This is a full-stack property management dashboard built with React (TypeScript) for the frontend and Node.js/Express with a simple file-based API for the backend (see `api/`).
- The app is designed for local development and rapid prototyping, with a focus on dashboarding, document management, and service request workflows.

## Key Directories & Files
- `components/`: All major UI components and pages. Each page is a self-contained React component (e.g., `BuildingsPage.tsx`, `ServiceRequestsPage.tsx`).
- `api/`: Node.js backend with Express routes (`routes/`), data models (`models/`), and entrypoints (`server.js`, `db.js`).
- `types.ts`: Central location for TypeScript types shared across the frontend.
- `data.ts`: Contains mock/sample data for local development.
- `constants.tsx`: App-wide constants and enums.

## Developer Workflows
- **Start app locally:**
  - `npm install` (install dependencies)
  - `npm run dev` (start Vite dev server)
  - Backend runs from `api/server.js` (may require manual start if not integrated with frontend dev server)
- **Environment variables:**
  - Set `GEMINI_API_KEY` in `.env.local` for AI features.
- **No formal test suite** is present; manual testing via the UI is standard.

## Project Conventions & Patterns
- **Component structure:**
  - Pages and major UI elements are in `components/`, named by feature (e.g., `BuildingsPage.tsx`).
  - Charts are in `components/charts/` and are used in dashboard pages.
- **Data flow:**
  - Most data is passed via props; some pages use mock data from `data.ts`.
  - Backend API endpoints are defined in `api/routes/` and use models from `api/models/`.
- **Styling:**
  - No CSS framework detected; styling is likely inline or via simple CSS files (not shown in structure).
- **TypeScript:**
  - Use types from `types.ts` for props and API responses.
- **No Redux or global state management**; state is local to components or passed via props.

## Integration Points
- **AI/LLM features:**
  - Requires `GEMINI_API_KEY` for Gemini API integration (details not in repo, but referenced in README).
- **Backend:**
  - Express server in `api/server.js` exposes REST endpoints for property, unit, service request, and user data.
  - Models in `api/models/` define data shape for backend.

## Examples
- To add a new dashboard, create a new component in `components/`, import it in `App.tsx`, and add a route if using a router.
- To add a new API endpoint, define a route in `api/routes/` and a model in `api/models/` if needed.

## Tips for AI Agents
- Prefer using existing types and mock data for new features.
- Follow the file naming and placement conventions for new pages/components.
- Reference `README.md` for setup and environment details.
- If unsure about data shape, check `types.ts` and `api/models/`.
