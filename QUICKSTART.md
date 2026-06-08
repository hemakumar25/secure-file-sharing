# ⚡ Quick Start Guide

Get SecureShare running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- Git
- A text editor (VS Code recommended)

## 🚀 Start Backend

```bash
# Open terminal in project3/backend
cd backend

# Install dependencies
npm install

# Start server
npm start

# Expected output:
# ✅ Server running on http://localhost:5000
```

**Verify backend is running:**
```bash
# In another terminal
curl http://localhost:5000

# Should return:
# {"status":"running","message":"Secure File Sharing API","version":"1.0.0"}
```

## 🎨 Start Frontend

```bash
# Open new terminal in project3/frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

## 🌐 Access Application

1. Open browser to `http://localhost:5173`
2. You should see the SecureShare home page
3. Everything is ready to test!

## 📝 Test Features

### Test 1: Upload a File
1. Click "Select File" or drag & drop
2. Choose any file (PDF, image, etc.)
3. Click "Upload File"
4. Wait for upload to complete

### Test 2: Share Link
1. After upload, copy the download link
2. Open link in new tab
3. Verify file details show correctly

### Test 3: Download File
1. On download page, click "Download File"
2. File should download to your computer
3. Check download counter incremented

### Test 4: View Dashboard
1. Go back to home page
2. Check dashboard stats
3. Verify counts are correct

## 📊 Dashboard Stats

- **Total Uploaded**: Number of files uploaded
- **Total Downloads**: Sum of all downloads
- **Active Files**: Files still available
- **Expired Files**: Auto-deleted files

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Docs | http://localhost:5000 |

## 📂 Key Files

```
project3/
├── backend/server.js          # Start here (npm start)
├── frontend/src/App.jsx       # React entry point
├── backend/.env               # Backend config
├── frontend/.env              # Frontend config
└── README.md                  # Full documentation
```

## ⚙️ Configuration

### Backend (.env)
```
PORT=5000                    # Server port
FILE_EXPIRY_HOURS=24        # File expiry time
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000  # Backend URL
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

### Frontend won't load
```bash
# Kill process on port 5173
# On Mac/Linux:
lsof -ti :5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Restart frontend
npm run dev
```

### CORS Errors
- Verify backend is running on port 5000
- Check frontend .env has correct API URL
- Restart both servers

### Upload fails
- Check file size (max 100MB)
- Verify file type is supported
- Check backend logs for errors

## 🎯 Next Steps

1. ✅ Files upload and download working?
2. ✅ Dashboard showing correct stats?
3. ✅ Can copy and share links?
4. ✅ QR codes generating?

If all working, your app is ready!

## 📦 Build for Production

### Backend
```bash
cd backend
npm install
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
# Creates 'dist' folder ready for deployment
```

## 🚀 Deploy

### Option 1: Vercel + Render (Recommended)
- [See DEPLOYMENT.md](DEPLOYMENT.md)

### Option 2: Local Deployment
```bash
# Run both servers
# Backend: npm start (in backend folder)
# Frontend: npm run dev (in frontend folder)
```

## 💡 Pro Tips

1. **Upload Multiple Files**: Upload different files and compare
2. **Test Expiry**: Wait to see 24-hour countdown
3. **Mobile Testing**: Open QR code on phone
4. **Share Link**: Send download link to friend
5. **Monitor Cleanup**: Check backend logs for auto-delete

## 📚 Full Documentation

- [README.md](README.md) - Complete documentation
- [FEATURES.md](FEATURES.md) - Feature details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

## ✨ You're All Set!

Your SecureShare app is now running! 🎉

**Happy Sharing! 🚀**

---

**Need help?**
- Check logs in both terminals
- Review error messages carefully
- See DEPLOYMENT.md for production setup
