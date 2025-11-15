# 🖼️ Images Reference Guide - BM Healthcare

## 📸 All Images Used in the Project

This document lists all the stock images used throughout the website for easy reference and replacement.

---

## 🏠 Home Page (`/`)

### Carousel Images (Auto-sliding)
**Location**: `frontend/src/pages/index.js` (lines 10-24)

1. **Slide 1**: `/images/hero-1.jpeg` (Your local image)
   - Title: "Your Health, Our Priority"
   - Subtitle: "Quality healthcare services at your fingertips"

2. **Slide 2**: `/images/hero-2.jpeg` (Your local image)
   - Title: "Expert Medical Care"
   - Subtitle: "Consult with experienced doctors online or in-person"

3. **Slide 3**: `/images/hero-3.jpeg` (Your local image)
   - Title: "Advanced Diagnostics"
   - Subtitle: "Comprehensive lab tests with accurate results"

### Contact Section Map
**Location**: `frontend/src/pages/index.js` (line 240)
- **Google Maps**: BM HEALTH CARE location (Kolkata)

---

## 👨‍⚕️ Doctors Page (`/doctors`)

### Hero Background
**Location**: `frontend/src/pages/doctors.js` (line 88)
- **Image**: https://images.unsplash.com/photo-1559839734-2b71ea197ec2
- **Description**: Medical professionals/doctors team
- **Size**: 1920x400px
- **Opacity**: 20%

---

## 🧪 Tests Page (`/tests`)

### Hero Background
**Location**: `frontend/src/pages/tests.js` (line 109)
- **Image**: https://images.unsplash.com/photo-1579154204601-01588f351e67
- **Description**: Laboratory/diagnostic equipment
- **Size**: 1920x400px
- **Opacity**: 20%

---

## 🏥 Services Page (`/services`)

### Hero Background
**Location**: `frontend/src/pages/services.js` (line 104)
- **Image**: https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d
- **Description**: Hospital/healthcare facility
- **Size**: 1920x500px
- **Opacity**: 20%

---

## 📞 Contact Page (`/contact`)

### Hero Background
**Location**: `frontend/src/pages/contact.js` (line 49)
- **Image**: https://images.unsplash.com/photo-1423666639041-f56000c27a9a
- **Description**: Contact/communication theme
- **Size**: 1920x400px
- **Opacity**: 20%

### Google Maps
**Location**: `frontend/src/pages/contact.js` (line 256)
- **Map**: BM HEALTH CARE location (Kolkata)
- **Size**: Full width x 450px

---

## 🔐 Login Page (`/login`)

### Side Image
**Location**: `frontend/src/pages/login.js` (line 43)
- **Image**: https://images.unsplash.com/photo-1576091160399-112ba8d25d1d
- **Description**: Medical professional/doctor
- **Size**: 800x1000px
- **Display**: Hidden on mobile, visible on desktop (lg+)

---

## 📝 Register Page (`/register`)

### Side Image
**Location**: `frontend/src/pages/register.js` (line 60)
- **Image**: https://images.unsplash.com/photo-1505751172876-fa1923c5c528
- **Description**: Healthcare/medical checkup
- **Size**: 800x1200px
- **Display**: Hidden on mobile, visible on desktop (lg+)

---

## 📊 Dashboard Page (`/dashboard`)

### Hero Background
**Location**: `frontend/src/pages/dashboard.js` (line 40)
- **Image**: https://images.unsplash.com/photo-1576091160550-2173dba999ef
- **Description**: Medical dashboard/healthcare
- **Size**: 1920x400px
- **Opacity**: 10%

---

## 🎨 Image Categories & Themes

