# Deployment Guide - DDM Experiment

This guide provides step-by-step instructions for deploying your DDM experiment application to production using free hosting services.

## 📋 Deployment Stack

- **Frontend:** Vercel (free tier)
- **Backend:** Render or Railway (free tier)
- **Database:** MongoDB Atlas (free tier)

**Total Cost:** $0/month (free tier limits apply)

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with email or Google account

### 1.2 Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select a cloud provider and region (choose closest to your participants)
4. Cluster name: `ddm-experiment` (or any name)
5. Click **"Create"**

### 1.3 Create Database User

1. Security → Database Access → **"Add New Database User"**
2. Authentication Method: **Password**
3. Username: `ddm-admin` (or your choice)
4. Password: Generate a secure password (SAVE THIS!)
5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### 1.4 Configure Network Access

1. Security → Network Access → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Note: For production, restrict to your backend server IP
3. Click **"Confirm"**

### 1.5 Get Connection String

1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy the connection string:
   ```
   mongodb+srv://ddm-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password
6. Add database name before the `?`:
   ```
   mongodb+srv://ddm-admin:yourpassword@cluster0.xxxxx.mongodb.net/ddm-experiment?retryWrites=true&w=majority
   ```
7. **SAVE THIS CONNECTION STRING** - you'll need it for backend deployment

## 🔧 Step 2: Deploy Backend (Render)

### 2.1 Prepare Your Repository

1. Ensure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Make sure your `backend/package.json` has the correct start script:
   ```json
   {
     "scripts": {
       "start": "node src/server.js"
     }
   }
   ```

### 2.2 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with GitHub account (recommended)
4. Authorize Render to access your repositories

### 2.3 Create New Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `ddm-experiment` repository

### 2.4 Configure Web Service

**Basic Settings:**
- **Name:** `ddm-experiment-api` (or your choice)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node src/server.js`

**Instance Type:**
- Select **"Free"** tier

### 2.5 Add Environment Variables

Click **"Advanced"** → Add environment variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://ddm-admin:yourpassword@cluster0.xxxxx.mongodb.net/ddm-experiment?retryWrites=true&w=majority
CORS_ORIGIN=*
```

**Important:** Replace `MONGODB_URI` with your actual connection string from Step 1.5

### 2.6 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://ddm-experiment-api.onrender.com`
4. **SAVE THIS URL** - you'll need it for frontend deployment

### 2.7 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "success": true,
  "status": "ok",
  "dbConnected": true,
  "timestamp": "..."
}
```

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub account (recommended)
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Import your `ddm-experiment` repository
3. Click **"Import"**

### 3.3 Configure Project

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.4 Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.onrender.com
```

**Important:** Replace with your actual backend URL from Step 2.6 (no trailing slash!)

### 3.5 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://ddm-experiment.vercel.app`
4. **THIS IS YOUR EXPERIMENT URL** - share with participants

### 3.6 Test Frontend

1. Visit your Vercel URL
2. You should see the landing page
3. Test creating a participant (should reach consent form)
4. Check browser console for errors

## 🔄 Step 4: Update CORS Settings

### 4.1 Update Backend CORS

1. Go back to Render Dashboard
2. Select your backend service
3. Go to **"Environment"**
4. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://ddm-experiment.vercel.app
   ```
5. Save (this will redeploy automatically)

## ✅ Step 5: Final Testing

### 5.1 Complete Test Run

1. Open your Vercel URL in an incognito window
2. Complete the entire experiment (all 120 trials)
3. Verify data saves correctly

### 5.2 Check Database

1. Go to MongoDB Atlas Dashboard
2. Browse Collections → `ddm-experiment` database
3. Verify `participants` and `trials` collections have data

### 5.3 Test Data Export

Visit: `https://your-backend-url.onrender.com/api/data/export`

Should download a CSV file with your test data.

### 5.4 Check Statistics

Visit: `https://your-backend-url.onrender.com/api/data/stats`

Should show:
```json
{
  "success": true,
  "stats": {
    "totalParticipants": 1,
    "completedParticipants": 1,
    ...
  }
}
```

## 📊 Step 6: Monitor Your Experiment

### 6.1 Check Participant Count

Visit your stats endpoint regularly:
```
https://your-backend-url.onrender.com/api/data/stats
```

### 6.2 Download Data Regularly

Download CSV periodically as backup:
```
https://your-backend-url.onrender.com/api/data/export
```

### 6.3 Monitor Render Logs

1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** to see backend activity

### 6.4 Monitor Vercel Analytics (Optional)

