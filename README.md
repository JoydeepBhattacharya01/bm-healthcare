# BM Healthcare - Diagnostic & Doctor Appointment Web App

A comprehensive MERN stack healthcare web application for managing doctor appointments, diagnostic test bookings, and patient records with role-based access control.

## 🚀 Features

### For Patients (Users)
- Register and login with secure authentication
- Browse and book doctor appointments
- Book diagnostic tests and health packages
- Online payment via Razorpay
- View and download test reports
- Track appointment and test booking status
- Receive SMS notifications for bookings and reports
- Manage profile and view payment history

### For Receptionists
- View and confirm appointments and test bookings
- Book appointments/tests manually for walk-in patients
- Upload test reports
- View payment history
- Manage patient records

### For Admins
- Full system access and management
- Manage users, receptionists, and doctors
- Add/edit doctors and their available time slots
- Manage diagnostic tests and packages
- View comprehensive dashboard with statistics
- Handle payments and refunds
- Upload carousel images for homepage

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Storage**: Cloudinary
- **Payment Gateway**: Razorpay
- **SMS Service**: Twilio / TextLocal

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API / React Query

## 📁 Project Structure

```
bm-healthcare/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── doctorController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── testController.js
│   │   │   ├── reportController.js
│   │   │   └── paymentController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Doctor.js
│   │   │   ├── Appointment.js
│   │   │   ├── Test.js
│   │   │   ├── TestBooking.js
│   │   │   ├── Report.js
│   │   │   └── Payment.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── testRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── smsService.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- SMS service account (Twilio or TextLocal)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=rzp_test_yyyyy

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMS Provider (Twilio or TextLocal)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=BMHEALTH
SMS_BASE_URL=https://api.textlocal.in/send/

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 Database Models

### User
- name, email, password, phone
- role (user, receptionist, admin)
- dateOfBirth, gender, address
- isActive, timestamps

### Doctor
- name, email, phone
- specialization, qualifications, experience
- consultationFee, bio, image
- availableSlots (day, time, duration)
- isActive, rating, totalReviews

### Appointment
- patient (ref: User)
- doctor (ref: Doctor)
- appointmentDate, appointmentTime
- status (pending, confirmed, completed, cancelled)
- symptoms, notes, prescriptionNotes
- payment (ref: Payment)

### Test
- name, description, category
- price, preparationInstructions
- reportDeliveryTime
- isHomeCollectionAvailable, homeCollectionCharge
- parameters

### TestBooking
- patient (ref: User)
- tests (array of Test refs)
- bookingDate, bookingTime
- collectionType (home, walkin)
- status (pending, confirmed, sample_collected, in_progress, completed)
- totalAmount, payment (ref: Payment)
- report (ref: Report)

### Report
- patient (ref: User)
- testBooking (ref: TestBooking)
- reportFile (url, publicId, filename)
- uploadedBy (ref: User)
- remarks, isViewed

### Payment
- user (ref: User)
- bookingType (appointment, test)
- bookingId
- amount, currency
- razorpayOrderId, razorpayPaymentId, razorpaySignature
- status (pending, completed, failed, refunded)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users (Admin/Receptionist)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user
- `GET /api/users/stats` - Get user statistics

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create doctor (Admin)
- `PUT /api/doctors/:id` - Update doctor (Admin)
- `DELETE /api/doctors/:id` - Deactivate doctor (Admin)
- `GET /api/doctors/:id/slots` - Get doctor available slots
- `GET /api/doctors/specializations/list` - Get all specializations

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/confirm` - Confirm appointment (Receptionist/Admin)
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/stats/dashboard` - Get appointment statistics

### Tests & Bookings
- `GET /api/tests` - Get all tests
- `GET /api/tests/:id` - Get test by ID
- `POST /api/tests` - Create test (Admin)
- `PUT /api/tests/:id` - Update test (Admin)
- `DELETE /api/tests/:id` - Deactivate test (Admin)
- `GET /api/tests/categories/list` - Get test categories
- `GET /api/tests/bookings` - Get all test bookings
- `GET /api/tests/bookings/:id` - Get test booking by ID
- `POST /api/tests/bookings` - Create test booking
- `PUT /api/tests/bookings/:id` - Update test booking
- `PUT /api/tests/bookings/:id/confirm` - Confirm test booking

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Upload report (Receptionist/Admin)
- `PUT /api/reports/:id` - Update report (Receptionist/Admin)
- `DELETE /api/reports/:id` - Delete report (Admin)
- `GET /api/reports/:id/download` - Download report

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/:id/refund` - Refund payment (Admin)
- `GET /api/payments/stats/dashboard` - Get payment statistics

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from `.env.example`
5. Deploy

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Add environment variables in Vercel dashboard
4. Deploy to production:
```bash
vercel --prod
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Secure file uploads via Cloudinary
- Payment verification with Razorpay signatures
- HTTPS in production

## 📱 SMS Notifications

The system sends SMS notifications for:
- Appointment bookings and confirmations
- Appointment cancellations
- Test booking confirmations
- Report availability
- Payment confirmations

## 💳 Payment Integration

- Razorpay integration for secure online payments
- Support for multiple payment methods
- Payment verification and signature validation
- Refund processing
- Payment history and invoices

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@bmhealthcare.com or contact the development team.

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for file storage
- Razorpay for payment processing
- Twilio/TextLocal for SMS services
- Vercel and Render for hosting

---

**BM Healthcare** - Your Health, Our Priority 🏥
