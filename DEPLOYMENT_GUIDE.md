# BM Healthcare - Deployment Guide

## 🚀 Complete Deployment Instructions

This guide will help you deploy the BM Healthcare application with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 📋 Pre-Deployment Checklist

### ✅ Changes Made for Deployment
1. **Email fields made optional** in User and Doctor models
2. **Deployment configurations** already in place:
   - `frontend/vercel.json` - Vercel configuration
   - `backend/render.yaml` - Render configuration
3. **Environment variables** documented in `.env.example` files

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (Free tier M0 is sufficient)

### 1.2 Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Create a username and strong password
3. Set user privileges to **Read and write to any database**
4. Save the credentials securely

### 1.3 Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
3. Or add specific IPs for better security

### 1.4 Get Connection String
1. Go to **Database** → **Connect** → **Connect your application**
2. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with your credentials
4. Add database name: `mongodb+srv://...mongodb.net/bmhealthcare?retryWrites=true&w=majority`

---

## 🔧 Step 2: Deploy Backend on Render

### 2.1 Prepare Backend Repository
1. Make sure your backend code is pushed to GitHub
2. Repository structure should have `backend/` folder with:
   - `package.json`
   - `render.yaml`
   - `src/server.js`

### 2.2 Create Render Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### 2.3 Create New Web Service
1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Select the repository containing your backend code

### 2.4 Configure Web Service
- **Name**: `bm-healthcare-backend`
- **Region**: Singapore (or closest to your users)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 2.5 Add Environment Variables
Go to **Environment** tab and add these variables:

```bash
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMS_API_KEY=your_textlocal_or_twilio_api_key
SMS_SENDER_ID=BMHEALTH
SMS_BASE_URL=https://api.textlocal.in/send/
FRONTEND_URL=https://your-frontend-url.vercel.app
BACKEND_URL=https://your-backend-url.onrender.com
```

**Important Notes:**
- Generate a strong JWT_SECRET (at least 32 characters)
- Get Razorpay keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Get Cloudinary credentials from [Cloudinary Console](https://cloudinary.com/console)
- For SMS, use TextLocal or Twilio API keys

### 2.6 Deploy Backend
1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://bm-healthcare-backend.onrender.com`

### 2.7 Test Backend
Visit: `https://your-backend-url.onrender.com/api/health` (if health endpoint exists)

---

## 🌐 Step 3: Deploy Frontend on Vercel

### 3.1 Prepare Frontend Repository
1. Make sure frontend code is in GitHub
2. Repository should have `frontend/` folder with:
   - `package.json`
   - `vercel.json`
   - `next.config.js`

### 3.2 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access repositories

### 3.3 Import Project
1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Vercel will auto-detect Next.js

### 3.4 Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3.5 Add Environment Variables
Add these in Vercel project settings:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:**
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- Use the same Razorpay Key ID as backend

### 3.6 Deploy Frontend
1. Click **Deploy**
2. Wait for build and deployment (3-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

### 3.7 Configure Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🔄 Step 4: Update Backend with Frontend URL

After frontend is deployed:

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Render will automatically redeploy

---

## 🧪 Step 5: Test the Deployment

### 5.1 Test Backend APIs
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Get doctors
curl https://your-backend-url.onrender.com/api/doctors

# Get tests
curl https://your-backend-url.onrender.com/api/tests
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Test these pages:
   - Home page
   - Book Doctor
   - Book Test
   - My Bookings
   - Contact

### 5.3 Test Full Flow
1. Book a doctor appointment
2. Book a lab test
3. Check bookings with mobile number
4. Verify receptionist login (if applicable)

---

## 🔐 Step 6: Secure Your Application

### 6.1 Environment Variables Security
- ✅ Never commit `.env` files to Git
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Keep API keys private
- ✅ Rotate secrets periodically

### 6.2 Database Security
- ✅ Use strong MongoDB passwords
- ✅ Restrict IP access if possible
- ✅ Enable MongoDB Atlas encryption

### 6.3 API Security
- ✅ CORS is configured in backend
- ✅ Rate limiting (consider adding)
- ✅ Input validation is in place

---

## 📊 Step 7: Monitor Your Application

### 7.1 Render Monitoring
- Check logs in Render dashboard
- Monitor CPU and memory usage
- Set up alerts for downtime

### 7.2 Vercel Monitoring
- Check deployment logs
- Monitor build times
- Review analytics

### 7.3 Database Monitoring
- Monitor MongoDB Atlas metrics
- Check connection count
- Review query performance

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- **Solution**: Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- **Solution**: Update `FRONTEND_URL` in backend env variables
- Check CORS configuration in `server.js`

**Problem**: Database connection failed
- **Solution**: Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is correct
- Check if backend is running
- Look for CORS errors in browser console

**Problem**: Build failing
- **Solution**: Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Problem**: Environment variables not working
- **Solution**: Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding new variables
- Clear build cache and redeploy

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Vercel** (Frontend):
- Automatically deploys on push to main branch
- Preview deployments for pull requests
- Instant rollback available

**Render** (Backend):
- Auto-deploys on push to main branch
- Manual deploy option available
- Zero-downtime deployments

### Manual Deployment

**Vercel**:
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Render**:
- Use Render dashboard → Manual Deploy
- Or push to GitHub (auto-deploys)

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier**:
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ 750 hours/month free
- ✅ Automatic HTTPS

**Vercel Free Tier**:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN

**MongoDB Atlas Free Tier**:
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Suitable for development/small apps

### Upgrade Recommendations

Consider upgrading if:
- Backend response time is critical (Render paid plan)
- High traffic expected (Vercel Pro)
- Need more database storage (MongoDB Atlas paid tier)

---

## 🎉 Deployment Complete!

Your BM Healthcare application is now live!

**Frontend URL**: `https://your-project.vercel.app`  
**Backend URL**: `https://your-backend.onrender.com`

### Next Steps:
1. ✅ Test all features thoroughly
2. ✅ Set up monitoring and alerts
3. ✅ Configure custom domain (optional)
4. ✅ Set up backup strategy for database
5. ✅ Document API endpoints
6. ✅ Create user documentation

---

## 📞 Support

For deployment issues:
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Render**: [Render Documentation](https://render.com/docs)
- **MongoDB**: [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Deployed and Maintained by:** Joydeep Bhattacharya  
**Last Updated:** December 16, 2024
