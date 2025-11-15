# Image Guide for Service Cards

## Current Status
✅ **Ambulance Service** - Using actual image: `ambulance.jpeg`
🎨 **Other Services** - Using gradient backgrounds with large icons (looks professional!)

## Optional: Add More Images

If you want to replace the gradient backgrounds with actual images, add the following images to:
`/frontend/public/images/`

### Recommended Image Names and Subjects:

1. **home-collection.jpeg** or **home-collection.jpg**
   - Subject: Healthcare worker collecting blood sample at home, or medical professional with collection kit

2. **diagnostic-tests.jpeg** or **diagnostic-tests.jpg**
   - Subject: Medical imaging equipment (MRI, CT scan, ultrasound machine)

3. **elderly-care.jpeg** or **elderly-care.jpg**
   - Subject: Healthcare worker assisting senior citizen, or elderly patient receiving care

4. **police-army-care.jpeg** or **police-army-care.jpg**
   - Subject: Police or military personnel, or badge/uniform imagery

5. **blood-report.jpeg** or **blood-report.jpg**
   - Subject: Lab technician with test tubes, or medical reports/documents

6. **eye-specialist.jpeg** or **eye-specialist.jpg**
   - Subject: Eye examination, ophthalmologist with equipment, or eye care imagery

7. **swasthya-sathi.jpeg** or **swasthya-sathi.jpg**
   - Subject: Swasthya Sathi card, hospital building, or healthcare facility

## How to Add Images

1. Save your images with the exact names above in: `/frontend/public/images/`

2. Update the code in `/frontend/src/pages/index.js`:

Replace the gradient background divs with Image components like this:

```jsx
// Example for Home Collection Service:
<div className="relative h-40 mb-4">
  <Image
    src="/images/home-collection.jpeg"
    alt="Home Collection Service"
    fill
    className="object-cover"
  />
</div>
```

## Current Design
The gradient backgrounds with large icons look clean and professional. Only add images if you have high-quality, relevant photos available.

## Image Requirements
- **Format**: JPEG or JPG (PNG also works)
- **Size**: Recommended 800x600px or similar aspect ratio
- **Quality**: High resolution, professional-looking
- **Content**: Relevant to the service, clear and well-lit
