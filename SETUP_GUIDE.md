# BM Healthcare - Complete Setup Guide

This guide will help you set up and run the BM Healthcare application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Razorpay Account** - [Sign up](https://razorpay.com/)
- **SMS Service Account** (Twilio or TextLocal)

## Step 1: Clone or Navigate to Project

```bash
cd /Users/joydeep/Desktop/BM\ Healthcare/bm-healthcare
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bmhealthcare?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=30d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# SMS Service (TextLocal for India)
SMS_API_KEY=your_textlocal_api_key
SMS_SENDER_ID=BMHEALTH
SMS_BASE_URL=https://api.textlocal.in/send/

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 2.3 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace in MONGO_URI

### 2.4 Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up and get your credentials from the dashboard
3. Copy Cloud Name, API Key, and API Secret to `.env`

### 2.5 Razorpay Setup

1. Go to [Razorpay](https://razorpay.com/)
2. Create an account and generate test API keys
3. Copy Key ID and Key Secret to `.env`

### 2.6 SMS Service Setup (TextLocal)

1. Go to [TextLocal](https://www.textlocal.in/)
2. Sign up and get your API key
3. Copy API key to `.env`

### 2.7 Start Backend Server

```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

### 3.1 Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.local.example .env.local
```

Edit the `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 3.3 Start Frontend Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## Step 4: Initial Setup and Testing

### 4.1 Create Admin User

You can create an admin user in two ways:

**Option 1: Using MongoDB Compass or Atlas**
1. Connect to your database
2. Go to the `users` collection
3. Insert a document with role: 'admin'

**Option 2: Register via API and manually update role**
1. Register a user via the frontend
2. Update the user's role to 'admin' in MongoDB

### 4.2 Test the Application

1. **Home Page**: Visit `http://localhost:3000`
2. **Register**: Create a new user account
3. **Login**: Login with your credentials
4. **Admin Dashboard**: Login with admin credentials to access admin features

## Step 5: Verify All Features

### Backend API Endpoints
Test using Postman or similar tool:

```
GET  http://localhost:5000/
GET  http://localhost:5000/api/doctors
GET  http://localhost:5000/api/tests
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
```

### Frontend Pages
- Home: `http://localhost:3000/`
- Login: `http://localhost:3000/login`
- Register: `http://localhost:3000/register`
- Doctors: `http://localhost:3000/doctors`
- Tests: `http://localhost:3000/tests`

## Common Issues and Solutions

### Issue 1: MongoDB Connection Failed
**Solution**: 
- Check your MONGO_URI is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### Issue 2: Port Already in Use
**Solution**:
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Issue 3: Module Not Found
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Errors
**Solution**: 
- Ensure FRONTEND_URL in backend .env matches your frontend URL
- Check CORS configuration in backend/src/server.js

## Development Workflow

### Running Both Servers Simultaneously

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Making Changes

- **Backend changes**: Server auto-restarts with nodemon
- **Frontend changes**: Hot reload enabled by Next.js

## Production Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables
5. Deploy

### Frontend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in frontend directory
3. Follow prompts
4. Add environment variables in Vercel dashboard
5. Deploy: `vercel --prod`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Razorpay API Documentation](https://razorpay.com/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## Support

For issues or questions:
- Check the main README.md
- Review error logs in terminal
- Verify all environment variables are set correctly

---

**Happy Coding! 🚀**
