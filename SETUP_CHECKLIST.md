# ✅ SETUP CHECKLIST

Complete checklist for setting up SecureShare locally.

## 🔍 Prerequisites

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed
- [ ] 500MB free disk space
- [ ] Port 5000 available (backend)
- [ ] Port 5173 available (frontend)

## 📥 Initial Setup

### Step 1: Clone/Download Project
```bash
# Navigate to project3 folder
cd project3
```
- [ ] Project folder exists
- [ ] All subdirectories present (backend, frontend)

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```
- [ ] `node_modules` folder created
- [ ] No errors during install
- [ ] All packages listed in package.json

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```
- [ ] `node_modules` folder created
- [ ] No errors during install
- [ ] Tailwind CSS dependencies installed

## ⚙️ Configuration

### Backend Configuration
```bash
cd ../backend
```
- [ ] `.env` file exists
- [ ] `PORT=5000` is set
- [ ] `FILE_EXPIRY_HOURS=24` is set
- [ ] `CLEANUP_INTERVAL_MS=60000` is set
- [ ] All environment variables filled

### Frontend Configuration
```bash
cd ../frontend
```
- [ ] `.env` file exists
- [ ] `VITE_API_URL=http://localhost:5000` is correct
- [ ] API URL points to backend

## 🚀 Running the Application

