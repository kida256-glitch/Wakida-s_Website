# Photo Gallery Guide

## Overview
Your portfolio now includes an interactive photo gallery section on the Home page with draggable photo cards that have a unique stacked polaroid effect.

## Features

### 1. **Draggable Photo Cards**
- Each photo card can be dragged and repositioned
- Cards have random rotations for a natural scattered look
- Smooth animations and transitions
- Touch-friendly for mobile devices

### 2. **Visual Effects**
- Glassmorphism background with blur effects
- Glowing borders that match your portfolio theme
- Hover effects with scale and elevation
- Staggered appearance animations

### 3. **Responsive Design**
- Adapts to all screen sizes
- Cards resize appropriately on mobile
- Touch gestures supported

## How to Add Your Photos

### Step 1: Prepare Your Images
1. Choose 5 photos you want to display
2. Recommended size: 800x1000px (portrait orientation)
3. Save them in your website folder with simple names like:
   - `photo1.jpg`
   - `photo2.jpg`
   - `photo3.jpg`
   - `photo4.jpg`
   - `photo5.jpg`

### Step 2: Update the HTML
Open `index.html` and find the photo gallery section. Replace each placeholder with your images:

**Before:**
```html
<div class="photo-placeholder">
    <i class="fas fa-image"></i>
    <p>Your Photo 1</p>
</div>
```

**After:**
```html
<img src="photo1.jpg" alt="Description of photo 1" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
```

### Step 3: Complete Example
```html
<div class="photo-card" data-rotation="-8" style="--delay: 0s;">
    <img src="photo1.jpg" alt="At AWS Community Event" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
</div>
```

## Customization Options

### Change Number of Photos
To add more photos, duplicate a photo card block:

```html
<div class="photo-card" data-rotation="4" style="--delay: 0.5s;">
    <img src="photo6.jpg" alt="Your description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
</div>
```

**Tips:**
- Use different `data-rotation` values between -10 and 10
- Increment `--delay` by 0.1s for each new card
- Keep rotations varied for a natural look

### Adjust Card Rotation
Change the `data-rotation` attribute to adjust the tilt angle:
- Negative values: tilt left
- Positive values: tilt right
- Range: -15 to 15 degrees recommended

### Modify Colors
In `styles.css`, find `.photo-card` and adjust:
```css
border: 2px solid rgba(0, 212, 255, 0.3); /* Border color */
background: var(--card-bg); /* Background color */
```

### Change Card Size
In `styles.css`, find `.photo-card`:
```css
width: 320px;  /* Adjust width */
height: 400px; /* Adjust height */
```

## Disable Dragging (Optional)
If you want static cards, remove the drag functionality by commenting out this section in `script.js`:

```javascript
// card.addEventListener('mousedown', dragStart);
// card.addEventListener('touchstart', dragStart);
```

## Remove Gallery Section
If you decide you don't want the gallery:
1. Open `index.html`
2. Find `<section id="gallery" class="gallery">`
3. Delete the entire section (from opening to closing tag)

## Troubleshooting

### Photos Not Showing
- Check file paths are correct
- Ensure images are in the same folder as `index.html`
- Verify image file names match exactly (case-sensitive)

### Cards Not Dragging
- Check browser console for JavaScript errors
- Ensure `script.js` is loaded after the HTML content
- Try refreshing the page with Ctrl+F5 (hard refresh)

### Layout Issues on Mobile
- Test on actual mobile devices, not just browser resize
- Check that images aren't too large (compress if needed)
- Verify responsive CSS is not overridden

## Best Practices

1. **Image Optimization**
   - Compress images to reduce file size
   - Use WebP format for better performance
   - Keep individual images under 500KB

2. **Accessibility**
   - Always include descriptive `alt` text
   - Ensure sufficient color contrast
   - Test with keyboard navigation

3. **Content Selection**
   - Choose high-quality, professional photos
   - Mix different types: events, projects, achievements
   - Keep photos relevant to your portfolio story

4. **Performance**
   - Lazy load images if you add many photos
   - Consider using thumbnails with lightbox for full size
   - Test loading speed on slow connections

## Advanced Customization

### Add Captions
Wrap your image in a container with caption:

```html
<div class="photo-card" data-rotation="-8" style="--delay: 0s;">
    <div style="position: relative; width: 100%; height: 100%;">
        <img src="photo1.jpg" alt="AWS Event" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
        <div style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px; color: white; font-size: 0.9rem;">
            AWS Community Day 2024
        </div>
    </div>
</div>
```

### Add Click Actions
In `script.js`, add click handlers:

```javascript
photoCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        // Open full-size image in modal
        // Or navigate to a detailed page
        console.log(`Clicked photo ${index + 1}`);
    });
});
```

### Create Photo Modal/Lightbox
For a full-screen photo viewer, you can integrate a lightbox library like:
- [Lightbox2](https://lokeshdhakar.com/projects/lightbox2/)
- [GLightbox](https://biati-digital.github.io/glightbox/)
- [PhotoSwipe](https://photoswipe.com/)

## Need Help?
- Check browser console for errors (F12)
- Validate HTML at [validator.w3.org](https://validator.w3.org/)
- Test in multiple browsers
- Refer to `QUICK_REFERENCE.md` for general portfolio tips
