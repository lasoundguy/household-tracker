# Household Tracker

A web application for tracking household objects across different locations.  Also an experiment in Claude Code capabilities.

## Features

- Multi-user access with authentication
- Photo uploads for items
- Search and filtering
- Location-based organization
- Movement history tracking

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **File Storage**: Cloudinary
- **Authentication**: JWT

## Project Structure

```
household-tracker/
├── client/          # React frontend
├── server/          # Node.js backend
└── README.md
```

## Quick Start

For detailed setup instructions, see [SETUP.md](SETUP.md)

### Prerequisites

- Node.js 18+ and npm
- Cloudinary account (free tier works)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your Cloudinary credentials and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

**First user to register becomes admin!**

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed local development setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## Deployment

- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway or Render
- **Database**: PostgreSQL on production

## License

MIT
