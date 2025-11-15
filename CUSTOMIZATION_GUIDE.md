# 🎨 Customization Guide - BM Healthcare

## 📍 How to Change Google Maps Location

### Current Location
The maps currently show Mumbai, Maharashtra. To change to your actual location:

### Steps:

1. **Go to Google Maps**: https://www.google.com/maps

2. **Search for your address**: Enter your clinic/hospital address

3. **Click "Share"** button

4. **Click "Embed a map"** tab

5. **Copy the iframe code**

6. **Replace in these files**:

#### Home Page (`frontend/src/pages/index.js`)
Find line ~239 and replace the `src` URL in the iframe

#### Contact Page (`frontend/src/pages/contact.js`)
Find line ~256 and replace the `src` URL in the iframe

### Example:
```html
<iframe
  src="YOUR_GOOGLE_MAPS_EMBED_URL_HERE"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
></iframe>
```

---

## 🖼️ How to Change Carousel Images

### Current Images
The home page carousel uses free stock images from Unsplash.

### Option 1: Use Your Own Images

1. **Add images to**: `frontend/public/images/`
   - Create the folder if it doesn't exist
   - Add your images: `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`

2. **Update** `frontend/src/pages/index.js` (around line 9-25):

```javascript
const slides = [
  {
    image: '/images/hero-1.jpg',  // Your local image
    title: 'Your Health, Our Priority',
    subtitle: 'Quality healthcare services at your fingertips'
  },
  {
    image: '/images/hero-2.jpg',  // Your local image
    title: 'Expert Medical Care',
    subtitle: 'Consult with experienced doctors online or in-person'
  },
  {
    image: '/images/hero-3.jpg',  // Your local image
    title: 'Advanced Diagnostics',
    subtitle: 'Comprehensive lab tests with accurate results'
  }
];
```

### Option 2: Use Different Stock Images

Visit these free image sites:
- **Unsplash**: https://unsplash.com/s/photos/healthcare
- **Pexels**: https://www.pexels.com/search/medical/
- **Pixabay**: https://pixabay.com/images/search/hospital/

Copy the image URL and use it in the slides array.

### Option 3: Add More Slides

```javascript
const slides = [
  // ... existing slides ...
  {
    image: '/images/hero-4.jpg',
    title: 'Your New Slide Title',
    subtitle: 'Your new slide subtitle'
  }
];
```

### Carousel Settings

**Change slide duration** (currently 4 seconds):
```javascript
// In index.js, line ~28
const timer = setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % slides.length);
}, 4000);  // Change 4000 to your desired milliseconds
```

**Examples:**
- 3 seconds: `3000`
- 5 seconds: `5000`
- 6 seconds: `6000`

---

## 🎨 How to Change Colors

### Primary Color (Teal/Cyan)

Edit `frontend/tailwind.config.js`:

```javascript
primary: {
  50: '#e6f7f7',
  100: '#b3e6e6',
  200: '#80d4d4',
  300: '#4dc3c3',
  400: '#1ab1b1',
  500: '#009999',  // Main color - change this
  600: '#007a7a',
  700: '#005c5c',
  800: '#003d3d',
  900: '#001f1f',
}
```

**Popular alternatives:**
- Blue: `#2563eb`
- Green: `#10b981`
- Purple: `#8b5cf6`
- Red: `#ef4444`

### Generate Color Palette

Use: https://uicolors.app/create
1. Enter your main color
2. Copy the generated palette
3. Replace in `tailwind.config.js`

---

## 📝 How to Change Text Content

### Company Name

**Change "BM Healthcare" to your name:**

1. **Navbar** (`frontend/src/components/Navbar.js` - line ~24)
2. **Footer** (`frontend/src/components/Footer.js` - line ~9)
3. **All page titles** (search for "BM Healthcare")

### Contact Information

**Update in these files:**

1. **Footer** (`frontend/src/components/Footer.js` - lines 75-95)
2. **Contact Page** (`frontend/src/pages/contact.js` - lines 40-100)
3. **Home Page** (`frontend/src/pages/index.js` - lines 210-235)

**Change:**
- Address
- Phone numbers
- Email addresses
- Working hours

### Example:
```javascript
<p>123 Healthcare Street</p>  // Change to your address
<p>+91 98765 43210</p>        // Change to your phone
<p>info@bmhealthcare.com</p>  // Change to your email
```

---

## 👨‍⚕️ How to Add/Edit Sample Doctors

Edit `frontend/src/pages/doctors.js` (lines 32-60):

```javascript
setDoctors([
  {
    _id: '1',
    name: 'Dr. Your Doctor Name',
    specialization: 'Specialization',
    qualifications: 'MBBS, MD',
    experience: 10,
    consultationFee: 500,
    bio: 'Doctor description here'
  },
  // Add more doctors...
]);
```

---

## 🧪 How to Add/Edit Sample Tests

Edit `frontend/src/pages/tests.js` (lines 32-81):

```javascript
setTests([
  {
    _id: '1',
    name: 'Test Name',
    description: 'Test description',
    category: 'Blood Test',
    price: 300,
    preparationInstructions: 'Instructions here',
    reportDeliveryTime: '6 hours',
    isHomeCollectionAvailable: true,
    homeCollectionCharge: 50,
    parameters: ['Parameter 1', 'Parameter 2']
  },
  // Add more tests...
]);
```

---

## 🔗 How to Add Social Media Links

Edit `frontend/src/components/Footer.js` (lines 25-45):

```javascript
<a href="https://facebook.com/yourpage" className="...">
  <FiFacebook size={20} />
</a>
<a href="https://twitter.com/yourhandle" className="...">
  <FiTwitter size={20} />
</a>
// ... etc
```

Also update in `frontend/src/pages/contact.js` (lines 125-165)

---

## 📱 Logo & Favicon

### Add Logo

1. **Add logo image** to `frontend/public/logo.png`

2. **Update Navbar** (`frontend/src/components/Navbar.js`):
```javascript
<Link href="/" className="flex items-center space-x-2">
  <img src="/logo.png" alt="Logo" className="h-10 w-10" />
  <div className="text-2xl font-bold text-primary-500">
    Your Company Name
  </div>
</Link>
```

### Change Favicon

1. **Replace** `frontend/public/favicon.ico` with your icon
2. Or add in `frontend/src/pages/_document.js`:
```javascript
<link rel="icon" href="/your-favicon.ico" />
```

---

## 🎯 Quick Customization Checklist

- [ ] Change company name everywhere
- [ ] Update contact information
- [ ] Add your Google Maps location
- [ ] Upload your carousel images
- [ ] Change primary color (optional)
- [ ] Add your logo
- [ ] Update social media links
- [ ] Add real doctors data
- [ ] Add real tests data
- [ ] Change favicon

---

## 🚀 After Customization

1. **Restart frontend** (if running):
```bash
cd frontend
npm run dev
```

2. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

3. **Test all pages** to ensure everything looks good

---

## 💡 Pro Tips

1. **Keep backups** before making major changes
2. **Test on mobile** after customization
3. **Use consistent colors** throughout the site
4. **Optimize images** before uploading (use tools like TinyPNG)
5. **Update meta descriptions** for SEO

---

**Need help? Check the main documentation or contact support!**
