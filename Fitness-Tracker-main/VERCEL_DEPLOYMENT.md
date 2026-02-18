# 🚀 Vercel Deployment Guide - Fitness Tracker

## 📋 Deployment Options

### **Option 1: Full Stack on Vercel (Recommended for Small Apps)**
Deploy both frontend and backend as Vercel serverless functions

### **Option 2: Split Deployment (Recommended for Production)**
- Frontend → Vercel
- Backend → Railway/Render/Heroku
- Database → MongoDB Atlas

---

## 🎯 Option 1: Full Stack on Vercel

### **Step 1: Setup MongoDB Atlas (Cloud Database)**

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier
   - Create a new cluster (M0 Free tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fitness-tracker
     ```

3. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to Vercel IPs

4. **Create Database User**
   - Database Access → Add New Database User
   - Username: `fitnessapp`
   - Password: Generate secure password
   - Role: Read and Write to any database

---

### **Step 2: Prepare Backend for Vercel**

**Update backend/index.js for serverless:**

```javascript
// Add at the top
const path = require('path');

// Modify CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

// Export for Vercel serverless
module.exports = app;
```

**Create backend/vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

---

### **Step 3: Prepare Frontend for Vercel**

**Update frontend API URL:**

Create `frontend/src/config.js`:

```javascript
const config = {
  API_URL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://your-app.vercel.app/api' 
             : 'http://localhost:8000/api')
};

export default config;
```

**Update axios baseURL in frontend:**

```javascript
// In all files using axios
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.API_URL
});
```

**Add build script to frontend/package.json:**

```json
{
  "scripts": {
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  }
}
```

---

### **Step 4: Deploy to Vercel**

**Method A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project root
cd C:\Users\Pranesh\Fitness-Tracker\Fitness-Tracker-main

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? fitness-tracker
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Method B: Vercel Dashboard (Easier for Beginners)**

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/fitness-tracker.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Project**
   - Framework Preset: Create React App
   - Root Directory: `./`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`

4. **Add Environment Variables**
   - Settings → Environment Variables
   - Add:
     ```
     MONGODB_URI = mongodb+srv://...
     JWT_SECRET = your_secret_key
     NODE_ENV = production
     REACT_APP_API_URL = https://your-app.vercel.app/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at `https://fitness-tracker-xxx.vercel.app`

---

### **Step 5: Environment Variables in Vercel**

**In Vercel Dashboard:**

```
Project Settings → Environment Variables:

MONGODB_URI = mongodb+srv://fitnessapp:password@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority
JWT_SECRET = your_super_secret_jwt_key_minimum_32_characters_long
NODE_ENV = production
REACT_APP_API_URL = https://your-app-name.vercel.app/api
PORT = 8000
```

**Important:** 
- Never commit .env files to GitHub
- Use different JWT_SECRET for production
- MongoDB password should be URL-encoded

---

## 🎯 Option 2: Split Deployment (Better for Production)

### **Frontend → Vercel**

```bash
# Deploy only frontend
cd frontend
vercel

# Environment variable needed:
REACT_APP_API_URL = https://your-backend.railway.app/api
```

### **Backend → Railway (Free Tier)**

1. **Sign up at railway.app**
2. **New Project → Deploy from GitHub**
3. **Add MongoDB Atlas connection**
4. **Add environment variables:**
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_secret
   PORT=8000
   ```
5. **Backend will be live at:** `https://your-backend.railway.app`

### **Backend → Render (Alternative)**

1. **Sign up at render.com**
2. **New Web Service**
3. **Connect GitHub repo**
4. **Settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node index.js`
   - Environment Variables: Add MONGODB_URI, JWT_SECRET

### **Backend → Heroku (Alternative)**

```bash
# Install Heroku CLI
# Create Procfile in backend/
web: node index.js

# Deploy
heroku create fitness-tracker-backend
git push heroku main
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret
```

---

## 📝 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Connection string copied
- [ ] JWT_SECRET generated (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Frontend build command tested (`cd frontend && npm run build`)
- [ ] Backend dependencies listed in package.json
- [ ] CORS configured for production domain
- [ ] API URLs updated for production
- [ ] Environment variables prepared
- [ ] GitHub repository created (if using dashboard method)

---

## 🔧 Required Code Changes

### **1. Update backend/index.js**

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL, 'https://*.vercel.app']
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// ... rest of your code

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
// ... other routes

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
```

### **2. Update frontend axios configuration**

**Create frontend/src/api/axios.js:**

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL
});

export default axiosInstance;
```

**Update all files to use this instance:**

```javascript
// Instead of:
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000/api/';

