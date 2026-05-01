# Lead Management Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

A full-stack lead management application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Lead CRUD operations with validation
- User authentication and role-based access control
- Real-time search and filtering
- Pipeline status tracking
- API key management
- Email logging
- Webhook integration
- Responsive design
- Data analytics dashboard
- Toast notifications
- Pagination
- Database seeding

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom JWT-based session handling
- **State Management:** React Context & Server Components
- **Notifications:** React Hot Toast
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Lead-Management
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lead_management"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. Set up the database
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed sample data (optional)
   ```bash
   npm run seed
   ```

6. Start the development server
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

### Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## Project Structure

```
Lead-Management/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── api-keys/
│   │   ├── email-logs/
│   │   ├── leads/
│   │   ├── user/
│   │   └── webhooks/
│   ├── admin/
│   ├── leads/
│   ├── login/
│   ├── register/
│   ├── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── svg/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── api-key.ts
├── types/
├── public/
└── package.json
```

## Data Model

### Lead
| Field | Type | Required |
|-------|------|----------|
| id | String (CUID) | Yes |
| name | String | Yes |
| email | String (unique) | Yes |
| phone | String | No |
| company | String | No |
| status | Enum (NEW, CONTACTED, QUALIFIED, LOST, CONVERTED) | Yes |
| notes | String | No |
| createdAt | DateTime | Yes |
| updatedAt | DateTime | Yes |

### User
| Field | Type | Required |
|-------|------|----------|
| id | String (CUID) | Yes |
| email | String (unique) | Yes |
| name | String | No |
| role | Enum (USER, ADMIN) | Yes |
| password | String | Yes |
| emailNotifications | Boolean | Yes |
| createdAt | DateTime | Yes |
| updatedAt | DateTime | Yes |

### ApiKey
| Field | Type | Required |
|-------|------|----------|
| id | String (CUID) | Yes |
| name | String | Yes |
| key | String (hashed) | Yes |
| prefix | String | Yes |
| lastUsedAt | DateTime | No |
| isActive | Boolean | Yes |
| createdAt | DateTime | Yes |

### EmailLog
| Field | Type | Required |
|-------|------|----------|
| id | String (CUID) | Yes |
| to | String | Yes |
| subject | String | Yes |
| type | String | Yes |
| status | String | Yes |
| error | String | No |
| leadId | String | No |
| userId | String | Yes |
| createdAt | DateTime | Yes |

## API Reference

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - End session

### Leads
- `GET /api/leads` - List leads (with filtering)
- `POST /api/leads` - Create lead
- `GET /api/leads/[id]` - Get lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead
- `GET /api/leads/stats` - Lead statistics

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile/password` - Update password

### API Keys
- `GET /api/api-keys` - List keys
- `POST /api/api-keys` - Create key
- `DELETE /api/api-keys/[id]` - Delete key

### Email Logs
- `GET /api/email-logs` - List logs
- `GET /api/email-logs/[id]` - Get log

### Webhooks
- `POST /api/webhooks/leads` - Receive lead data

## Contributing

Contributions are welcome. Please submit a Pull Request.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.