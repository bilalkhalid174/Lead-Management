# Lead Management Dashboard

A full-stack web application for managing sales leads with a modern, minimalist UI. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and PostgreSQL via Prisma ORM.

## Features

- **CRUD Operations** — Create, read, update, and delete leads with full form validation
- **Real-time Search** — Filter leads by name, email, or company
- **Status Filtering** — Filter by status: New, Contacted, Qualified, Lost, Converted
- **Sortable Columns** — Sort by name, company, or status (ascending/descending)
- **Pagination** — Navigate through large lead lists (10 items per page)
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Toast Notifications** — Success/error feedback for all user actions
- **Modal Confirmation** — Confirmation dialog before deleting leads

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma |
| UI Components | Custom React components |
| Notifications | react-hot-toast |
| Deployment | Vercel (recommended) |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted)
- npm or yarn package manager

### 1. Clone and Install

```bash
cd Lead-Management
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lead_management"
```

Replace the connection string with your actual PostgreSQL credentials.

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

This creates the `Lead` table with fields: `id`, `name`, `email`, `phone`, `company`, `status`, `notes`, `createdAt`, `updatedAt`.

### 4. Seed Sample Data

Populate the database with 15 sample leads:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard. The main leads page is at `/leads`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio to view/edit data |

## Data Model

### Lead Status Types

- `NEW` — Fresh lead, no contact yet
- `CONTACTED` — Initial outreach completed
- `QUALIFIED` — Validated interest/budget
- `LOST` — Deal lost or unresponsive
- `CONVERTED` — Successfully closed

### Lead Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique CUID identifier |
| `name` | String | Yes | Lead's full name |
| `email` | String | Yes | Unique email address |
| `phone` | String | No | Contact phone number |
| `company` | String | No | Associated company |
| `status` | Enum | Yes | Current pipeline stage |
| `notes` | String | No | Optional internal notes |
| `createdAt` | DateTime | Yes | Timestamp of creation |
| `updatedAt` | DateTime | Yes | Timestamp of last update |

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | GET | Fetch all leads |
| `/api/leads` | POST | Create new lead |
| `/api/leads/[id]` | PUT | Update lead by ID |
| `/api/leads/[id]` | DELETE | Delete lead by ID |
| `/api/leads/stats` | GET | Get lead statistics (status counts) |

All API routes use Next.js Route Handlers (app router) with Prisma ORM for PostgreSQL queries.

## Project Structure

```
Lead-Management/
├── app/
│   ├── api/
│   │   └── leads/          # API route handlers (GET, POST, PUT, DELETE)
│   ├── leads/              # Leads page (CRUD UI)
│   ├── layout.tsx          # Root layout with Toaster
│   ├── page.tsx            # Dashboard home page with stats
│   └── globals.css         # Global styles (Tailwind)
├── components/
│   ├── ui/
│   │   ├── LeadTable.tsx   # Responsive data table
│   │   ├── LeadModal.tsx   # Create/edit form modal
│   │   ├── LeadFilters.tsx # Search/filter controls
│   │   └── StatsBar.tsx    # Stats overview bar
│   ├── layout/
│   │   └── Navbar.tsx      # Top navigation bar
│   └── svg/
│       └── svg.tsx         # SVG icon components
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data seeding
└── package.json
```

## Notes

- The app uses a custom `getPrismaClient()` function to create a fresh Prisma instance per request, ensuring no stale database connections in serverless contexts
- All CRUD operations have full error handling with user-facing toast notifications
- Email uniqueness is enforced at the database level and validated in the API
- The UI follows a clean, design-system aesthetic with subtle borders and rounded corners
- Pagination is client-side after data fetch (adjustable if dataset grows very large)