### Hero Backgrounds (Header Sections)
- **Purpose**: Add visual appeal to page headers
- **Opacity**: 10-20% (subtle, doesn't interfere with text)
- **Size**: 1920px wide (responsive)
- **Theme**: Healthcare, medical, professional

### Side Images (Login/Register)
- **Purpose**: Split-screen design for auth pages
- **Display**: Desktop only (hidden on mobile)
- **Size**: 800px wide
- **Theme**: Medical professionals, healthcare facilities

### Carousel Images (Home Page)
- **Purpose**: Main hero slider with rotating images
- **Auto-slide**: Every 4 seconds
- **Size**: Full width, 500-600px height
- **Theme**: Healthcare services, doctors, diagnostics

---

## 🔄 How to Replace Images

### Replace Hero Background Images

Find the section in the respective file and change the URL:

```javascript
style={{
  backgroundImage: 'url(YOUR_NEW_IMAGE_URL_HERE)',
}}
```

### Replace Side Images (Login/Register)

```javascript
<img
  src="YOUR_NEW_IMAGE_URL_HERE"
  alt="Description"
  className="w-full h-full object-cover"
/>
```

### Replace Carousel Images

Edit `frontend/src/pages/index.js`:

```javascript
const slides = [
  {
    image: '/images/your-new-hero-1.jpg',
    title: 'Your Title',
    subtitle: 'Your Subtitle'
  },
  // ... more slides
];
```

---

## 📥 Image Sources

### Current Source: Unsplash
All stock images are from Unsplash (free to use)
- Website: https://unsplash.com
- License: Free for commercial use
- No attribution required

### Alternative Free Image Sources

1. **Pexels**: https://www.pexels.com
   - Free stock photos
   - Medical/healthcare category available

2. **Pixabay**: https://pixabay.com
   - Free images and videos
   - Hospital/medical images

3. **Freepik**: https://www.freepik.com
   - Free and premium images
   - Medical illustrations available

---

## 🎯 Image Optimization Tips

### Before Uploading Images:

1. **Resize images** to appropriate dimensions:
   - Hero backgrounds: 1920x400px
   - Side images: 800x1000px
   - Carousel: 1920x600px

2. **Compress images** using:
   - TinyPNG: https://tinypng.com
   - Squoosh: https://squoosh.app
   - ImageOptim (Mac)

3. **Target file size**:
   - Hero backgrounds: < 200KB
   - Side images: < 300KB
   - Carousel: < 500KB each

4. **Use appropriate format**:
   - Photos: JPEG/JPG
   - Graphics: PNG
   - Modern browsers: WebP

---

## 📱 Responsive Behavior

### Hero Backgrounds
- **Desktop**: Full width, visible
- **Tablet**: Full width, visible
- **Mobile**: Full width, visible

### Side Images (Login/Register)
- **Desktop (lg+)**: Visible, 50% width
- **Tablet**: Hidden
- **Mobile**: Hidden

### Carousel Images
- **All devices**: Full width, responsive height
- **Auto-slide**: Works on all devices
- **Touch**: Swipe enabled (can be added)

---

## 🎨 Image Overlay Colors

All hero backgrounds use gradient overlays for text readability:

### Primary Pages (Doctors, Contact, Dashboard)
```css
bg-gradient-to-r from-primary-500 to-primary-600
```
Color: Teal/Cyan (#009999)

### Secondary Pages (Tests)
```css
bg-gradient-to-r from-secondary-500 to-secondary-600
```
Color: Orange/Amber

### Mixed (Services)
```css
bg-gradient-to-r from-primary-500 to-secondary-500
```
Color: Teal to Orange gradient

---

## 🔧 Quick Reference: Image Locations

| Page | File | Line | Type |
|------|------|------|------|
| Home | `index.js` | 11-23 | Carousel |
| Home | `index.js` | 240 | Map |
| Doctors | `doctors.js` | 88 | Hero BG |
| Tests | `tests.js` | 109 | Hero BG |
| Services | `services.js` | 104 | Hero BG |
| Contact | `contact.js` | 49 | Hero BG |
| Contact | `contact.js` | 256 | Map |
| Login | `login.js` | 43 | Side Image |
| Register | `register.js` | 60 | Side Image |
| Dashboard | `dashboard.js` | 40 | Hero BG |

---

## ✅ Image Checklist

Before going live, verify:

- [ ] All images load correctly
- [ ] Images are optimized (compressed)
- [ ] Alt text is descriptive
- [ ] Images look good on mobile
- [ ] No broken image links
- [ ] Copyright/licensing is clear
- [ ] Images match brand colors
- [ ] Loading speed is acceptable

---

**All images are now properly integrated! 🎉**
