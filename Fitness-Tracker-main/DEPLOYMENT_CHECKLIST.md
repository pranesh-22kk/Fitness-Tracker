# ✅ Vercel Deployment Checklist

## Before Deployment

### 1. MongoDB Atlas Setup
- [ ] Create free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create new cluster (M0 Free tier)
- [ ] Create database user with username and password
- [ ] Whitelist all IPs (0.0.0.0/0) in Network Access
- [ ] Get connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)
- [ ] Test connection locally by updating backend/.env with Atlas URI

### 2. Prepare Environment Variables
- [ ] Generate JWT secret: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Note down:
  - MongoDB URI: `mongodb+srv://...`
  - JWT Secret: (generated above)
  - Your email for Vercel login

### 3. Code Ready
- [ ] All files saved
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend runs with MongoDB Atlas: `cd backend && node index.js`

## Deployment Steps

### Option A: Deploy via Vercel CLI (Fastest)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project root
cd C:\Users\Pranesh\Fitness-Tracker\Fitness-Tracker-main

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. Add environment variables in Vercel Dashboard
# Go to: vercel.com/dashboard → Your Project → Settings → Environment Variables

# 6. Deploy to production
vercel --prod
```

### Option B: Deploy via GitHub + Vercel Dashboard (Easier)

```bash
# 1. Initialize Git and push to GitHub
git init
git add .
git commit -m "Initial commit for deployment"
git remote add origin https://github.com/yourusername/fitness-tracker.git
git push -u origin main

# 2. Go to vercel.com/dashboard
# 3. Click "New Project"
# 4. Import from GitHub
# 5. Add environment variables (see below)
# 6. Click "Deploy"
```

## Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority
JWT_SECRET = your_generated_32_char_secret
NODE_ENV = production
FRONTEND_URL = https://your-app-name.vercel.app
PORT = 8000
```

For frontend:
```
REACT_APP_API_URL = https://your-app-name.vercel.app/api
```

## After Deployment

- [ ] Visit your live URL: `https://your-app-name.vercel.app`
- [ ] Test registration (create new account)
- [ ] Test login
- [ ] Test adding a meal
- [ ] Test adding an exercise
- [ ] Check MongoDB Atlas → Database → Collections (should see user data)
- [ ] Test on mobile browser
- [ ] Share with friends!

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View domains
vercel domains

# Add environment variable
vercel env add MONGODB_URI production
```

## Troubleshooting

### MongoDB connection fails
- Check IP whitelist in MongoDB Atlas (set to 0.0.0.0/0)
- Verify connection string is correct
- Ensure password is URL-encoded (special characters like @, /, etc.)

### CORS errors
- Check FRONTEND_URL environment variable matches your Vercel URL
- Redeploy after adding environment variables

### Build fails
- Check all dependencies in package.json
- Clear Vercel cache and redeploy
- Check build logs in Vercel dashboard

### API requests return 404
- Verify vercel.json routes configuration
- Check backend routes are using /api prefix
- Verify REACT_APP_API_URL is set correctly

## Success! 🎉

Your app is now live at: `https://your-app-name.vercel.app`

Share it with:
- Friends and family
- Social media
- Add to your portfolio
- Put on your resume!

## Next Steps

1. **Custom Domain** (Optional)
   - Buy domain from Namecheap/GoDaddy
   - Add in Vercel → Domains
   - Update DNS records

2. **Analytics**
   - Enable Vercel Analytics (free)
   - Monitor traffic and performance

3. **Continuous Deployment**
   - Every git push to main → Auto-deploys
   - Preview deployments for other branches

4. **Monitoring**
   - Check MongoDB Atlas metrics
   - Review Vercel function logs
   - Set up error alerts

Congratulations! Your Fitness Tracker is now deployed! 🚀
