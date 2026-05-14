# 📋 Quick Reference Card

Keep this handy for quick edits and updates!

## 🎨 Color Variables (styles.css, line ~5)

```css
--primary-blue: #00d4ff;      /* Main blue accent */
--secondary-blue: #0066ff;    /* Secondary blue */
--accent-green: #00ff88;      /* Green highlights */
--dark-bg: #0a0e27;          /* Main background */
--text-primary: #ffffff;      /* Main text color */
--text-secondary: #94a3b8;    /* Secondary text */
```

## 📝 Common Edits

### Update Your Name
**File**: `index.html`  
**Line**: ~60  
**Find**: `<h1 class="hero-name">Benjamin Wakida</h1>`

### Update Tagline
**File**: `index.html`  
**Line**: ~61  
**Find**: `<p class="hero-tagline">`

### Update About Me
**File**: `index.html`  
**Line**: ~100-130  
**Section**: `<section id="about">`

### Update Contact Email
**File**: `script.js`  
**Line**: ~70  
**Find**: `mailto:contact@example.com`

### Add Profile Photo
**File**: `index.html`  
**Line**: ~65  
**Replace**: `<div class="image-placeholder">` with `<img src="photo.jpg">`

### Link CV Download
**File**: `script.js`  
**Line**: ~100  
**Find**: `downloadCVBtn.addEventListener`

## 🔗 Social Links (index.html, line ~450)

```html
GitHub: https://github.com/kida256-glitch
LinkedIn: https://www.linkedin.com/in/benjamin-eldon-wakida/
X: https://x.com/kidaeldon
Instagram: https://www.instagram.com/kidaeldon_ug/
TikTok: https://www.tiktok.com/@benjamin.wakida
Bluesky: https://bsky.app
```

## 📦 Project Card Structure

```html
<div class="project-card">
    <div class="project-header">
        <div class="project-icon">
            <i class="fas fa-ICON-NAME"></i>
        </div>
        <div class="project-links">
            <a href="GITHUB_URL" target="_blank">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>
    <h3 class="project-title">PROJECT NAME</h3>
    <p class="project-description">DESCRIPTION</p>
    <div class="project-tech">
        <span class="tech-tag">TECH 1</span>
        <span class="tech-tag">TECH 2</span>
    </div>
</div>
```

## 🎯 Section IDs (for navigation)

```
#home      - Hero section
#about     - About Me
#roles     - Roles & Communities
#skills    - Technical Skills
#projects  - Featured Projects
#impact    - Events & Community Impact
#social    - Social Links
#contact   - Contact Form
```

## 🖼️ Font Awesome Icons

### Common Icons
```
fa-code          - General coding
fa-rocket        - Launch/startup
fa-globe         - Website
fa-mobile-alt    - Mobile app
fa-database      - Database
fa-brain         - AI/ML
fa-cube          - Blockchain
fa-cloud         - Cloud computing
fa-shield-alt    - Security
fa-gamepad       - Gaming
```

### Social Icons
```
fab fa-github
fab fa-linkedin
fab fa-x-twitter
fab fa-instagram
fab fa-tiktok
fab fa-aws
fab fa-python
fab fa-react
fab fa-node-js
```

## 🎨 CSS Classes

### Buttons
```html
<a href="#" class="btn btn-primary">Primary Button</a>
<a href="#" class="btn btn-secondary">Secondary Button</a>
<a href="#" class="btn btn-outline">Outline Button</a>
```

### Cards
```html
<div class="role-card">Role Card</div>
<div class="project-card">Project Card</div>
<div class="impact-card">Impact Card</div>
<div class="skill-category">Skill Category</div>
```

### Text Styles
```html
<h2 class="section-title">Section Title</h2>
<p class="section-subtitle">Section Subtitle</p>
<span class="tech-tag">Tech Tag</span>
<span class="skill-tag">Skill Tag</span>
```

## 📱 Responsive Breakpoints

```css
Desktop:  1200px and above
Tablet:   768px - 1199px
Mobile:   Below 768px
```

## 🚀 Deployment Commands

### GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Local Server (for testing)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```

## 🔧 Browser DevTools Shortcuts

```
F12 or Ctrl+Shift+I  - Open DevTools
Ctrl+Shift+M         - Toggle device toolbar
Ctrl+Shift+C         - Inspect element
Ctrl+R               - Reload page
Ctrl+Shift+R         - Hard reload (clear cache)
```

## 📊 File Sizes (Recommended)

```
Profile Photo:  < 500KB
Project Images: < 300KB each
CV PDF:         < 2MB
Total Page:     < 3MB
```

## 🎯 Quick Fixes

### Fix: Icons not showing
```html
<!-- Check this line is in <head> -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### Fix: Animations not working
```javascript
// Check browser console (F12) for errors
// Ensure script.js is linked before </body>
```

### Fix: Mobile menu not working
```javascript
// Verify hamburger class is correct
// Check for JavaScript errors in console
```

## 📞 Support Resources

- **Font Awesome Icons**: https://fontawesome.com/icons
- **Color Picker**: https://coolors.co/
- **Image Compression**: https://tinypng.com/
- **HTML Validator**: https://validator.w3.org/
- **CSS Validator**: https://jigsaw.w3.org/css-validator/
- **PageSpeed Test**: https://pagespeed.web.dev/

## 💡 Quick Tips

1. **Always backup** before making major changes
2. **Test on mobile** after every significant edit
3. **Clear cache** (Ctrl+Shift+R) if changes don't appear
4. **Use browser DevTools** to debug issues
5. **Compress images** before uploading
6. **Keep it simple** - less is often more
7. **Update regularly** - keep content fresh

## 🎨 Color Scheme Presets

### Preset 1: Ocean Blue
```css
--primary-blue: #0077be;
--secondary-blue: #00a8e8;
--accent-green: #00d9ff;
```

### Preset 2: Neon Cyber
```css
--primary-blue: #00ffff;
--secondary-blue: #ff00ff;
--accent-green: #ffff00;
```

### Preset 3: Forest Green
```css
--primary-blue: #00b894;
--secondary-blue: #00cec9;
--accent-green: #55efc4;
```

### Preset 4: Sunset Orange
```css
--primary-blue: #ff6b6b;
--secondary-blue: #ee5a6f;
--accent-green: #ffd93d;
```

## 📝 Content Templates

### Project Description Template
```
[What it does] + [Problem it solves] + [Key technology/feature]

Example:
"Real-time collaboration platform enabling seamless team communication. 
Built with WebSocket technology for instant updates and featuring 
end-to-end encryption."
```

### Bio Template
```
I'm [Name], a [Role] at [Institution] with a passion for [Interest]. 
My journey in [Field] is driven by [Motivation]. I specialize in 
[Skills] and love [Activities].
```

## 🔍 SEO Checklist

- [ ] Title tag (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Alt text on all images
- [ ] Heading hierarchy (H1 → H2 → H3)
- [ ] Internal links
- [ ] Fast loading speed
- [ ] Mobile-friendly
- [ ] HTTPS enabled

## 📈 Analytics Setup

### Google Analytics
```html
<!-- Add to <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🎯 Performance Tips

1. Compress images with TinyPNG
2. Minify CSS and JavaScript
3. Use lazy loading for images
4. Enable browser caching
5. Use CDN for libraries
6. Optimize font loading
7. Remove unused code

---

## 📌 Bookmark This!

Save this file for quick reference when updating your portfolio.

**Last Updated**: May 2026  
**Version**: 1.0
