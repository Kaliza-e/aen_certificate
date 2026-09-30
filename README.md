# AEN Certificate Generator

A premium, professional web-based certificate generation system for **African Entrepreneurs Network (AEN)**.

## Features

- 🔐 Admin-only authentication (JWT)
- 📋 Live certificate preview
- 🎨 Premium AEN-branded certificate design
- 📄 PDF generation (A4 landscape, print-ready)
- 🔲 QR code verification
- ✍️ Signatory management with signature uploads
- 🏷️ Brand/logo management
- 📊 Certificate history with search
- 🚫 Certificate revocation
- 📦 Bulk CSV generation
- 📱 Responsive admin dashboard

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Framer Motion  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose  
**PDF:** Puppeteer (Chromium)  
**Auth:** JWT + bcrypt

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string

### Setup

```bash
# Backend
cd backend
cp .env.example .env    # Edit with your MongoDB URI and secrets
npm install
npm run seed            # Creates demo admin + sample data
npm run dev             # Starts on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev             # Starts on port 5173
```

### Default Admin Login

- **Email:** admin@aen.org
- **Password:** Admin@AEN2026!

## Environment Variables

See `backend/.env.example`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `PORT` | Backend port (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS |

## PDF Generation

Requires Puppeteer (Chromium). Puppeteer downloads Chromium automatically on first run.

## Project Structure

```
backend/
  src/
    models/        # Mongoose models
    routes/        # Express routes
    middleware/     # Auth, error handling
    utils/         # PDF generation, QR codes
    seeds/         # Demo data seeding
frontend/
  src/
    components/    # React components
    pages/         # Login, Dashboard
    hooks/         # Auth context
    services/      # API client
```

## License

Internal use — African Entrepreneurs Network



ODOs
