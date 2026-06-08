# 🚀 Deployment Guide

Complete deployment guide for SecureShare application.

## Table of Contents
1. [Local Testing](#local-testing)
2. [Vercel (Frontend)](#vercel-frontend)
3. [Render (Backend)](#render-backend)
4. [Alternative Options](#alternative-options)
5. [Post-Deployment](#post-deployment)

---

## Local Testing

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════╗
║    Secure File Sharing API - Production Ready         ║
╚════════════════════════════════════════════════════════╝

✅ Server running on http://localhost:5000
✅ Frontend URL: http://localhost:5173
✅ Node Environment: production
✅ Cleanup Service: Active (60000ms interval)
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v4.4.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Test Application

- Open `http://localhost:5173`
- Upload a test file
- Verify dashboard stats update
- Download the file
- Verify download counter increments

---

## Vercel (Frontend)

### Step 1: Prepare Project

```bash
# Build frontend
cd frontend
npm run build

# Verify dist folder is created
ls dist/
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub/GitLab/Bitbucket
3. Connect your repository

### Step 3: Configure Vercel Project

**Project Settings:**
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
```

### Step 4: Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# For production
vercel --prod
```

### Step 5: Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records according to Vercel instructions

---

## Render (Backend)

### Step 1: Prepare Backend

```bash
cd backend

# Verify all dependencies are in package.json
cat package.json

# Test build
npm install
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect GitHub repository

### Step 3: Create Web Service

1. Click "New +" → Web Service
2. Select your GitHub repository
3. Configure:
   - **Name**: `secureshare-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free (for testing) or Starter

### Step 4: Set Environment Variables

In Render Dashboard → Environment:

```
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
MAX_FILE_SIZE=104857600
FILE_EXPIRY_HOURS=24
CLEANUP_INTERVAL_MS=60000
```

**Note**: Render provides PORT via environment, don't hardcode it.

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy
3. Monitor deployment logs
4. Get backend URL: `https://secureshare-api.onrender.com`

### Step 6: Update Frontend

Update frontend `.env`:
```
VITE_API_URL=https://secureshare-api.onrender.com
```

Redeploy frontend on Vercel.

---

## Alternative Options

### Option 1: Heroku (Backend)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create secureshare-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 2: Railway (Backend)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Link to GitHub repo
railway link

# Deploy
railway up

# Get URL
railway status
```

### Option 3: Netlify (Frontend)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 4: AWS EC2 (Backend)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/yourusername/secureshare.git
cd secureshare/backend

# Install & run
npm install
npm start

# Use PM2 for process management
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## Post-Deployment

### 1. Verify Deployment

**Backend**
```bash
curl https://secureshare-api.onrender.com/
# Should return: { "status": "running", ... }
```

**Frontend**
```bash
# Visit: https://your-vercel-app.vercel.app
# Should load without errors
```

### 2. Test Functionality

- [ ] Upload file to production
- [ ] Download file
- [ ] Verify QR code works
- [ ] Check dashboard stats
- [ ] Test search feature
- [ ] Verify file expiry

### 3. Monitor Logs

**Render Backend Logs:**
- Dashboard → Logs tab
- Real-time logs visible

**Vercel Frontend Logs:**
- Dashboard → Deployments → Logs
- View deployment logs

### 4. Enable SSL/HTTPS

Both Vercel and Render provide free SSL by default. ✅

### 5. Set Up Custom Domain

**Vercel:**
1. Settings → Domains
2. Add custom domain
3. Update DNS records

**Render:**
1. Environment → Custom Domain
2. Update DNS records

### 6. Performance Optimization

**Frontend (Vercel):**
```bash
npm run build
# Check bundle size
```

**Backend (Render):**
- Monitor response times
- Check error rates
- Review logs for bottlenecks

### 7. Backup & Cleanup

**Local backups:**
```bash
# Backup project
tar -czf secureshare-backup.tar.gz project3/

# Backup environment files
cp backend/.env backup/
cp frontend/.env backup/
```

**Clean up:**
```bash
# Remove old deployments (optional)
# Delete unused files
```

---

## Troubleshooting

### Issue: CORS Errors

**Solution:**
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

### Issue: Files Not Persisting

**Note:** Render doesn't have persistent storage on free plan. Use:
- AWS S3
- Cloudinary
- Azure Blob Storage

### Issue: Slow Uploads

**Solutions:**
- Increase timeout in Vercel
- Use CDN for file serving
- Compress files before upload

### Issue: Rate Limiting Not Working

**Check:**
```javascript
// Verify rate limiter is configured
app.use('/api/', apiLimiter);
```

### Issue: File Cleanup Not Running

**Check logs:**
```bash
# Render logs
# Look for "Cleanup Service" messages
```

---

## Scaling & Optimization

### For Production Use

1. **Database**: Add MongoDB/PostgreSQL for persistent file metadata
2. **File Storage**: Use AWS S3 instead of local filesystem
3. **CDN**: Add Cloudflare for faster downloads
4. **Caching**: Implement Redis for performance
5. **Load Balancing**: Use multiple instances on Render

### Environment Configuration

```bash
# Production .env
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
MAX_FILE_SIZE=104857600
FILE_EXPIRY_HOURS=24
CLEANUP_INTERVAL_MS=60000
DATABASE_URL=mongodb://...
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## Cost Estimation

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | ✅ | Unlimited bandwidth |
| Render | ✅ | Sleeps after 15 min inactivity |
| Cloudflare | ✅ | Basic DDoS protection |
| AWS S3 | 5GB/month | Add for persistent storage |

---

## Final Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured
- [ ] File upload/download working
- [ ] Dashboard stats updating
- [ ] Search functionality active
- [ ] Download counters incrementing
- [ ] File expiry working
- [ ] QR codes generating
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured
- [ ] Monitoring/logs enabled
- [ ] Backup created

---

## Support

For deployment issues:
- Check Render logs: https://dashboard.render.com
- Check Vercel logs: https://vercel.com/dashboard
- Review error messages in browser console
- Check backend API status

**Successful deployment! 🎉**
