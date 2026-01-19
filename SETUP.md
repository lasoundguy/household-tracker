# Setup Instructions

Follow these steps to get your Household Tracker application running locally.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js)
- Git

## Step 1: Clone the Repository

```bash
cd /Users/vikramkirby/Documents/Code
cd household-tracker
```

## Step 2: Backend Setup

### Install Dependencies

```bash
cd server
npm install
```

### Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
PORT=5000
DATABASE_URL=./database.sqlite
JWT_SECRET=change-this-to-a-long-random-string-minimum-32-characters
CLOUDINARY_CLOUD_NAME=your-cloud-name-from-cloudinary
CLOUDINARY_API_KEY=your-api-key-from-cloudinary
CLOUDINARY_API_SECRET=your-api-secret-from-cloudinary
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Get Cloudinary Credentials (for photo uploads)

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Paste them into your `.env` file

### Start the Backend Server

```bash
npm run dev
```

The backend will start on [http://localhost:5000](http://localhost:5000)

You should see:
```
Server running on port 5000
Environment: development
Database initialized successfully
Database seeded with default data
```

## Step 3: Frontend Setup

Open a new terminal window.

### Install Dependencies

```bash
cd client
npm install
```

### Configure Environment Variables

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Start the Frontend

```bash
npm start
```

The frontend will start on [http://localhost:3000](http://localhost:3000) and should automatically open in your browser.

## Step 4: Create Your First Account

1. Click "Register here" on the login page
2. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
3. Click "Register"

**Note:** The first user to register will automatically be an admin!

## Step 5: Start Using the App

### Add Locations

1. Go to "Locations" in the navigation
2. Click "Add Location"
3. Fill in:
   - Name (e.g., "Main House", "Garage", "Storage Unit")
   - Description (optional)
   - Address (optional)

Default locations are already added: Main House, Garage, Storage Unit, Basement, Attic

### Add Categories (Optional)

Default categories are already added:
- Tools
- Seasonal Items
- Documents
- Electronics
- Outdoor Equipment
- Kitchen Items
- Storage Boxes
- Other

You can add more categories from the "Categories" page.

### Add Your First Object

1. Go to "Objects" → "Add Object"
2. Fill in:
   - Name (required)
   - Description (optional)
   - Category (select from dropdown)
   - Location (select from dropdown)
   - Photo (optional, drag and drop or click to upload)
3. Click "Save Object"

### Search and Filter

From the Objects page, you can:
- Search by name or description
- Filter by category
- Filter by location
- Combine multiple filters

## Project Structure

```
household-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── db/           # Database setup
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── index.ts      # Server entry point
│   └── package.json
└── README.md
```

## Available Scripts

### Backend (server directory)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend (client directory)

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend:**
Change the PORT in `server/.env`

**Frontend:**
The app will prompt you to use a different port automatically.

### Database Errors

If you encounter database errors:

```bash
cd server
rm database.sqlite
npm run dev
```

This will recreate the database with fresh data.

### Module Not Found Errors

Make sure you've installed dependencies:

```bash
cd server && npm install
cd ../client && npm install
```

### Cloudinary Upload Fails

- Verify your Cloudinary credentials in `server/.env`
- Check that your image is under 5MB
- Make sure the backend server is running

### Cannot Connect to Backend

- Verify the backend is running on port 5000
- Check `REACT_APP_API_URL` in `client/.env`
- Make sure there are no CORS errors in browser console

## Next Steps

- Invite family members by having them register accounts
- Add your household items with photos
- Organize items by location and category
- Use search to quickly find items
- Track history when you move items between locations

## Getting Help

If you encounter any issues:

1. Check the console logs in your terminal
2. Check the browser console for frontend errors
3. Review the README.md for additional information
4. Check the DEPLOYMENT.md for production deployment help

Enjoy tracking your household items!
