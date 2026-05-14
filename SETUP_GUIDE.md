# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Open the Website
Simply open `index.html` in your web browser. That's it! No installation needed.

### Step 2: Add Your Photo (Optional but Recommended)

1. **Prepare your photo**:
   - Use a professional headshot or portrait
   - Recommended size: 400x400 pixels or larger (square format works best)
   - Supported formats: JPG, PNG, WebP
   - Name it something simple like `profile.jpg`

2. **Add the photo to your project folder**:
   - Place your photo file in the same folder as `index.html`

3. **Update the HTML**:
   - Open `index.html` in a text editor
   - Find line ~60 (search for "image-placeholder")
   - Replace this:
   ```html
   <div class="image-placeholder">
       <i class="fas fa-user"></i>
   </div>
   ```
   
   With this:
   ```html
   <div class="image-placeholder">
       <img src="profile.jpg" alt="Benjamin Wakida" 
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
   </div>
   ```

### Step 3: Add Your CV

1. **Prepare your CV**:
   - Export as PDF
   - Name it `Benjamin-Wakida-CV.pdf`
   - Place it in the same folder as `index.html`

2. **Update the download button**:
   - Open `script.js` in a text editor
   - Find line ~100 (search for "downloadCVBtn")
   - Replace the alert with:
   ```javascript
   downloadCVBtn.addEventListener('click', (e) => {
       e.preventDefault();
       window.open('Benjamin-Wakida-CV.pdf', '_blank');
   });
   ```

### Step 4: Update Contact Email

1. Open `script.js`
2. Find line ~70 (search for "mailto:contact@example.com")
3. Replace `contact@example.com` with your actual email

### Step 5: Test Everything

Open `index.html` in your browser and check:
- ✅ Navigation menu works
- ✅ All sections scroll smoothly
- ✅ Your photo appears (if added)
- ✅ Social links open correctly
- ✅ Contact form works
- ✅ Mobile menu works (resize browser)

## 🌐 Publishing Your Website

### Option 1: GitHub Pages (Recommended - Free)

1. **Create a GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/kida256-glitch/portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click Settings → Pages
   - Under "Source", select "main" branch
   - Click Save
   - Your site will be live at: `https://kida256-glitch.github.io/portfolio`

### Option 2: Netlify (Easiest - Free)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Drag and drop your portfolio folder
4. Get instant deployment with custom URL
5. Optional: Add custom domain

### Option 3: Vercel (Fast - Free)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploy with one click
5. Get automatic deployments on every push

## 🎨 Quick Customizations

### Change Colors

Open `styles.css` and modify the color variables (around line 5):

```css
:root {
    --primary-blue: #00d4ff;      /* Main blue color */
    --secondary-blue: #0066ff;    /* Secondary blue */
    --accent-green: #00ff88;      /* Green accent */
}
```

### Add More Projects

1. Open `index.html`
2. Find the Projects section (around line 300)
3. Copy any project card
4. Paste and modify:
   - Project title
   - Description
   - Tech tags
   - GitHub link

### Update Your Bio

1. Open `index.html`
2. Find the About section (around line 100)
3. Edit the paragraphs to match your story

## 📱 Testing on Mobile

1. **Using Chrome DevTools**:
   - Open your site in Chrome
   - Press F12 or right-click → Inspect
   - Click the device icon (top-left)
   - Test different screen sizes

2. **On Your Phone**:
   - If testing locally, use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then visit on your phone: http://YOUR_IP:8000
   ```

## 🐛 Troubleshooting

### Icons Not Showing?
- Check your internet connection (Font Awesome loads from CDN)
- Or download Font Awesome locally

### Animations Not Working?
- Make sure JavaScript is enabled in your browser
- Check browser console for errors (F12)

### Mobile Menu Not Working?
- Clear browser cache
- Check if JavaScript is enabled

### Photo Not Displaying?
- Check file name matches exactly (case-sensitive)
- Ensure photo is in the same folder as index.html
- Try using a different image format

## 💡 Pro Tips

1. **Optimize Your Photo**:
   - Use [TinyPNG](https://tinypng.com) to compress images
   - Keep file size under 500KB for fast loading

2. **Test on Multiple Browsers**:
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

3. **SEO Optimization**:
   - Add meta description in `<head>`:
   ```html
   <meta name="description" content="Benjamin Wakida - Business Computing Student, AWS Leader, Web3 Enthusiast">
   ```

4. **Analytics** (Optional):
   - Add Google Analytics to track visitors
   - Add to `<head>` section of index.html

5. **Custom Domain**:
   - Buy a domain (e.g., benjaminwakida.com)
   - Connect it to GitHub Pages or Netlify

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify all files are in the same folder
3. Make sure you're using a modern browser
4. Try opening in incognito/private mode

## ✅ Launch Checklist

Before going live, verify:
- [ ] Personal photo added
- [ ] CV file added and linked
- [ ] Contact email updated
- [ ] All social links work
- [ ] Projects are accurate
- [ ] Bio is up to date
- [ ] Tested on mobile
- [ ] Tested on desktop
- [ ] All animations work
- [ ] No console errors

## 🎉 You're Ready!

Your portfolio is now ready to showcase your skills and community impact to the world!

**Share your portfolio**:
- Add to LinkedIn profile
- Share on Twitter/X
- Include in email signature
- Add to GitHub profile README
- Share with potential employers

---

**Questions?** Feel free to reach out on any of your social platforms!

Good luck with your tech journey! 🚀
