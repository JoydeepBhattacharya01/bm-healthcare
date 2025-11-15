# 🌳 BM Healthcare - Complete Project Tree

## Visual Project Structure

```
bm-healthcare/
│
├── 📁 backend/                          # Backend API (Express.js + MongoDB)
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 config/                   # Configuration files
│   │   │   ├── 📄 db.js                 # MongoDB connection
│   │   │   └── 📄 cloudinary.js         # Cloudinary setup & multer
│   │   │
│   │   ├── 📁 controllers/              # Business logic
│   │   │   ├── 📄 authController.js     # Auth: register, login, profile
│   │   │   ├── 📄 userController.js     # User CRUD operations
│   │   │   ├── 📄 doctorController.js   # Doctor management
│   │   │   ├── 📄 appointmentController.js  # Appointment booking
│   │   │   ├── 📄 testController.js     # Test & booking management
│   │   │   ├── 📄 reportController.js   # Report upload/download
│   │   │   └── 📄 paymentController.js  # Razorpay integration
│   │   │
│   │   ├── 📁 models/                   # Database schemas
│   │   │   ├── 📄 User.js               # User model (3 roles)
│   │   │   ├── 📄 Doctor.js             # Doctor with time slots
│   │   │   ├── 📄 Appointment.js        # Appointment bookings
│   │   │   ├── 📄 Test.js               # Diagnostic tests
│   │   │   ├── 📄 TestBooking.js        # Test bookings
│   │   │   ├── 📄 Report.js             # Medical reports
│   │   │   └── 📄 Payment.js            # Payment records
│   │   │
│   │   ├── 📁 routes/                   # API routes
│   │   │   ├── 📄 authRoutes.js         # /api/auth/*
│   │   │   ├── 📄 userRoutes.js         # /api/users/*
│   │   │   ├── 📄 doctorRoutes.js       # /api/doctors/*
│   │   │   ├── 📄 appointmentRoutes.js  # /api/appointments/*
│   │   │   ├── 📄 testRoutes.js         # /api/tests/*
│   │   │   ├── 📄 reportRoutes.js       # /api/reports/*
│   │   │   └── 📄 paymentRoutes.js      # /api/payments/*
│   │   │
│   │   ├── 📁 middleware/               # Custom middleware
│   │   │   ├── 📄 authMiddleware.js     # JWT auth & role check
│   │   │   └── 📄 errorMiddleware.js    # Error handling
│   │   │
│   │   ├── 📁 utils/                    # Helper functions
│   │   │   ├── 📄 generateToken.js      # JWT token generator
│   │   │   ├── 📄 smsService.js         # SMS notifications
│   │   │   └── 📄 seeder.js             # Sample data seeder
│   │   │
│   │   └── 📄 server.js                 # Main server file
│   │
│   ├── 📄 .env.example                  # Environment template
│   ├── 📄 .gitignore                    # Git ignore rules
│   └── 📄 package.json                  # Dependencies & scripts
│
├── 📁 frontend/                         # Frontend App (Next.js + React)
│   │
│   ├── 📁 public/                       # Static assets
│   │   └── 📁 images/                   # Images folder
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 components/               # Reusable components
│   │   │   ├── 📄 Layout.js             # Main layout wrapper
│   │   │   ├── 📄 Navbar.js             # Navigation bar
│   │   │   └── 📄 Footer.js             # Footer component
│   │   │
│   │   ├── 📁 pages/                    # Next.js pages (routes)
│   │   │   ├── 📄 _app.js               # App wrapper with providers
│   │   │   ├── 📄 _document.js          # HTML document structure
│   │   │   ├── 📄 index.js              # Home page (/)
│   │   │   ├── 📄 login.js              # Login page (/login)
│   │   │   └── 📄 register.js           # Register page (/register)
│   │   │
│   │   ├── 📁 context/                  # React Context
│   │   │   └── 📄 AuthContext.js        # Authentication state
│   │   │
│   │   ├── 📁 utils/                    # Helper utilities
│   │   │   └── 📄 api.js                # Axios instance & interceptors
│   │   │
│   │   ├── 📁 styles/                   # Styling files
│   │   │   └── 📄 globals.css           # Global styles + Tailwind
│   │   │
│   │   ├── 📁 hooks/                    # Custom React hooks (empty)
│   │   ├── 📁 services/                 # API services (empty)
│   │   └── 📁 assets/                   # Assets (empty)
│   │
│   ├── 📄 .env.local.example            # Frontend env template
│   ├── 📄 .gitignore                    # Git ignore rules
│   ├── 📄 next.config.js                # Next.js configuration
│   ├── 📄 tailwind.config.js            # Tailwind CSS config
│   ├── 📄 postcss.config.js             # PostCSS config
│   └── 📄 package.json                  # Dependencies & scripts
│
├── 📄 README.md                         # Main documentation (500+ lines)
├── 📄 SETUP_GUIDE.md                    # Setup instructions (400+ lines)
├── 📄 QUICKSTART.md                     # Quick start guide (100+ lines)
├── 📄 PROJECT_STATUS.md                 # Status & roadmap (300+ lines)
├── 📄 DEPLOYMENT_SUMMARY.md             # Deployment guide (500+ lines)
├── 📄 API_TESTING_GUIDE.md              # API testing (600+ lines)
├── 📄 FINAL_SUMMARY.md                  # Complete summary (700+ lines)
└── 📄 PROJECT_TREE.md                   # This file

```

