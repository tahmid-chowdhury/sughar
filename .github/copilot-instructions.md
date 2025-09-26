# Copilot Instructions for AI Agents

## Project Architecture

- **Monorepo** with two main folders:
  - `client/`: React + Vite frontend (TypeScript, Tailwind, MUI, Chart.js)
  - `server/`: Node.js backend (Express, MongoDB, REST API)

### Client (Frontend)
- **Entry point:** `src/App.tsx` (uses `Layout` and page components)
- **Navigation:** Controlled by `currentPage` state (not React Router)
- **UI Structure:**
  - Use `Layout` and `Sidebar` for page structure
  - Dashboard pages use `Card` and chart components from `src/components/charts/`
  - Shared UI in `src/components/` (see `Header.tsx`, `Sidebar.tsx`, `Card.tsx`)
  - Data and types centralized in `constants.tsx` and `types.ts`
  - Icons in `components/icons.tsx`
- **Styling:** Tailwind CSS, MUI, and custom classes
- **State/data:** Fetches from backend REST endpoints (see `server/routes/`)
- **TypeScript:** Used throughout client; types in `types.ts`

#### Key Workflows
- **Start dev server:** `npm run dev` (in `client/`)
- **Build for production:** `npm run build`
- **Lint:** `npm run lint`
- **Preview build:** `npm run preview`

#### Examples
- To add a dashboard: create a component in `src/components/`, add to `App.tsx`, update navigation in `Sidebar.tsx`
- To add a new page: follow the flat component structure, update `App.tsx` and `Sidebar.tsx`

### Server (Backend)
- **Entry point:** `server.js` (Express app)
- **Environment:** Configured via `config.env` (MongoDB URI, etc.)
- **Database:**
  - Uses MongoDB (native driver in `db/connection.js`)
  - Models in `models/` (some use Mongoose, some use native driver)
  - REST routes in `routes/` (e.g., `/record`, `/auth`)

#### Key Workflows
- **Start dev server:** `npm run dev` (in `server/`, uses `nodemon`)
- **Start prod server:** `npm start`

#### Examples
- To add an API route: create a file in `server/routes/`, register in `server.js`, (optionally) add a model in `models/`

## Project Conventions & Patterns
- **Frontend navigation** is state-driven, not URL-based
- **Component structure:** Flat, logic in page components; shared UI in `components/`
- **Data flow:** Frontend fetches from backend REST endpoints; backend exposes CRUD endpoints
- **No formal test setup** (as of this writing)
- **ESLint:** Configured in both client and server

## Integration Points
- **API:** Frontend expects backend at `/record` and similar endpoints
- **MongoDB:** Connection string in `config.env` (`ATLAS_URI`)
- **MUI, Tailwind, Chart.js:** Used for UI and charts

## References
- See `client/README.md` for Vite/React basics
- See `server/package.json` and `client/package.json` for scripts and dependencies
- For project-specific patterns, check `src/constants.tsx`, `src/types.ts`, and main dashboard components
