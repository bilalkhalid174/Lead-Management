# Lead Management Dashboard

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive, full-stack lead management application built with modern web technologies. Features include lead CRUD operations, user authentication, role-based access control, real-time filtering, and insightful analytics.

## ✨ Features

- **Lead Management**: Full CRUD operations with form validation and error handling
- **User Authentication**: Secure login/logout system with protected routes
- **Role-Based Access**: Admin and user roles with differentiated permissions
- **Real-time Search & Filter**: Instant filtering by name, email, company, and status
- **Status Tracking**: Pipeline visualization with New, Contacted, Qualified, Lost, Converted stages
- **Data Analytics**: Statistics dashboard showing lead distribution by status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Toast Notifications**: Immediate feedback for all user actions
- **Confirmation Modals**: Prevent accidental deletions with confirmation dialogs
- **Pagination**: Efficient navigation through large datasets
- **Database Seeding**: Sample data for quick development and testing

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | Custom Next.js API routes with JWT-like session handling |
| **UI Components** | Custom React components with Tailwind CSS |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |
| **State Management** | React Context & Server Components |
| **Deployment** | Vercel (recommended) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [PostgreSQL](https://www.postgresql.org/) database (local or cloud-hosted)
- Package manager: [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Lead-Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lead_management"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```
   Replace the connection string with your actual PostgreSQL credentials and generate a secure secret for authentication.

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   ```
   This command creates the database schema based on your Prisma models.

5. **Seed sample data** (optional but recommended)
   ```bash
   npm run seed
   ```
   Populates the database with sample leads and an admin user.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Default Admin Credentials (after seeding)
- **Email**: admin@example.com
- **Password**: admin123

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Create production-optimized build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npx prisma studio` | Open Prisma Studio to visualize and edit data |
| `npm run seed` | Populate database with sample data |

## 🗂️ Project Structure

```
Lead-Management/
├── app/
│   ├── api/
│   │   ├── auth/             # Authentication endpoints
│   │   │   ├── register/     # User registration
│   │   │   ├── login/        # User login
│   │   │   └── logout/       # User logout
│   │   ├── leads/            # Lead CRUD operations
│   │   │   ├── [id]/         # Individual lead operations
│   │   │   └── stats/        # Lead statistics endpoint
│   │   └── user/             # User profile management
│   ├── admin/                # Admin-only routes
│   │   └── user/[id]/        # User management
│   ├── leads/                # Leads dashboard page
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── settings/             # User settings page
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home dashboard with stats
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── LeadTable.tsx     # Data table with sorting/pagination
│   │   ├── LeadModal.tsx     # Create/edit lead form
│   │   ├── LeadFilters.tsx   # Search and filter controls
│   │   ├── StatsBar.tsx      # Statistics overview
│   │   └── Navbar.tsx        # Navigation bar with auth state
│   ├── layout/               # Layout components
│   └── svg/                  # SVG icon components
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── seed.ts               # Sample data seeder
├── lib/                      # Utility functions
│   ├── auth.ts               # Authentication helpers
│   └── prisma.ts             # Prisma client instance
├── types/                    # TypeScript type definitions
│   └── next-auth.d.ts        # NextAuth type extensions
├── public/                   # Static assets
└── package.json
```

## 💾 Data Model

### Lead Entity

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

### Lead Status Values

- `NEW` — Fresh lead, no contact established
- `CONTACTED` — Initial outreach completed
- `QUALIFIED` — Validated interest and budget
- `LOST` — Deal lost or unresponsive prospect
- `CONVERTED` — Successfully closed/won deal

### User Entity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier |
| `email` | String | Yes | Unique email address |
| `name` | String | No | User's full name |
| `role` | Enum | Yes | User role (ADMIN or USER) |
| `password` | String | Yes | Hashed password |
| `createdAt` | DateTime | Yes | Account creation timestamp |
| `updatedAt` | DateTime | Yes | Last update timestamp |

## 🔌 API Reference

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Authenticate user |
| `/api/auth/logout` | POST | End user session |

### Leads

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | GET | Retrieve all leads (with filtering) |
| `/api/leads` | POST | Create a new lead |
| `/api/leads/[id]` | GET | Retrieve specific lead |
| `/api/leads/[id]` | PUT | Update existing lead |
| `/api/leads/[id]` | DELETE | Delete lead |
| `/api/leads/stats` | GET | Get lead count by status |

### User Profile

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/profile` | GET | Get current user profile |
| `/api/user/profile/password` | PUT | Update user password |

## 🎨 Design Principles

- **Minimalist UI**: Clean interface with focus on essential information
- **Consistent Styling**: Unified design system using Tailwind CSS utilities
- **Accessibility**: Proper semantic HTML and ARIA attributes
- **Performance**: Optimized data fetching with server components
- **Maintainability**: Modular component architecture with clear separation of concerns

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the excellent React framework
- [Tailwind Labs](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma Team](https://www.prisma.io/) for the type-safe ORM
- All contributors who help improve this project

---
