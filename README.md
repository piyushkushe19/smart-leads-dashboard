# Smart Leads Dashboard

> A production-ready full-stack Lead Management CRM built with the MERN stack, TypeScript, and TailwindCSS.

---

## Features

- **JWT Authentication** — Secure login/register with HTTP-only cookies and localStorage token strategy
- **Role-Based Access Control (RBAC)** — Admin (full access + delete + CSV export) and Sales User roles
- **Lead Management (CRUD)** — Create, view, edit, and delete leads with full form validation
- **Advanced Filtering** — Multi-filter by Status, Source, Name/Email search (debounced), and sort order — all working simultaneously
- **Backend Pagination** — skip/limit with metadata (total, page, totalPages, hasNext, hasPrev)
- **CSV Export** — Admin-only export of filtered leads
- **Dark Mode** — Persisted theme toggle
- **Responsive Design** — Mobile-first sidebar navigation, works on all screen sizes
- **Toast Notifications** — Feedback for all actions
- **Loading Skeletons & Empty States** — Polished UX at every state

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| TailwindCSS | Utility-first styling |
| React Router v6 | Client-side routing |
| TanStack React Query v5 | Server state management |
| React Hook Form + Zod | Form validation |
| Axios | HTTP client with interceptors |
| react-hot-toast | Toast notifications |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API server |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database + ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Zod | Environment validation |
| Helmet + CORS | Security |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ../frontend
cp .env.example .env
# Edit VITE_API_URL if needed (default: /api uses Vite proxy)
```

**Backend `.env`:**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Demo Data

```bash
cd backend
npm run seed
```

This creates demo users and 20 sample leads.

**Demo credentials:**
| Role | Email | Password |
|---|---|---|
| Admin | admin@smartleads.com | Admin@123 |
| Sales | sales@smartleads.com | Sales@123 |

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Docker Setup

### Using Docker Compose (recommended)

```bash
# From root directory
docker-compose up --build

# With custom JWT secret
JWT_SECRET=your_secret_here docker-compose up --build
```

Access the app at **http://localhost**

### Seed data in Docker

```bash
docker exec -it smartleads_backend node dist/database/seed.js
```

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment config & validation
│   │   ├── controllers/     # Route handlers
│   │   ├── database/        # DB connection & seed script
│   │   ├── middleware/       # Auth, error, validation middleware
│   │   ├── models/          # Mongoose schemas (User, Lead)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic layer
│   │   ├── types/           # TypeScript interfaces & enums
│   │   ├── utils/           # Helpers (AppError, asyncHandler, queryBuilder, csv)
│   │   ├── validators/      # express-validator chains
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + typed API functions
│   │   ├── components/
│   │   │   ├── ui/          # Reusable: Button, Input, Select, Modal, Badge, Pagination, Skeleton...
│   │   │   ├── layout/      # Sidebar, Navbar
│   │   │   ├── leads/       # LeadTable, LeadForm, LeadFilters, LeadDetailModal
│   │   │   └── dashboard/   # StatCard, StatusDistribution, SourceBreakdown
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useLeads, useDebounce
│   │   ├── layouts/         # DashboardLayout
│   │   ├── pages/           # LoginPage, RegisterPage, DashboardPage, LeadsPage, NotFoundPage
│   │   ├── routes/          # ProtectedRoute
│   │   ├── styles/          # globals.css
│   │   ├── types/           # Shared TypeScript types
│   │   ├── constants/       # Status/source colors, debounce delay
│   │   ├── App.tsx          # Router + providers
│   │   └── main.tsx         # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Rahul@123",
  "role": "sales"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "rahul@example.com", "role": "sales" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### POST /auth/login
Login with credentials.

**Request Body:**
```json
{ "email": "admin@smartleads.com", "password": "Admin@123" }
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": { ... }, "token": "..." }
}
```

---

#### POST /auth/logout
Logout (clears cookie). Requires authentication.

#### GET /auth/profile
Get current user profile. Requires authentication.

---

### Leads Endpoints

All leads endpoints require `Authorization: Bearer <token>` header.

#### GET /leads
Get paginated leads with filters.

**Query Parameters:**
| Param | Type | Example |
|---|---|---|
| status | string | `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | `Website`, `Instagram`, `Referral` |
| search | string | `Rahul` |
| sort | string | `latest` (default) or `oldest` |
| page | number | `1` |
| limit | number | `10` (default) |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=Rahul&page=1`

**Response (200):**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "items": [{ "_id": "...", "name": "Rahul Sharma", "email": "...", "status": "Qualified", "source": "Instagram", "createdBy": { "name": "Admin", "email": "..." }, "createdAt": "..." }],
    "pagination": {
      "total": 42,
      "page": 1,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### GET /leads/stats
Get aggregate stats by status and source. Requires auth.

#### GET /leads/export *(Admin only)*
Download leads as CSV with active filters applied.

#### POST /leads
Create a new lead.

**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram"
}
```