// Use:
import axios from './api/axios';
```

### **3. Add frontend/.env.production**

```
REACT_APP_API_URL=https://your-app.vercel.app/api
```

---

## 🚀 Quick Deploy Commands

### **Deploy Everything (Full Stack on Vercel):**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd C:\Users\Pranesh\Fitness-Tracker\Fitness-Tracker-main

# 3. Login
vercel login

# 4. Deploy to preview
vercel

# 5. Deploy to production
vercel --prod

# 6. Add environment variables via CLI
vercel env add MONGODB_URI production
vercel env add JWT_SECRET production
vercel env add REACT_APP_API_URL production

# 7. Redeploy with new env vars
vercel --prod
```

### **Deploy Frontend Only:**

```bash
cd frontend
vercel --prod
```

---

## 🔍 Verify Deployment

After deployment:

1. **Check Frontend:**
   - Visit: `https://your-app.vercel.app`
   - Should see login page with 3D animations
   - Open DevTools → Check for errors

2. **Check Backend API:**
   - Visit: `https://your-app.vercel.app/api/auth/test`
   - Should return JSON response (if you add a test route)

3. **Check Database Connection:**
   - Try to register a new user
   - Check MongoDB Atlas → Collections
   - Should see new user document

4. **Test Authentication:**
   - Register → Login → Dashboard
   - Try adding food item
   - Check data persists after refresh

---

## 🐛 Common Issues & Fixes

### **Issue 1: "Cannot connect to MongoDB"**
```
Solution:
1. Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
2. Verify connection string is correct
3. Check database user credentials
4. Ensure retryWrites=true in connection string
```

### **Issue 2: "CORS error in production"**
```
Solution:
1. Update backend CORS to include production domain
2. Add 'https://*.vercel.app' to allowed origins
3. Redeploy backend
```

### **Issue 3: "API requests failing"**
```
Solution:
1. Check REACT_APP_API_URL is set correctly
2. Verify environment variables in Vercel dashboard
3. Check backend logs in Vercel dashboard
4. Ensure /api routes are configured in vercel.json
```

### **Issue 4: "Build fails"**
```
Solution:
1. Check all dependencies in package.json
2. Run 'npm install --legacy-peer-deps' locally
3. Add to package.json: "engines": { "node": "18.x" }
4. Clear Vercel cache and redeploy
```

### **Issue 5: "JWT token not working"**
```
Solution:
1. Ensure JWT_SECRET is set in production
2. Check token is sent in headers (not body)
3. Verify CORS credentials: true
4. Check token expiry time
```

---

## 💰 Cost Breakdown

### **Free Tier Limits:**

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function execution time: 100 GB-hours
- ✅ Custom domain (1)

**MongoDB Atlas Free (M0):**
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Good for 1000s of users

**Total Cost:** $0/month for small apps! 🎉

### **When to Upgrade:**

- MongoDB M0 full (>512MB) → Upgrade to M10 ($9/month)
- >100 GB bandwidth → Vercel Pro ($20/month)
- Need longer serverless execution → Vercel Pro

---

## 📱 Custom Domain (Optional)

After deployment:

1. **Buy domain** (Namecheap, GoDaddy, Google Domains)

2. **Add to Vercel:**
   - Project Settings → Domains
   - Add `www.yourfitness.com`
   - Add `yourfitness.com`

3. **Update DNS:**
   - Add CNAME: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → Vercel IP

4. **Wait for SSL:**
   - Vercel auto-provisions SSL certificate
   - Takes 1-5 minutes
   - Your app will be at `https://yourfitness.com`

---

## 🎉 Post-Deployment

**Share Your App:**
- URL: `https://fitness-tracker-xxx.vercel.app`
- Share with friends/family
- Collect feedback
- Monitor usage in Vercel Analytics

**Monitor Performance:**
- Vercel Dashboard → Analytics
- Check response times
- Monitor error rates
- View geographic distribution

**Continuous Deployment:**
- Push to GitHub → Auto-deploys to Vercel
- Preview deployments for branches
- Rollback if issues occur

---

## 🔐 Security Best Practices

1. **Environment Variables:**
   - Never commit .env files
   - Use different secrets for production
   - Rotate JWT_SECRET regularly

2. **MongoDB:**
   - Use strong passwords
   - Restrict IP access in production
   - Enable MongoDB Atlas alerts

3. **CORS:**
   - Only allow your frontend domain
   - Don't use wildcard (*) in production

4. **Rate Limiting:**
   - Add rate limiting middleware
   - Prevent brute force attacks

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Vercel Community:** https://github.com/vercel/vercel/discussions

---

**Ready to deploy? Run `vercel` in your project directory!** 🚀
