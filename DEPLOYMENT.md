# Deployment Guide

This guide will walk you through deploying your Household Tracker application to production.

## Prerequisites

- Git repository (GitHub, GitLab, etc.)
- Accounts on:
  - [Vercel](https://vercel.com) (for frontend)
  - [Railway](https://railway.app) or [Render](https://render.com) (for backend)
  - [Cloudinary](https://cloudinary.com) (for image hosting)

## Step 1: Setup Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com)
2. Go to your Dashboard
3. Note your:
   - Cloud Name
   - API Key
   - API Secret

## Step 2: Deploy Backend to Railway

### Option A: Using Railway CLI

```bash
cd server
npm install -g railway
railway login
railway init
railway up
```

### Option B: Using Railway Dashboard

1. Go to [Railway](https://railway.app) and log in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set the root directory to `server`
5. Add environment variables:
   ```
   PORT=5000
   DATABASE_URL=/app/data/database.sqlite
   JWT_SECRET=your-super-secret-key-minimum-32-characters-long
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
6. For SQLite persistence, add a volume:
   - Go to your service → Settings → Volumes
   - Add volume with mount path: `/app/data`
7. Deploy!

### Using PostgreSQL (Alternative to SQLite)

For production, PostgreSQL is recommended over SQLite:

1. In Railway, add a PostgreSQL database to your project
2. Update your backend code to use PostgreSQL:
   - Install: `npm install pg`
   - Update `src/db/database.ts` to use PostgreSQL connection
   - Railway will automatically set `DATABASE_URL`

## Step 3: Deploy Frontend to Vercel

### Option A: Using Vercel CLI

```bash
cd client
npm install -g vercel
vercel login
vercel
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and log in
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
6. Deploy!

## Step 4: Update Backend CORS

After deploying the frontend, update the `CLIENT_URL` environment variable in Railway with your Vercel URL.

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Register a new account (first user will be admin)
3. Add a location
4. Add a category
5. Add an object with a photo
6. Test search and filtering

## Database Migration (SQLite to PostgreSQL)

If you need to migrate from SQLite to PostgreSQL:

1. Export data from SQLite:
   ```bash
   sqlite3 database.sqlite .dump > backup.sql
   ```

2. Convert to PostgreSQL format (manual adjustments needed)

3. Import to PostgreSQL:
   ```bash
   psql $DATABASE_URL < backup.sql
   ```

## Monitoring and Logs

### Railway
- View logs: Railway Dashboard → Your Service → Logs
- Metrics: Railway Dashboard → Your Service → Metrics

### Vercel
- View logs: Vercel Dashboard → Your Project → Deployments → [Deployment] → Logs
- Analytics: Vercel Dashboard → Your Project → Analytics

## Backup Strategy

### For SQLite
- Set up automated backups of the volume in Railway
- Download database file regularly: Railway CLI or Dashboard

### For PostgreSQL
- Railway provides automatic backups
- Set up additional backups using pg_dump

## Environment Variables Summary

### Backend (Railway)
```
PORT=5000
DATABASE_URL=/app/data/database.sqlite  # or PostgreSQL URL
JWT_SECRET=your-super-secret-key-minimum-32-characters
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

### Railway
1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS as instructed

## Troubleshooting

### Backend won't start
- Check logs in Railway
- Verify all environment variables are set
- Ensure database is accessible

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Ensure backend is deployed and running

### Image upload fails
- Verify Cloudinary credentials
- Check image size (max 5MB)
- Review upload endpoint logs

### Database errors
- For SQLite: Ensure volume is mounted correctly
- For PostgreSQL: Verify DATABASE_URL is set
- Check database migrations ran successfully

## Cost Estimates

- Vercel: Free tier (100GB bandwidth, unlimited requests)
- Railway: ~$5/month (500 hours, fair usage)
- Cloudinary: Free tier (25GB storage, 25GB bandwidth)

Total: ~$5/month for small family use

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] Regular backups enabled
- [ ] Update dependencies regularly