---

## 📊 File Count by Category

### Backend
- **Config**: 2 files
- **Controllers**: 7 files
- **Models**: 7 files
- **Routes**: 7 files
- **Middleware**: 2 files
- **Utils**: 3 files
- **Main**: 1 file (server.js)
- **Config Files**: 3 files (.env.example, .gitignore, package.json)
- **Total**: 32 files

### Frontend
- **Components**: 3 files
- **Pages**: 5 files
- **Context**: 1 file
- **Utils**: 1 file
- **Styles**: 1 file
- **Config Files**: 6 files
- **Total**: 17 files

### Documentation
- **Guides**: 7 files
- **Total**: 7 files

### Grand Total: 56 files

---

## 🎯 Key Files to Know

### Backend Entry Points
```
📄 backend/src/server.js              # Start here - main server
📄 backend/src/config/db.js           # Database connection
📄 backend/package.json               # Dependencies & scripts
```

### Frontend Entry Points
```
📄 frontend/src/pages/_app.js         # App wrapper
📄 frontend/src/pages/index.js        # Home page
📄 frontend/package.json              # Dependencies & scripts
```

### Configuration Files
```
📄 backend/.env.example               # Backend environment vars
📄 frontend/.env.local.example        # Frontend environment vars
📄 frontend/tailwind.config.js        # Tailwind customization
📄 frontend/next.config.js            # Next.js settings
```

### Documentation Files
```
📄 README.md                          # Start here for overview
📄 QUICKSTART.md                      # Quick 5-min setup
📄 SETUP_GUIDE.md                     # Detailed setup
📄 API_TESTING_GUIDE.md               # Test all APIs
📄 PROJECT_STATUS.md                  # What's done/pending
📄 DEPLOYMENT_SUMMARY.md              # Deploy guide
📄 FINAL_SUMMARY.md                   # Complete summary
```

---

## 🔍 File Descriptions

### Backend Controllers (Business Logic)

| File | Purpose | Endpoints |
|------|---------|-----------|
| `authController.js` | User authentication | register, login, profile, change password |
| `userController.js` | User management | CRUD operations, statistics |
| `doctorController.js` | Doctor management | CRUD, slots, specializations |
| `appointmentController.js` | Appointments | book, confirm, cancel, stats |
| `testController.js` | Tests & bookings | CRUD tests, book tests, confirm |
| `reportController.js` | Reports | upload, download, view, delete |
| `paymentController.js` | Payments | create order, verify, refund, stats |

### Backend Models (Database Schemas)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User.js` | Users/Patients | name, email, password, role, phone |
| `Doctor.js` | Doctors | name, specialization, fee, slots |
| `Appointment.js` | Appointments | patient, doctor, date, time, status |
| `Test.js` | Diagnostic tests | name, category, price, parameters |
| `TestBooking.js` | Test bookings | patient, tests, date, collection type |
| `Report.js` | Medical reports | patient, booking, file, uploaded by |
| `Payment.js` | Payments | user, booking, amount, razorpay IDs |

### Frontend Pages (Routes)

