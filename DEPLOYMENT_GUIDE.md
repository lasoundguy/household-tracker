# Web-Based Deployment Guide

This guide walks you through deploying your Household Tracker app using web dashboards (no CLI required).

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login" and sign in with GitHub (easiest option)
3. Authorize Railway to access your GitHub account

### Step 2: Create New Project
1. Click "New Project" button
2. Select "Deploy from GitHub repo"
3. Select your `household-tracker` repository
4. Railway will detect it as a Node.js project

### Step 3: Configure the Service
1. Railway will create a service automatically
2. Click on the service card to open settings
3. Go to "Settings" tab

**Set Root Directory:**
- Root Directory: `server`
- This tells Railway to deploy only the backend

**Build & Start Commands (should auto-detect, but verify):**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### Step 4: Add Environment Variables
1. Click on "Variables" tab
2. Add these variables (click "+ New Variable" for each):

```
PORT=5000
DATABASE_URL=/app/data/database.sqlite
JWT_SECRET=household-tracker-super-secret-jwt-key-for-production-change-this
CLOUDINARY_CLOUD_NAME=debxmyv8k
CLOUDINARY_API_KEY=911666822237649
CLOUDINARY_API_SECRET=udz8-55nQSJFffeNwFNzqe9zLxU
NODE_ENV=production
CLIENT_URL=https://your-app-name.vercel.app
```

**Important Notes:**
- `CLIENT_URL` - You'll update this after deploying the frontend
- `JWT_SECRET` - Change this to a random 32+ character string for production
- The Cloudinary credentials are already your actual credentials

### Step 5: Add Volume for Database Persistence
1. Go to "Settings" tab
2. Scroll down to "Volumes" section
3. Click "New Volume"
4. Set mount path: `/app/data`
5. Click "Add"

This ensures your SQLite database persists between deployments.

### Step 6: Deploy
1. Railway will automatically deploy when you save changes
2. Wait for deployment to complete (check "Deployments" tab)
3. Once deployed, click "Settings" → "Networking" to see your Railway URL
4. Copy this URL (looks like: `https://your-app-name.up.railway.app`)

**Test your backend:**
- Visit: `https://your-app-name.up.railway.app/health`
- Should return: `{"status":"ok","timestamp":"..."}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up" and use GitHub (easiest option)
3. Authorize Vercel to access your GitHub account

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Find and select your `household-tracker` repository
3. Click "Import"

### Step 3: Configure Build Settings
Vercel should auto-detect Create React App settings. Verify:

- **Framework Preset:** Create React App
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `build`

### Step 4: Add Environment Variable
1. Click "Environment Variables" section
2. Add this variable:

**Key:** `REACT_APP_API_URL`
**Value:** `https://your-railway-url.up.railway.app/api`

(Use the Railway URL you copied in Part 1, Step 6, and add `/api` at the end)

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Once done, you'll get a URL like: `https://household-tracker-xyz.vercel.app`
4. Click "Visit" to see your app!

### Step 6: Update Railway with Vercel URL
1. Go back to Railway dashboard
2. Open your backend service
3. Go to "Variables" tab
4. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://household-tracker-xyz.vercel.app
   ```
5. Save (this will redeploy automatically)

---

## Part 3: Test Your Deployed App

### Test Checklist:
1. ✅ Visit your Vercel URL
2. ✅ Click "Register" and create an account (you'll be the admin!)
3. ✅ Login successfully
4. ✅ See the dashboard with default locations and categories
5. ✅ Add a new object with a photo
6. ✅ Search for objects
7. ✅ Move an object between locations

---

## Troubleshooting

### Backend won't start on Railway
- Check "Deployments" → Click on deployment → "View Logs"
- Common issues:
  - Missing environment variables
  - Volume not mounted correctly
  - Build failed (check build logs)

### Frontend can't connect to backend
- Check that `REACT_APP_API_URL` in Vercel matches your Railway URL
- Check that `CLIENT_URL` in Railway matches your Vercel URL
- Check Railway logs for CORS errors

### Image upload fails
- Verify Cloudinary credentials in Railway environment variables
- Check that file size is under 5MB
- Check Railway logs for upload errors

### Database resets on deploy
- Make sure you added the Volume in Railway settings
- Mount path should be `/app/data`
- Database file location should be `/app/data/database.sqlite`

---

## Cost Estimate

Both services have generous free tiers:

- **Railway:** $5/month usage-based (500 hours free)
- **Vercel:** Free for personal projects (100GB bandwidth)
- **Cloudinary:** Free tier (25GB storage, 25GB bandwidth)

**Total:** ~$0-5/month depending on usage

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to your Vercel project → Settings → Domains
2. Add your domain (e.g., `tracker.yourdomain.com`)
3. Follow DNS instructions to point to Vercel

### Add Custom Domain to Railway:
1. Go to your Railway service → Settings → Networking
2. Click "Add Custom Domain"
3. Enter your domain
4. Follow DNS instructions

---

## Updating Your App

When you make code changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Automatic deployment:**
   - Both Railway and Vercel will automatically detect the push
   - They'll rebuild and redeploy your app
   - No manual steps needed!

3. **Check deployment status:**
   - Railway: Check "Deployments" tab
   - Vercel: Check "Deployments" section

---

## Security Recommendations

Before going to production:

1. **Change JWT_SECRET** to a random string:
   ```bash
   # Generate a random secret
   openssl rand -base64 32
   ```

2. **Review Cloudinary settings** - consider creating a production-specific account

3. **Enable HTTPS** (automatic on both Railway and Vercel)

4. **Set up backups** for your database (Railway volume backups)

5. **Monitor logs** regularly for errors or security issues

---

## Next Steps

- Invite family members by sharing your Vercel URL
- Customize categories and locations in the app
- Upload photos of your household items
- Consider migrating to PostgreSQL for better production reliability (optional)

Enjoy your deployed Household Tracker! 🎉