### Terminal 1: Start Backend
```bash
cd backend
npm start
```
- [ ] Server starts successfully
- [ ] See "Server running on http://localhost:5000"
- [ ] See "Cleanup Service: Active"
- [ ] No error messages

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```
- [ ] Vite dev server starts
- [ ] See "Local: http://localhost:5173"
- [ ] No build errors

### Terminal 3: Browser Test
```bash
# Open browser
http://localhost:5173
```
- [ ] Page loads successfully
- [ ] No console errors
- [ ] All UI elements visible

## 📝 Functional Testing

### Test 1: Upload File
- [ ] Upload box visible
- [ ] Can select file
- [ ] Drag & drop works
- [ ] Upload button enabled
- [ ] Progress bar shows
- [ ] Upload completes
- [ ] Success message appears

### Test 2: File Display
- [ ] File appears in list
- [ ] File name shows
- [ ] File size shows
- [ ] Time remaining shows
- [ ] Download count shows

### Test 3: Copy Link
- [ ] Copy button works
- [ ] "Copied!" feedback appears
- [ ] Link in clipboard
- [ ] Can paste link

### Test 4: Download
- [ ] Download button visible
- [ ] Click download
- [ ] File downloads
- [ ] Download counter increases
- [ ] File opens correctly

### Test 5: Preview
- [ ] Preview button visible (for images/PDF)
- [ ] Click shows preview
- [ ] Image/PDF displays
- [ ] Hide button works

### Test 6: QR Code
- [ ] QR code visible on download page
- [ ] QR code displays correctly
- [ ] Download QR button works
- [ ] QR PNG file downloads
- [ ] QR scans to correct URL

### Test 7: Search
- [ ] Search box visible on home page
- [ ] Type file name
- [ ] Results update
- [ ] Found files display
- [ ] Clear search works

### Test 8: Dashboard
- [ ] All 4 stat cards visible
- [ ] Total Uploaded shows
- [ ] Total Downloads shows
- [ ] Active Files shows
- [ ] Expired Files shows
- [ ] Stats update in real-time

### Test 9: Responsive
- [ ] Desktop view works (1920px)
- [ ] Tablet view works (768px)
- [ ] Mobile view works (375px)
- [ ] Navigation responsive
- [ ] All elements visible

### Test 10: Error Handling
- [ ] Upload oversized file → Error shown
- [ ] Upload unsupported type → Error shown
- [ ] Network error → Error message
- [ ] Invalid link → 404 page
- [ ] Expired file → Proper message

## 🔐 Security Checks

- [ ] Rate limiting works (try 51 uploads in 15 min)
- [ ] CORS properly configured
- [ ] Security headers present
- [ ] File validation working
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks
- [ ] Passwords not exposed in env

## 📊 Performance Checks

- [ ] Frontend loads in < 3 seconds
- [ ] Upload speed acceptable
- [ ] Download speed acceptable
- [ ] No console errors
- [ ] No memory leaks
- [ ] Dashboard updates smoothly
- [ ] Search responsive

## 🧹 Cleanup Verification

- [ ] Cleanup service running (check backend logs)
- [ ] No "cleanup" errors in logs
- [ ] Old files should be deleted
- [ ] Wait 24+ hours and verify deletion
- [ ] Memory not growing

## 📁 File Structure Verification

### Backend
- [ ] `server.js` exists
- [ ] `package.json` exists
- [ ] `.env` exists
- [ ] `uploads/` folder exists
- [ ] `controllers/` folder exists
- [ ] `routes/` folder exists
- [ ] `middleware/` folder exists
- [ ] `services/` folder exists
- [ ] `utils/` folder exists

### Frontend
- [ ] `index.html` exists
- [ ] `package.json` exists
- [ ] `.env` exists
- [ ] `src/` folder exists
- [ ] `src/pages/` has files
- [ ] `src/components/` has 6 files
- [ ] `src/services/` has api.js
- [ ] `src/styles/` has globals.css
- [ ] `vite.config.js` exists
- [ ] `tailwind.config.js` exists

### Documentation
- [ ] `README.md` exists
- [ ] `QUICKSTART.md` exists
- [ ] `DEPLOYMENT.md` exists
- [ ] `FEATURES.md` exists
- [ ] `PROJECT_SUMMARY.md` exists

## 🚢 Deployment Preparation

### Before Deploying
- [ ] Build frontend: `npm run build`
- [ ] Verify dist folder created
- [ ] Test production build locally
- [ ] Backend can run in production
- [ ] All environment variables set
- [ ] API URLs correctly configured

### Deployment Checklist
- [ ] Vercel account created
- [ ] Render account created
- [ ] GitHub repository set up
- [ ] Environment variables ready
- [ ] Custom domain ready (optional)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up
- [ ] Error logging configured

## 🐛 Troubleshooting

### Issue: Port 5000 in use
- [ ] Check what's using port 5000
- [ ] Kill process or change port
- [ ] Restart backend

### Issue: Port 5173 in use
- [ ] Check what's using port 5173
- [ ] Kill process or change port
- [ ] Restart frontend

### Issue: CORS errors
- [ ] Check backend .env FRONTEND_URL
- [ ] Check frontend .env VITE_API_URL
- [ ] Both servers running
- [ ] Correct ports configured

### Issue: File upload fails
- [ ] Check file size (max 100MB)
- [ ] Check file type supported
- [ ] Check uploads folder writable
- [ ] Check backend logs

### Issue: Module not found
- [ ] Run `npm install` again
- [ ] Delete `node_modules`
- [ ] Delete `package-lock.json`
- [ ] Run `npm install` fresh

### Issue: Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

## ✨ Final Checks

- [ ] All tests passing
- [ ] No console errors
- [ ] No backend errors
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Ready for deployment
- [ ] Ready for sharing

## 📊 Performance Benchmarks

| Operation | Expected | Actual |
|-----------|----------|--------|
| Upload (10MB) | < 5 sec | _ sec |
| Download (10MB) | < 3 sec | _ sec |
| Page load | < 2 sec | _ sec |
| Search | < 500ms | _ ms |
| Dashboard | Instant | _ ms |

## 💾 Backup & Save

- [ ] Created GitHub repository
- [ ] Code pushed to GitHub
- [ ] Environment files backed up
- [ ] Database backups ready (if used)
- [ ] Deployment configs saved

## 🎯 Launch Checklist

Before going live:
- [ ] All tests pass
- [ ] Production build created
- [ ] Environment variables set
- [ ] Deployment services ready
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] Monitoring configured
- [ ] Backup strategy ready
- [ ] Support plan ready
- [ ] Documentation published

## ✅ READY!

Once all items checked:
✨ Your SecureShare app is ready to deploy!

---

**Setup Date:** _______________
**Completed By:** _______________
**Status:** [ ] Ready [ ] In Progress [ ] Blocked

**Notes:**
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

**Congratulations! 🎉 Setup complete!**