| File | Route | Purpose |
|------|-------|---------|
| `index.js` | `/` | Home page with carousel |
| `login.js` | `/login` | User login |
| `register.js` | `/register` | User registration |
| `_app.js` | N/A | App wrapper with providers |
| `_document.js` | N/A | HTML document structure |

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `Layout.js` | Page wrapper with navbar & footer |
| `Navbar.js` | Navigation bar (responsive) |
| `Footer.js` | Footer with links & info |

---

## 📂 Folders to Create (For Future Development)

### Backend
```
backend/src/
├── tests/              # Unit & integration tests
├── validators/         # Input validation schemas
└── services/           # Business logic services
```

### Frontend
```
frontend/src/
├── pages/
│   ├── doctors/        # Doctor pages
│   ├── tests/          # Test pages
│   ├── dashboard/      # User dashboard
│   ├── admin/          # Admin pages
│   └── profile/        # Profile pages
├── components/
│   ├── cards/          # Card components
│   ├── forms/          # Form components
│   ├── modals/         # Modal components
│   └── tables/         # Table components
└── hooks/              # Custom hooks
```

---

## 🚀 Quick Navigation Guide

### Want to...

**Add a new API endpoint?**
1. Create controller function in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Update `backend/src/server.js` if new route file

**Add a new page?**
1. Create file in `frontend/src/pages/`
2. Use Layout component
3. Connect to API via `utils/api.js`

**Add a new component?**
1. Create file in `frontend/src/components/`
2. Import and use in pages

**Modify database schema?**
1. Edit model in `backend/src/models/`
2. Update controller logic if needed

**Change styling?**
1. Edit `frontend/src/styles/globals.css`
2. Or modify `frontend/tailwind.config.js`

**Add sample data?**
1. Edit `backend/src/utils/seeder.js`
2. Run `npm run seed`

---

## 📝 File Naming Conventions

### Backend
- **Controllers**: `[resource]Controller.js` (camelCase)
- **Models**: `[Resource].js` (PascalCase)
- **Routes**: `[resource]Routes.js` (camelCase)
- **Middleware**: `[purpose]Middleware.js` (camelCase)
- **Utils**: `[purpose].js` (camelCase)

### Frontend
- **Pages**: `[page-name].js` (kebab-case)
- **Components**: `[ComponentName].js` (PascalCase)
- **Utils**: `[utility].js` (camelCase)
- **Context**: `[Context]Context.js` (PascalCase)

---

## 🎨 Code Organization Principles

1. **Separation of Concerns**: Each file has a single responsibility
2. **Modular Structure**: Easy to find and modify code
3. **Consistent Naming**: Predictable file names
4. **Clear Hierarchy**: Logical folder structure
5. **Scalability**: Easy to add new features

---

## 🔗 File Dependencies

### Backend Flow
```
server.js
  ↓
routes/*.js
  ↓
middleware/authMiddleware.js (if protected)
  ↓
controllers/*.js
  ↓
models/*.js
  ↓
config/db.js (MongoDB)
```

### Frontend Flow
```
pages/_app.js
  ↓
context/AuthContext.js
  ↓
pages/[page].js
  ↓
components/Layout.js
  ↓
components/Navbar.js & Footer.js
  ↓
utils/api.js (API calls)
```

---

## 📦 Package Dependencies

### Backend (18 packages)
- express, mongoose, dotenv
- bcryptjs, jsonwebtoken, cookie-parser
- cors, morgan, express-async-handler
- express-validator, moment
- cloudinary, multer, multer-storage-cloudinary
- razorpay, twilio, axios
- winston, nodemon (dev)

### Frontend (8 packages)
- next, react, react-dom
- axios, js-cookie
- react-hot-toast, react-icons
- moment, tailwindcss (dev)

---

## 🎯 Important Files Checklist

Before running:
- ✅ `backend/.env` - Environment variables
- ✅ `frontend/.env.local` - Frontend config
- ✅ `backend/package.json` - Dependencies installed
- ✅ `frontend/package.json` - Dependencies installed

Before deploying:
- ✅ All environment variables set
- ✅ MongoDB Atlas configured
- ✅ Cloudinary account setup
- ✅ Razorpay keys obtained
- ✅ SMS service configured

---

**Use this tree as your navigation guide throughout development! 🗺️**