1. Go to Vercel Dashboard
2. Select your project
3. View analytics (visitor count, etc.)

## 🔧 Troubleshooting

### Backend Issues

**Database connection failed:**
- Verify MongoDB connection string
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify database user credentials

**CORS errors:**
- Check `CORS_ORIGIN` matches your frontend URL exactly
- No trailing slash in URLs

**Service sleeping (Render free tier):**
- Free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier for always-on

### Frontend Issues

**API requests failing:**
- Check `VITE_API_URL` is correct
- Verify backend is running (health check)
- Check browser console for errors

**Build failures:**
- Check all dependencies in `package.json`
- Verify Node version compatibility
- Check Vercel build logs

### Data Issues

**Data not saving:**
- Check MongoDB Atlas → Network Access
- Verify backend logs for errors
- Check browser localStorage for backup

**CSV export empty:**
- Verify data exists in MongoDB
- Check backend logs during export
- Try getting data directly from MongoDB

## 🔒 Security Best Practices

### For Production Deployment:

1. **Restrict MongoDB Access:**
   - Instead of 0.0.0.0/0, add only your backend server IP
   - Find IP in Render service settings

2. **Environment Variables:**
   - Never commit `.env` files to GitHub
   - Use different credentials for dev/prod
   - Rotate database passwords regularly

3. **CORS:**
   - Set specific origin (your Vercel URL)
   - Don't use `*` in production

4. **Rate Limiting:**
   - Consider adding rate limiting middleware
   - Prevent abuse of API endpoints

5. **HTTPS:**
   - Both Vercel and Render provide HTTPS by default
   - Always use HTTPS URLs

## 💰 Pricing & Limits (Free Tier)

### MongoDB Atlas (M0 Free)
- Storage: 512 MB
- RAM: Shared
- Connections: 500
- **Enough for:** ~500 participants

### Render (Free)
- 750 hours/month
- Sleeps after 15 min inactivity
- 100 GB bandwidth/month
- **Enough for:** Research experiments with moderate traffic

### Vercel (Hobby - Free)
- 100 GB bandwidth/month
- Unlimited sites
- Automatic HTTPS
- **Enough for:** Most research experiments

## 🚀 Upgrading (If Needed)

### When to Upgrade:

**MongoDB Atlas ($9/month):**
- Need more than 512 MB storage
- Need automated backups
- Need better performance

**Render ($7/month):**
- Backend keeps sleeping
- Need more RAM/CPU
- Need custom domain

**Vercel ($20/month):**
- Need more bandwidth
- Need team collaboration
- Need custom domain

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB connection working
- [ ] Complete test experiment runs successfully
- [ ] Data appears in MongoDB
- [ ] CSV export works
- [ ] Statistics endpoint works
- [ ] CORS configured correctly
- [ ] Mobile warning displays properly
- [ ] All browser console errors resolved
- [ ] Participant ID generation works
- [ ] Auto-save functionality works
- [ ] Timeout functionality works (time pressure)
- [ ] Consent form displays properly
- [ ] Demographics form validates correctly

## 🎯 Going Live

### 1. Announce Your Study

Share your Vercel URL:
```
https://ddm-experiment.vercel.app
```

### 2. Monitor First Participants

- Watch Render logs in real-time
- Check MongoDB for data
- Test CSV export after first few participants

### 3. Regular Maintenance

- Download data weekly (backup)
- Check stats endpoint for completion rate
- Monitor for errors in logs
- Respond to participant questions

## 📧 Support

If you encounter issues during deployment:

1. Check Render/Vercel/MongoDB Atlas documentation
2. Review error logs carefully
3. Search Stack Overflow for specific errors
4. Contact support for respective platforms

---

## Alternative Deployment Options

### Backend Alternatives:

**Railway:** Similar to Render
- Go to [railway.app](https://railway.app)
- Connect GitHub repo
- Select backend folder
- Add environment variables
- Deploy

**Heroku:** Paid service ($7/month minimum)
- More stable than free alternatives
- Better for larger studies

### Frontend Alternatives:

**Netlify:** Similar to Vercel
- Go to [netlify.com](https://netlify.com)
- Connect GitHub repo
- Configure build settings
- Add environment variables
- Deploy

## 🎉 Success!

Your experiment is now live and ready to collect data!

**Share this URL with participants:**
```
https://your-app-name.vercel.app
```

**Monitor progress at:**
```
https://your-backend.onrender.com/api/data/stats
```

**Download data at:**
```
https://your-backend.onrender.com/api/data/export
```

Good luck with your research! 🧪🧠
