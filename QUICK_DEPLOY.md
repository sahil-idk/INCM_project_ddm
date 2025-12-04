# Quick Deployment Guide - DDM Experiment

## 🗄️ STEP 1: MongoDB Atlas (Database) - FREE

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" → Sign up with Google
3. Create a FREE cluster:
   - Choose M0 FREE tier
   - Pick closest region to your users
   - Name it: `ddm-experiment`
4. Create database user:
   - Security → Database Access → Add New User
   - Username: `ddm-admin`
   - Password: (auto-generate and SAVE IT!)
   - User Privileges: "Read and write to any database"
5. Allow network access:
   - Security → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Database → Connect → Connect your application
   - Copy the connection string (looks like):
   ```
   mongodb+srv://ddm-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name before `?`:
   ```
   mongodb+srv://ddm-admin:yourpassword@cluster0.xxxxx.mongodb.net/ddm-experiment?retryWrites=true&w=majority
   ```

✅ SAVE THIS CONNECTION STRING - you'll need it!

---

## 🔧 STEP 2: Deploy Backend (Render) - FREE

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `ddm-experiment-api`
   - **Region**: Choose closest to you
   - **Branch**: `claude/ddm-experiment-app-011CV45KcTMYoTnrK4vJRfxA`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: FREE
6. Add Environment Variables (click "Advanced"):
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://ddm-admin:yourpassword@cluster0.xxxxx.mongodb.net/ddm-experiment?retryWrites=true&w=majority
   CORS_ORIGIN=*
   ```
   (Use YOUR actual MongoDB connection string!)

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. You'll get a URL like: `https://ddm-experiment-api.onrender.com`

✅ SAVE THIS URL - you'll need it for frontend!

### Test Backend:
Visit: `https://your-backend-url.onrender.com/api/health`
Should see: `{"success": true, "status": "ok", "dbConnected": true}`

---

## 🎨 STEP 3: Deploy Frontend (Vercel) - FREE

1. Go to https://vercel.c  om
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
   (Use YOUR actual Render backend URL!)

7. Click "Deploy"
8. Wait 2-3 minutes
9. You'll get a URL like: `https://ddm-experiment.vercel.app`

✅ THIS IS YOUR EXPERIMENT URL!

---

## 🔄 STEP 4: Update CORS (Important!)

1. Go back to Render dashboard
2. Select your backend service
3. Environment → Edit `CORS_ORIGIN`
4. Change from `*` to your actual Vercel URL:
   ```
   CORS_ORIGIN=https://ddm-experiment.vercel.app
   ```
5. Save (this will redeploy)

---

## ✅ STEP 5: Test Everything!

1. Open your Vercel URL in incognito window
2. Complete entire experiment (all 80 trials)
3. Check MongoDB Atlas:
   - Database → Browse Collections
   - Should see `participants` and `trials` collections with data
4. Download data:
   - Visit: `https://your-backend-url.onrender.com/api/data/export`
   - Should download CSV file!

---

## 🎯 Share With Participants

Your experiment URL:
```
https://ddm-experiment.vercel.app
```

Send this to your participants!

---

## 📊 Monitor Data Collection

### Check stats:
```
https://your-backend-url.onrender.com/api/data/stats
```

### Download data:
```
https://your-backend-url.onrender.com/api/data/export
```

---

## ⚠️ Important Notes

**Free Tier Limits:**
- **Render**: Service sleeps after 15 min inactivity (wakes on first request ~30 sec)
- **MongoDB Atlas**: 512 MB storage (enough for ~500 participants)
- **Vercel**: 100 GB bandwidth/month (plenty for research)

**For Production:**
- Keep Render backend awake: ping health endpoint every 10 min
- Or upgrade to paid tier ($7/month for always-on)

---

## 🐛 Troubleshooting

**Backend won't connect to MongoDB:**
- Check MongoDB Atlas network access (0.0.0.0/0 allowed?)
- Verify connection string has password and database name
- Check Render environment variables

**Frontend can't reach backend:**
- Check VITE_API_URL in Vercel environment variables
- Verify CORS_ORIGIN in Render matches Vercel URL
- Check browser console for errors

**Data not saving:**
- Check Render logs for errors
- Verify MongoDB connection in health endpoint
- Check Network tab in browser DevTools

---

## 🔄 Updating After Changes

**Frontend changes:**
1. Push to GitHub
2. Vercel auto-deploys

**Backend changes:**
1. Push to GitHub
2. Render auto-deploys

**Environment variables:**
- Update in Render/Vercel dashboard
- Service will redeploy automatically

---

Good luck with your research! 🧠🔬
