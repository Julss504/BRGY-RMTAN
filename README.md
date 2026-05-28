# Barangay R.M. Tan Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing barangay records, announcements, waste collection schedules, disaster alerts, and document requests.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router v6, Axios, Framer Motion, React Hook Form + Zod
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, multer
- **Database**: MongoDB Atlas

## Color Palette

- Primary: Navy Blue (#1e3a5f, #0f172a)
- Accent: Orange (#f97316, #ea580c)
- Font: Inter

## Setup Instructions

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

### Authentication & Roles

- Resident registration (pending approval)
- Admin approval/denial of registrations
- JWT-based authentication with httpOnly cookies
- Role-based route protection

### Resident Features

- Multi-step profile completion wizard
- Document request submission and tracking
- Announcements board
- Waste collection schedule viewer
- Disaster awareness center
- Notification center

### Admin Features

- Resident management with pending approvals
- Announcement management
- Waste schedule management
- Disaster alert management
- Document request processing
- Broadcast notifications

## API Endpoints

All API routes use `/api/v1/` prefix.

- `POST /auth/register` - Register new resident
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /auth/users` - Get all users (admin only)
- `PUT /auth/users/:id/status` - Update user status (admin only)

- `POST /profiles` - Create resident profile
- `GET /profiles/me` - Get my profile
- `PUT /profiles/me` - Update my profile

- `GET /announcements` - Get all announcements
- `POST /announcements` - Create announcement (admin only)
- `PUT /announcements/:id` - Update announcement (admin only)
- `DELETE /announcements/:id` - Delete announcement (admin only)

- `GET /waste-schedules` - Get waste schedules
- `POST /waste-schedules` - Create schedule (admin only)
- `PUT /waste-schedules/:id` - Update schedule (admin only)
- `DELETE /waste-schedules/:id` - Delete schedule (admin only)

- `GET /disaster-alerts` - Get disaster alerts
- `POST /disaster-alerts` - Create alert (admin only)
- `PUT /disaster-alerts/:id` - Update alert (admin only)
- `DELETE /disaster-alerts/:id` - Delete alert (admin only)

- `GET /document-requests` - Get user's requests
- `POST /document-requests` - Submit new request
- `PUT /document-requests/:id/status` - Update request status (admin only)

- `GET /notifications` - Get user's notifications
- `PUT /notifications/:id/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all as read
- `PUT /notifications/send` - Send broadcast notification (admin only)# BRGY-RM-TAN
