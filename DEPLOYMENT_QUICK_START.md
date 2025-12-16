# BM Healthcare - Quick Deployment Reference

## 🚀 Quick Start Guide

### Prerequisites
- GitHub account
- Vercel account (sign up with GitHub)
- Render account (sign up with GitHub)
- MongoDB Atlas account (free tier)

---

## 📦 Deployment Order

1. **MongoDB Atlas** → Set up database first
2. **Render** → Deploy backend with MongoDB connection
3. **Vercel** → Deploy frontend with backend URL

---

## 🗄️ MongoDB Atlas Setup (5 minutes)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with password
3. Whitelist all IPs (0.0.0.0/0)
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bmhealthcare?retryWrites=true&w=majority
   ```

---

## 🔧 Render Backend Deployment (10 minutes)

### Deploy Steps:
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Required Environment Variables:
```bash
NODE_ENV=production
PORT=10000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<generate_32_char_random_string>
JWT_EXPIRE=30d
RAZORPAY_KEY_ID=<from_razorpay_dashboard>
RAZORPAY_KEY_SECRET=<from_razorpay_dashboard>
CLOUDINARY_CLOUD_NAME=<from_cloudinary>
CLOUDINARY_API_KEY=<from_cloudinary>
CLOUDINARY_API_SECRET=<from_cloudinary>
SMS_API_KEY=<textlocal_or_twilio_key>
SMS_SENDER_ID=BMHEALTH
SMS_BASE_URL=https://api.textlocal.in/send/
FRONTEND_URL=<will_add_after_vercel_deploy>
BACKEND_URL=<your_render_url>
```

### Get Your Backend URL:
After deployment: `https://bm-healthcare-backend.onrender.com`

---

## 🌐 Vercel Frontend Deployment (5 minutes)

### Deploy Steps:
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Configure:
   - **Root Directory**: `frontend`
   - Framework: Next.js (auto-detected)

### Required Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=<same_as_backend>
```

### Get Your Frontend URL:
After deployment: `https://your-project.vercel.app`

---

## 🔄 Final Step

Go back to Render and update:
```bash
FRONTEND_URL=https://your-project.vercel.app
```

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend deployed on Render (check logs)
- [ ] Frontend deployed on Vercel
- [ ] Can access frontend URL
- [ ] Can book doctor appointment
- [ ] Can book lab test
- [ ] Can view bookings with mobile number

---

## 🔑 Where to Get API Keys

### Razorpay (Payment Gateway)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys
3. Generate Test/Live keys

### Cloudinary (Image Upload)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details
3. Copy Cloud Name, API Key, API Secret

### TextLocal (SMS - India)
1. Sign up at [textlocal.in](https://www.textlocal.in)
2. Get API Key from dashboard
3. Or use Twilio for international SMS

---

## ⚠️ Important Notes

### Render Free Tier
- Backend sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Consider paid plan for production

### Email Fields
- ✅ Email is now **optional** in all forms
- ✅ Phone number is the primary identifier
- ✅ Works for both doctor and patient registration

### Security
- Never commit `.env` files
- Use strong passwords (32+ chars for JWT_SECRET)
- Keep API keys private

---

## 🐛 Common Issues

**Backend not responding:**
- Wait 60 seconds (free tier spin-up time)
- Check Render logs for errors
- Verify all environment variables are set

**CORS errors:**
- Update `FRONTEND_URL` in Render
- Redeploy backend

**Database connection failed:**
- Check MongoDB IP whitelist
- Verify connection string format
- Ensure user has read/write permissions

---

## 📞 Quick Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Full Deployment Guide**: See `DEPLOYMENT_GUIDE.md`

---

**Ready to Deploy!** 🎉

Follow the steps in order, and your application will be live in ~20 minutes.

---

**Maintained by:** Joydeep Bhattacharya  
**Date:** December 16, 2024
