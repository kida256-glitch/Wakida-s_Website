# Benjamin Wakida - Personal Portfolio Website

A modern, futuristic, and highly interactive portfolio website showcasing Benjamin Wakida's journey as a Business Computing student, community builder, and tech enthusiast.

## 🌟 Features

### Design & Aesthetics
- **Premium Dark Theme**: Sleek dark background with blue, black, and green color scheme
- **Glassmorphism Effects**: Modern frosted glass card designs with backdrop blur
- **Smooth Animations**: Scroll-triggered animations, floating elements, and hover effects
- **Gradient Accents**: Eye-catching gradient borders and text effects
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices

### Interactive Elements
- **Dynamic Typing Effect**: Rotating taglines in the hero section
- **3D Card Tilt**: Project and role cards respond to mouse movement
- **Parallax Scrolling**: Smooth depth effect on scroll
- **Cursor Glow**: Custom cursor effect for desktop users
- **Animated Statistics**: Counter animation when scrolling to stats section
- **Smooth Navigation**: Scroll spy with active link highlighting

### Sections
1. **Hero Section**: Eye-catching introduction with floating image placeholder and call-to-action buttons
2. **About Me**: Comprehensive background with animated statistics
3. **Roles & Communities**: Showcase of leadership positions and community involvement
4. **Skills**: Categorized technical skills with interactive tags
5. **Projects**: Real GitHub projects with descriptions and tech stacks
6. **Events & Community Impact**: Highlighting community building efforts
7. **Social Links**: All social media profiles in one place
8. **Contact**: Contact form and location information

## 🚀 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Advanced styling with CSS Grid, Flexbox, animations, and custom properties
- **JavaScript (Vanilla)**: Interactive features without dependencies
- **Font Awesome**: Icon library for social links and UI elements

## 📁 File Structure

```
portfolio/
│
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # Interactive functionality
└── README.md          # Documentation (this file)
```

## 🎨 Color Palette

```css
Primary Blue:    #00d4ff
Secondary Blue:  #0066ff
Accent Green:    #00ff88
Dark Background: #0a0e27
Darker BG:       #050814
Card Background: rgba(15, 23, 42, 0.6)
Text Primary:    #ffffff
Text Secondary:  #94a3b8
```

## 🛠️ Customization Guide

### Adding Your Profile Photo

Replace the image placeholder in the hero section:

```html
<!-- Find this in index.html -->
<div class="image-placeholder">
    <i class="fas fa-user"></i>
</div>

<!-- Replace with -->
<img src="your-photo.jpg" alt="Benjamin Wakida" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">
```

### Updating Projects

Projects are pulled from your GitHub profile. To add more or modify:

1. Locate the projects section in `index.html`
2. Copy a project card template
3. Update the title, description, tech tags, and GitHub link

```html
<div class="project-card">
    <div class="project-header">
        <div class="project-icon">
            <i class="fas fa-your-icon"></i>
        </div>
        <div class="project-links">
            <a href="YOUR_GITHUB_LINK" target="_blank" class="project-link">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>
    <h3 class="project-title">Your Project Name</h3>
    <p class="project-description">Your project description</p>
    <div class="project-tech">
        <span class="tech-tag">Tech 1</span>
        <span class="tech-tag">Tech 2</span>
    </div>
</div>
```

### Updating Contact Information

Modify the contact form email in `script.js`:

```javascript
// Find this line
const mailtoLink = `mailto:contact@example.com?subject=...`;

// Replace with your email
const mailtoLink = `mailto:your.email@example.com?subject=...`;
```

### Adding Your CV

1. Add your CV file to the project folder (e.g., `benjamin-wakida-cv.pdf`)
2. Update the download button in `script.js`:

```javascript
downloadCVBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('benjamin-wakida-cv.pdf', '_blank');
});
```

### Modifying Colors

All colors are defined as CSS variables in `styles.css`:

```css
:root {
    --primary-blue: #00d4ff;    /* Change to your preferred blue */
    --accent-green: #00ff88;    /* Change to your preferred green */
    /* ... other colors */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ⚡ Performance Optimizations

- Intersection Observer for scroll animations
- CSS transforms for smooth animations (GPU-accelerated)
- Lazy loading support for images
- Minimal JavaScript dependencies
- Optimized CSS with reusable classes

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### GitHub Pages

1. Create a new repository on GitHub
2. Push these files to the repository
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify

1. Drag and drop the folder to Netlify
2. Your site will be live instantly with a custom URL

### Vercel

1. Import the GitHub repository
2. Deploy with one click
3. Get automatic deployments on every push

## 📝 Real Projects Included

Based on your GitHub profile (https://github.com/kida256-glitch):

1. **Gas-Chain** - Blockchain-based gas supply chain management (TypeScript)
2. **AirQo Pollution Tracker** - Environmental monitoring application (TypeScript)
3. **Unlock Protocol Delegation App** - Web3 access control system (TypeScript)
4. **Blockchain Project** - Foundational blockchain implementation
5. **Machine Learning** - ML experiments and models (Python, Jupyter)
6. **Learning Django** - Web development with Django (Python)

## 🎯 Key Features for Recruiters

- Clear presentation of technical skills
- Real project portfolio with GitHub links
- Leadership roles and community impact
- Professional contact information
- Downloadable CV option
- Active social media presence

## 🤝 Community Leadership Roles

- **Kahoot Ambassador** - Interactive learning champion
- **AWS Student Builder Group Leader** - Cloud computing at MUBS
- **UiPath Student Developer Champion** - Automation advocate
- **Web3 & Blockchain Enthusiast** - Decentralized tech explorer
- **Community Builder** - Tech community organizer
- **Business Computing Student** - MUBS student

## 📧 Contact & Social Links

- **GitHub**: https://github.com/kida256-glitch
- **LinkedIn**: https://www.linkedin.com/in/benjamin-eldon-wakida/
- **X (Twitter)**: https://x.com/kidaeldon
- **Instagram**: https://www.instagram.com/kidaeldon_ug/
- **TikTok**: https://www.tiktok.com/@benjamin.wakida
- **Bluesky**: https://bsky.app

## 🎨 Design Philosophy

This portfolio is designed to:
- Reflect your identity as a tech leader from Uganda
- Showcase both technical skills and community impact
- Feel modern, futuristic, and professional
- Stand out from generic templates
- Be authentic and personal
- Demonstrate your passion for technology and community

## 🔧 Future Enhancements

Consider adding:
- Blog section for tech articles
- Testimonials from community members
- Event gallery with photos
- Newsletter signup
- Dark/light theme toggle
- More interactive animations
- Backend integration for contact form

## 📄 License

This portfolio is created for Benjamin Wakida. Feel free to use it as inspiration, but please create your own unique version.

## 🙏 Credits

- **Design & Development**: Custom-built for Benjamin Wakida
- **Icons**: Font Awesome
- **Fonts**: System fonts for optimal performance
- **Inspiration**: Modern tech portfolios and futuristic design trends

---

**Built with passion for technology and community | Uganda 🇺🇬**

*Last Updated: May 2026*
