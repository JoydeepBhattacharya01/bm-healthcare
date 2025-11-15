# 🚀 Quick Start Guide - BM Healthcare

Get up and running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be v14 or higher
npm --version   # Should be 6 or higher
```

## Quick Setup Commands

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials (IMPORTANT!)
# nano .env  # or use your preferred editor

# Start backend server
npm run dev
```

**Backend should be running on:** `http://localhost:5001`

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your API URL
# nano .env.local  # or use your preferred editor

# Start frontend server
npm run dev
```

**Frontend should be running on:** `http://localhost:3000`

## Essential Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

## Test Your Setup

1. Open browser: `http://localhost:3000`
2. You should see the BM Healthcare homepage
3. Try registering a new account
4. Backend API test: `http://localhost:5001`

## Next Steps

1. ✅ Create an admin user (see SETUP_GUIDE.md)
2. ✅ Add sample doctors and tests
3. ✅ Test booking flow
4. ✅ Configure SMS and payment gateways

## Need Help?

- 📖 Read the full [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- 📖 Check [README.md](./README.md) for detailed documentation
- 🐛 Check terminal logs for errors

---

**You're all set! Start building! 🎉**
