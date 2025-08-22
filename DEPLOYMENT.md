# 🚀 AdShield AI Deployment Guide

Since Railway doesn't support monorepo subfolder deployment directly, we've prepared two separate folders that can be deployed as independent repositories:

## 📁 Repository Structure

```
AdShield AI/
├── adshield-backend/    # Backend API (deploy to Railway)
├── adshield-frontend/   # Frontend UI (deploy to Vercel)
└── DEPLOYMENT.md        # This file
```

## 🔧 Step-by-Step Deployment

### Step 1: Create Two GitHub Repositories

Create two separate repositories on GitHub:
1. `adshield-backend` - For the backend API
2. `adshield-frontend` - For the frontend UI

### Step 2: Deploy Backend to Railway

```bash
# Navigate to backend folder
cd "C:\AdShield AI\adshield-backend"

# Initialize git
git init
git add .
git commit -m "Initial commit: AdShield Backend API"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/adshield-backend.git
git branch -M main
git push -u origin main
```

**On Railway:**
1. Go to [railway.app](https://railway.app)
2. Create New Project → Deploy from GitHub repo
3. Select `adshield-backend` repository
4. Railway will auto-detect Python and create the service
5. Go to Variables tab and add:
   ```
   HF_API_TOKEN=hf_your_actual_token_here
   FRONTEND_URL=https://your-app.vercel.app
   PORT=8000
   ```
6. Railway will automatically deploy!
7. Copy your Railway backend URL (e.g., `https://adshield-backend.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

```bash
# Navigate to frontend folder
cd "C:\AdShield AI\adshield-frontend"

# Initialize git
git init
git add .
git commit -m "Initial commit: AdShield Frontend"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/adshield-frontend.git
git branch -M main
git push -u origin main
```

**On Vercel:**
1. Go to [vercel.com](https://vercel.com)
2. Import Project → Import Git Repository
3. Select `adshield-frontend` repository
4. Framework Preset will auto-detect as Vite
5. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://adshield-backend.up.railway.app
   ```
   (Use your actual Railway backend URL)
6. Deploy!

## 🔄 Alternative: Using Railway with Monorepo

If you prefer to keep everything in one repository, you can use Railway's `railway.json` configuration:

1. Create `railway.json` in your backend folder:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy the entire repository to Railway
3. Railway will use the configuration to run from the backend folder

## 📝 Important URLs to Remember

After deployment, you'll have:
- **Backend API**: `https://your-backend.up.railway.app`
- **Frontend App**: `https://your-app.vercel.app`

Make sure to:
1. Update `FRONTEND_URL` in Railway to your Vercel URL
2. Update `VITE_API_BASE_URL` in Vercel to your Railway URL
3. Test all features after deployment

## 🔐 Security Checklist

- [ ] Never commit `.env` files to GitHub
- [ ] Use strong, unique Hugging Face API token
- [ ] Set `DEBUG=False` in production
- [ ] Configure CORS properly for your domains
- [ ] Use HTTPS for both frontend and backend

## 🆘 Troubleshooting

### CORS Issues
If you get CORS errors:
1. Check that `FRONTEND_URL` in Railway matches your Vercel URL exactly
2. Include `https://` or `http://` in the URL
3. Restart the Railway service after changing environment variables

### API Connection Issues
If frontend can't connect to backend:
1. Verify `VITE_API_BASE_URL` is set correctly in Vercel
2. Check that backend is running (visit the Railway URL directly)
3. Look at Railway logs for any errors

### Deployment Fails
If Railway deployment fails:
1. Check Python version in `runtime.txt` (should be `python-3.11.9`)
2. Verify all dependencies in `requirements.txt` are correct
3. Check Railway build logs for specific errors

## 🎉 Success!

Once both are deployed and connected, your AdShield AI platform will be live and ready to protect users from scams!

Visit your Vercel URL to start using the application.
