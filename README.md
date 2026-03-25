# Qatalyst Backend

Express.js backend with Supabase integration for the Qatalyst queue management system.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm/yarn
- Supabase account

### 2. Installation

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your public Supabase API key
- `SUPABASE_SERVICE_KEY` - Your service role key
- `JWT_SECRET` - Your JWT secret key

### 4. Database Setup

1. Login to your Supabase project
2. Go to SQL Editor
3. Run the schema from `scripts/schema.sql`
4. (Optional) Run the seed data from `scripts/seed.sql`

### 5. Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### Organizations
- `GET /api/organizations` - Get all organizations (Super Admin)
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create organization (Super Admin)
- `PUT /api/organizations/:id` - Update organization

### Branches
- `GET /api/branches` - Get branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create branch
- `PUT /api/branches/:id` - Update branch

### Staff
- `GET /api/staff` - Get staff members
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create staff member
- `PUT /api/staff/:id` - Update staff member

### Devices
- `GET /api/devices` - Get devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create device
- `PUT /api/devices/:id` - Update device

### Services
- `GET /api/services` - Get services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Tickets
- `GET /api/tickets` - Get tickets
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket status

### Queue
- `GET /api/queue` - Get all queue statuses
- `GET /api/queue/status/:branchId` - Get queue status for branch

### Analytics
- `GET /api/analytics/dashboard` - Get analytics dashboard
- `GET /api/analytics/daily` - Get daily analytics
- `GET /api/analytics/services` - Get service distribution

### Audit Logs
- `GET /api/audit-logs` - Get audit logs
- `POST /api/audit-logs` - Create audit log

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification
- `PUT /api/notifications/:id/read` - Mark as read

### Billing
- `GET /api/billing/info` - Get billing information
- `GET /api/billing/invoices` - Get invoices
- `GET /api/billing/subscription` - Get subscription details

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/settings/features` - Get feature flags
- `GET /api/settings/integrations` - Get integrations

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Frontend Integration

Add this to your frontend's `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Role-Based Access Control

- `super_admin` - Full system access
- `org_admin` - Organization-level access
- `staff` - Limited staff access

## Error Handling

All errors return a JSON response with:

```json
{
  "error": {
    "message": "Error message",
    "status": 400
  }
}
```

## Health Check

```bash
curl http://localhost:5000/api/health
```

## License

ISC