#### GET /leads/:id
Get single lead by ID.

#### PUT /leads/:id
Update a lead. Send only fields to update.

```json
{ "status": "Qualified" }
```

#### DELETE /leads/:id *(Admin only)*
Delete a lead permanently.

---

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email" }
  ]
}
```

### HTTP Status Codes
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g. email already exists) |
| 500 | Internal Server Error |

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build

# Or connect GitHub repo to Vercel
# Set VITE_API_URL=https://your-backend.render.com/api
```

### Backend → Render / Railway

1. Push backend to GitHub
2. Create new Web Service on Render, point to `/backend`
3. Set environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://...` (MongoDB Atlas)
   - `JWT_SECRET=...` (min 32 chars)
   - `FRONTEND_URL=https://your-frontend.vercel.app`
4. Build command: `npm install && npm run build`
5. Start command: `node dist/server.js`

### MongoDB → Atlas

1. Create free cluster at mongodb.com/atlas
2. Create database user and whitelist IPs (0.0.0.0/0 for cloud)
3. Copy connection string to `MONGODB_URI`
4. Run seed: `MONGODB_URI=... npm run seed`

---

## Suggested Git Commits

```
feat: initialize MERN project with TypeScript and folder structure
feat: implement User model with bcrypt password hashing
feat: implement JWT auth (register, login, logout, profile)
feat: implement RBAC middleware (admin/sales roles)
feat: implement Lead model with indexed fields
feat: implement leads CRUD with service layer
feat: implement advanced filtering and query builder utility
feat: implement backend pagination with metadata
feat: implement CSV export for admin users
feat: implement seed script with demo users and leads
feat: implement global error handler and AppError class
feat: setup Express app with Helmet, CORS, cookie-parser
feat: setup Docker configuration (Dockerfile + compose)
feat: initialize React frontend with Vite, TypeScript, Tailwind
feat: implement AuthContext with persistent login
feat: implement ThemeContext with dark mode toggle
feat: implement Axios instance with request/response interceptors
feat: implement React Query hooks for leads (useLeads, useCreateLead...)
feat: implement useDebounce hook for search
feat: build reusable UI components (Button, Input, Select, Modal...)
feat: build Sidebar navigation and Navbar components
feat: implement ProtectedRoute with role-based access
feat: build DashboardPage with stat cards and charts
feat: build LeadsPage with table, filters, pagination, CRUD modals
feat: implement debounced search with query param sync
feat: build LeadForm with Zod validation and React Hook Form
feat: build Login and Register pages with demo credential quick-fill
feat: add loading skeletons, empty states, and error states
feat: implement toast notifications for all user actions
fix: handle 401 errors globally in Axios interceptor
chore: add README, .env.example, and API documentation
```

---

## Screenshots

> *(Add screenshots after running the project)*

| Page | Description |
|---|---|
| Login | Split-panel auth with demo quick-fill buttons |
| Dashboard | Stat cards, pipeline bar chart, source breakdown |
| Leads | Filterable table with inline actions, pagination |
| Dark Mode | Full dark theme toggle |

---

## License

MIT © Smart Leads Dashboard
