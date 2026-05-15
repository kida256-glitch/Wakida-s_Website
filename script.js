// ===================================
// Performance Optimization Module
// ===================================
const performanceOptimizations = {
    // Debounce function for scroll/resize events
    debounce: (fn, delay = 300) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    },
    
    // Throttle function for frequent events
    throttle: (fn, delay = 300) => {
        let lastRun = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastRun >= delay) {
                fn(...args);
                lastRun = now;
            }
        };
    },
    
    // Defer non-critical tasks
    deferTask: (fn) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(fn);
        } else {
            setTimeout(fn, 1);
        }
    },
    
    // Preload images for better performance
    preloadImage: (src) => {
        const img = new Image();
        img.src = src;
    },
    
    // Monitor Core Web Vitals
    monitorPerformance: () => {
        // LCP - Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP observer not supported
            }
            
            // CLS - Cumulative Layout Shift
            try {
                const clsObserver = new PerformanceObserver((entryList) => {
                    let totalCLS = 0;
                    for (const entry of entryList.getEntries()) {
                        totalCLS += entry.value;
                    }
                    console.log('CLS:', totalCLS);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // CLS observer not supported
            }
        }
    }
};

// Initialize performance monitoring
performanceOptimizations.monitorPerformance();

// ===================================
// Service Worker Registration
// ===================================
if ('serviceWorker' in navigator) {
    performanceOptimizations.deferTask(() => {
        navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('Service Worker registered:', reg))
            .catch((err) => console.log('Service Worker registration failed:', err));
    });
}

// ===================================
// Mobile Detection & Optimization
// ===================================
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isTouchDevice = () => {
    return (
        (typeof window !== 'undefined' && window.ontouchstart !== undefined) ||
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
        (typeof navigator !== 'undefined' && navigator.msMaxTouchPoints > 0)
    );
};

// ===================================
// Navigation Menu Toggle
// ===================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }, { passive: true });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, { passive: true });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, { passive: true });
});

// ===================================
// Navbar Scroll Effect (with passive listener for performance)
// ===================================
const navbar = document.querySelector('.navbar');
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// ===================================
// Smooth Scroll for Navigation Links (only for anchor links)
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }, { passive: false });
});

// ===================================
// Scroll Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

// Use simpler observer on mobile
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Don't unobserve on mobile - reduces memory churn
            if (!isMobileDevice()) {
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Only observe elements if not on mobile (for better mobile performance)
const animatedElements = document.querySelectorAll(
    '.role-card, .project-card, .impact-card, .skill-category, .stat-card, .about-text, .contact-item'
);

if (!isMobileDevice()) {
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
} else {
    // On mobile, just make everything visible immediately
    animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

// ===================================
// Contact Form Handling with Formspree
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(contactForm);
        
        try {
            // Send to Formspree
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success!
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--gradient-2)';
                
                alert('Thank you! Your message has been sent successfully to benwaeldon@gmail.com. I will get back to you soon!');
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Error
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed to Send';
            submitBtn.style.background = '#ff4444';
            
            alert('Sorry, there was an error sending your message. Please try emailing me directly at benwaeldon@gmail.com or contact me via WhatsApp.');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// ===================================
// Download CV Button
// ===================================
const downloadCVBtn = document.getElementById('downloadCV');

if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('CV download feature coming soon! Please connect with me on LinkedIn for my latest resume.');
    });
}

// ===================================
// Dynamic Typing Effect for Hero Section
// ===================================
const heroTagline = document.querySelector('.hero-tagline');

if (heroTagline) {
    const taglines = [
        'Business Computing Student | Community Builder | Web3 & Cloud Enthusiast',
        'AWS Student Builder Group Leader | Kahoot Ambassador | UiPath Champion',
        'Blockchain Developer | Tech Community Leader | Innovation Advocate'
    ];

    let taglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeTagline() {
        const currentTagline = taglines[taglineIndex];
        
        if (isDeleting) {
            heroTagline.textContent = currentTagline.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            heroTagline.textContent = currentTagline.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentTagline.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            taglineIndex = (taglineIndex + 1) % taglines.length;
            typingSpeed = 500; // Pause before starting new tagline
        }
        
        setTimeout(typeTagline, typingSpeed);
    }

    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeTagline, 1000);
    });
}

// ===================================
// Parallax Effect for Hero Section
// ===================================
const heroContent = document.querySelector('.hero-content');

if (heroContent) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
    });
}

// ===================================
// Active Navigation Link Highlighting (for single page only)
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    // Only run on pages with multiple sections (single page layout)
    if (sections.length <= 1) return;
    
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

if (sections.length > 1) {
    window.addEventListener('scroll', highlightNavigation);
}

// ===================================
// Project Card Tilt Effect
// ===================================
const projectCards = document.querySelectorAll('.project-card, .role-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// Skill Tags Animation on Hover
// ===================================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===================================
// Stats Counter Animation
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

if (statNumbers.length > 0) {
    function animateStats() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            hasAnimated = true;
            
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                
                // Skip if not a number
                if (text === '∞') return;
                
                const target = parseInt(text);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + '+';
                    }
                };
                
                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    // Also run on page load in case stats are already visible
    animateStats();
}

// ===================================
// Cursor Glow Effect
// ===================================
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

// Add cursor glow styles
const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.6) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    }
    
    @media (min-width: 768px) {
        .cursor-glow {
            display: block;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX - 10 + 'px';
    cursorGlow.style.top = e.clientY - 10 + 'px';
});

// ===================================
// Image Placeholder Click Handler
// ===================================
const imagePlaceholder = document.querySelector('.image-placeholder');

if (imagePlaceholder) {
    imagePlaceholder.addEventListener('click', () => {
        alert('Profile photo coming soon! This is a placeholder for your professional photo.');
    });
}

// ===================================
// Social Links Hover Effect
// ===================================
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        const icon = link.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    link.addEventListener('mouseleave', () => {
        const icon = link.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c👋 Hello, Developer!', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to Benjamin Wakida\'s Portfolio', 'color: #00ff88; font-size: 16px;');
console.log('%cInterested in the code? Check out my GitHub: https://github.com/kida256-glitch', 'color: #94a3b8; font-size: 14px;');
console.log('%cLet\'s build something amazing together! 🚀', 'color: #00d4ff; font-size: 14px;');

// ===================================
// Performance Optimization
// ===================================
// Lazy load images when implemented
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Accessibility Enhancements
// ===================================
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Focus trap for mobile menu
const focusableElements = navMenu.querySelectorAll('a, button');
const firstFocusable = focusableElements[0];
const lastFocusable = focusableElements[focusableElements.length - 1];

navMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }
});

// ===================================
// Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Scroll to Top on Page Refresh
// ===================================
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// ===================================
// Interactive Image Accordion
// ===================================
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        // Remove active class from all items
        accordionItems.forEach(acc => acc.classList.remove('active'));
        // Add active class to hovered item
        item.classList.add('active');
    });
});

// Set default active item (last one)
if (accordionItems.length > 0) {
    accordionItems[accordionItems.length - 1].classList.add('active');
}

// ===================================
// Photo Gallery Dynamic Loading
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const photoGallery = document.getElementById('photoGallery');
    const loadMoreBtn = document.getElementById('loadMorePhotos');

    // Folder path with proper encoding
    const photoFolder = 'kida101/';

    // Array of all photos from kida101 folder
    const allPhotos = [
    '20241204_185815~2.jpg',
    '20250116_133650~2.jpg',
    '20250628_141154.jpg',
    '20250628_183730.jpg',
    '20250628_183842.jpg',
    '20250628_183845.jpg',
    '20251011_175439.jpg',
    '20251011_175446.jpg',
    '20251011_175452.jpg',
    '20251011_175455.jpg',
    '20251011_175505.jpg',
    '20251011_175631.jpg',
    '20251011_175631~2.jpg',
    '20251011_175636.jpg',
    '20251011_175923.jpg',
    '20251018_115758.jpg',
    '20251018_115803.jpg',
    '20251018_115823.jpg',
    '20251018_180346.jpg',
    '20251018_180738.jpg',
    '20251018_180801.jpg',
    '20251018_181343.jpg',
    '20251018_181445.jpg',
    '20251018_181459.jpg',
    '20251018_181544.jpg',
    '20251018_184544~2.jpg',
    '20251018_185037.jpg',
    '20251025_124346.jpg',
    '20251025_124351.jpg',
    '20251025_124537.jpg',
    '20251025_124550.jpg',
    '20251025_124625.jpg',
    '20251025_124633.jpg',
    '20251025_124744.jpg',
    '20251025_124825.jpg',
    '20251025_124829.jpg',
    '20251025_125131.jpg',
    '20251025_125136.jpg',
    '20251025_182218.jpg',
    '20251025_182232.jpg',
    '20251025_182307.jpg',
    '20251025_182321.jpg',
    '20251025_182325.jpg',
    '20251031_104632.jpg',
    '20251031_104641.jpg',
    '20251031_104642.jpg',
    '20251031_105115.jpg',
    '20251031_105130.jpg',
    '20251031_105131(0).jpg',
    '20251031_105131.jpg',
    '20251101_181250.jpg',
    '20251101_181252.jpg',
    '20251101_181300.jpg',
    '20260228_145525.jpg',
    '20260228_145539.jpg',
    '20260228_145639.jpg',
    '20260228_145642.jpg',
    '20260228_145644.jpg',
    '20260228_145648.jpg',
    '20260228_145649.jpg',
    '20260228_175750.jpg',
    '20260228_175751.jpg',
    '20260313_124834.jpg',
    '20260313_124848.jpg',
    '20260320_110838.jpg',
    '20260320_111101.jpg',
    '20260320_111224.jpg',
    '20260320_111231.jpg',
    '20260320_111236.jpg',
    '20260320_111239.jpg',
    '20260320_113623.jpg',
    '20260320_134605.jpg',
    '20260320_134635.jpg',
    '20260320_134708.jpg',
    '20260320_135015.jpg',
    '20260411_133015.jpg',
    '20260411_133019.jpg',
    '20260411_133021.jpg',
    '20260411_133042.jpg',
    '20260411_133046.jpg',
    '20260411_133105(0).jpg',
    '20260411_133105.jpg',
    '20260411_133108.jpg',
    '20260411_133110(0).jpg',
    '20260411_133110.jpg',
    '20260411_134015.jpg',
    '20260411_134306.jpg',
    '20260411_134337.jpg',
    '20260411_134412.jpg',
    '20260411_134417.jpg',
    '20260411_134419.jpg',
    '20260411_134422.jpg',
    '20260411_134501.jpg',
    '20260411_135549(0).jpg',
    '20260411_135621.jpg',
    '20260411_143658.jpg',
    '20260411_145910.jpg',
    '20260411_145937.jpg',
    '20260411_153702.jpg',
    '20260411_153707.jpg',
    '20260411_153714.jpg',
    '20260411_153737.jpg',
    '20260411_153739.jpg',
    '20260411_153742.jpg',
    '20260411_153920.jpg',
    '20260411_153934.jpg',
    '20260411_154053.jpg',
    '20260411_154058.jpg',
    '20260416_124543.jpg',
    '20260416_124557.jpg',
    '20260416_125320.jpg',
    '20260416_125321.jpg',
    '20260416_125338.jpg',
    '20260416_125340.jpg',
    '20260417_171642.jpg',
    '20260417_171643.jpg',
    '20260417_171646.jpg',
    '20260417_171648.jpg',
    '20260417_171709.jpg',
    '20260417_182945.jpg',
    '20260417_182948.jpg',
    '20260417_182950.jpg',
    '20260417_182955.jpg',
    '20260417_183013.jpg',
    '20260417_183016.jpg',
    '20260417_183017.jpg',
    '20260417_183045.jpg',
    '20260417_183050.jpg',
    '20260417_183058.jpg',
    '20260418_114452.jpg',
    '20260418_165633.jpg',
    '20260418_165638.jpg',
    '20260418_165647.jpg',
    '20260418_165655.jpg',
    '20260418_165658.jpg',
    '20260418_165703.jpg',
    '20260418_165712.jpg',
    '20260418_165716.jpg',
    '20260418_165717.jpg',
    '20260418_165734.jpg',
    '20260418_165738.jpg',
    '20260418_165744.jpg',
    '20260418_165753.jpg',
    '20260418_165800.jpg',
    '20260418_165812.jpg',
    '20260418_165814.jpg',
    '20260418_165817.jpg',
    '20260418_165827.jpg',
    '20260418_165829.jpg',
    '20260418_165831.jpg',
    '20260418_165837.jpg',
    '20260418_165839.jpg',
    '20260418_165841.jpg',
    '20260418_165842.jpg',
    '20260418_165845.jpg',
    '20260418_165846.jpg',
    '20260418_165848.jpg',
    '20260418_170048.jpg',
    '20260418_170049.jpg',
    '20260418_170053.jpg',
    '20260418_170055.jpg',
    '20260418_170058.jpg',
    '20260418_170059.jpg',
    '20260418_170101.jpg',
    '20260418_170102.jpg',
    '20260418_170111.jpg',
    '20260418_170113.jpg',
    '20260418_170114.jpg',
    '20260418_170115.jpg',
    '20260418_170116.jpg',
    '20260418_170118.jpg',
    '20260418_170119.jpg',
    '20260418_170120.jpg',
    '20260418_170122.jpg',
    '20260418_170127.jpg',
    '20260418_170128.jpg',
    '20260418_170133.jpg',
    '20260418_170135.jpg',
    '20260418_170136.jpg',
    '20260418_170138.jpg',
    '20260418_172624.jpg',
    '20260418_172631.jpg',
    '20260418_180757.jpg',
    '20260418_184504.jpg',
    '20260418_184511.jpg',
    '20260418_184517.jpg',
    '20260418_184521.jpg',
    '20260419_152953.jpg',
    '20260419_152959.jpg',
    '20260419_153002.jpg',
    '20260419_153005.jpg',
    '20260419_153006.jpg',
    '20260425_155752.jpg',
    '20260425_155806.jpg',
    '20260425_155810.jpg',
    '20260425_155811.jpg',
    '20260425_155816.jpg',
    '20260425_155825.jpg',
    '20260425_155827.jpg',
    '20260425_155901.jpg',
    '20260425_155904.jpg',
    '20260425_155909.jpg',
    '20260425_155911.jpg',
    '20260425_155921.jpg',
    '20260425_155923.jpg',
    '20260425_174237.jpg',
    '20260425_174239.jpg',
    '20260425_174603.jpg',
    '20260425_175317.jpg',
    '20260425_175318.jpg',
    '20260425_175337.jpg',
    '20260425_175356.jpg',
    '20260425_175423.jpg',
    '20260425_175429.jpg',
    '20260425_175432.jpg',
    '20260425_175913.jpg',
    '20260425_175918.jpg',
    '20260425_175929.jpg',
    '20260425_175931.jpg',
    '20260425_175938.jpg',
    '20260425_193114.jpg',
    '20260425_193121.jpg',
    '20260425_200018.jpg',
    '20260425_200019(0).jpg',
    '20260425_200035.jpg',
    '20260425_200048.jpg',
    '20260425_200100.jpg',
    '20260430_135006.jpg',
    '20260430_135115.jpg',
    '20260505_105737.jpg',
    '20260505_105751.jpg',
    '20260505_145452.jpg',
    '20260505_145518.jpg',
    '20260505_145533.jpg',
    '20260505_145536.jpg',
    '20260505_145538.jpg',
    '20260508_120811.jpg',
    '20260508_131305.jpg',
    '20260508_140722.jpg',
    '20260508_140729.jpg',
    '20260508_140751.jpg',
    '20260508_140811.jpg',
    '20260508_140904.jpg',
    '20260509_122744.jpg',
    '20260509_122755.jpg',
    '20260509_122757.jpg',
    '20260509_122803.jpg',
    '20260509_122804.jpg',
    '20260509_122824.jpg',
    '20260509_122830.jpg',
    '20260509_122858.jpg',
    '20260509_122900.jpg',
    '20260509_122902.jpg',
    '20260509_122904.jpg',
    '20260509_142112.jpg',
    '20260509_142119.jpg',
    '20260509_142120.jpg',
    '20260509_142147.jpg',
    '20260509_142148.jpg',
    '20260509_142149.jpg',
    '20260509_142156.jpg',
    '20260509_142157.jpg',
    '20260509_142207.jpg',
    '20260509_142210.jpg',
    '20260509_142213.jpg',
    '20260509_142238.jpg',
    '20260509_142239.jpg',
    '20260509_142241.jpg',
    '20260509_142242.jpg',
    'AWSUCU (138 of 193).jpg',
    'AWSUCU (14 of 193).jpg',
    'AWSUCU (140 of 193).jpg',
    'AWSUCU (18 of 193).jpg',
    'AWSUCU (19 of 193).jpg',
    'AWSUCU (194 of 193).jpg',
    'AWSUCU (62 of 193).jpg',
    'AWSUCU (85 of 193).jpg',
    'AWSUCU (86 of 193).jpg',
    'AWSUCU (89 of 193).jpg',
    'AWSUCU (90 of 193).jpg',
    'AWSUCU (98 of 193).jpg',
    'Epicshots256-139.jpg',
    'Epicshots256-161.jpg',
    'IMG-20250410-WA0053.jpg',
    'IMG-20250630-WA0022.jpg',
    'IMG-20250630-WA0023.jpg',
    'IMG-20250630-WA0025.jpg',
    'IMG-20250630-WA0026.jpg',
    'IMG-20250630-WA0027.jpg',
    'IMG-20251019-WA0132.jpg',
    'IMG-20251019-WA0134.jpg',
    'IMG-20251019-WA0136.jpg',
    'IMG_0035.HEIC.heif',
    'IMG_0036.HEIC.heif',
    'IMG_0037.HEIC.heif',
    'IMG_0038.HEIC.heif',
    'IMG_0039.HEIC.heif',
    'IMG_0210.HEIC.heif',
    'IMG_0211.HEIC.heif',
    'IMG_0212.HEIC.heif',
    'IMG_0213.HEIC.heif',
    'IMG_0214.HEIC.heif',
    'IMG_0215.HEIC.heif',
    'IMG_0226.HEIC.heif',
    'IMG_0237.HEIC.heif',
    'IMG_0255.HEIC.heif',
    'IMG_0362.HEIC.heif',
    'IMG_0507.HEIC.heif',
    'IMG_0518.HEIC.heif',
    'IMG_0838.HEIC.heif',
    'IMG_0839.HEIC.heif',
    'IMG_0840.HEIC.heif',
    'IMG_0841.HEIC.heif',
    'IMG_0842.HEIC.heif',
    'IMG_0850.HEIC.heif',
    'IMG_0921.jpg',
    'IMG_1003.jpg',
    'IMG_1004.jpg',
    'IMG_7236.jpg',
    'IMG_7300.jpg',
    'IMG_7401.jpg',
    'IMG_7403.jpg',
    'IMG_7405.jpg',
    'IMG_7408.jpg',
    'Snapchat-1866268840.jpg',
    '_DSC5805.jpg',
    '_DSC5806.jpg',
    '_DSC6316.jpg',
    '_DSC6317.jpg',
    '_MG_6800.jpg',
    '_MG_7031.jpg',
    '_MG_7033.jpg',
    '_MG_7036.jpg',
    '_MG_7037.jpg',
    '_MG_7038.jpg',
    '_MG_7040.jpg',
    '_MG_7041.jpg',
    '_MG_7050.jpg',
    '_MG_7057.jpg',
    '_MG_7061.jpg',
    'doodles-ai-1773816765606.jpg',
    'file_00000000eccc622f89485eefcb3b20dd_conversation_id=67f8be79-9a14-8002-a9b5-220272ba8c24&message_id=b51fa56e-418f-4b62-b002-c198c4c10683.jpg',
    'file_00000000f89061f78906d6c065990a59_conversation_id=67f756c9-e308-8002-a3c2-b2ab6bc303fe&message_id=31678d4a-0117-4a97-86c8-b7527bd116c4.jpg'
];

let currentPhotoIndex = 0;
const photosPerLoad = 12;

function loadPhotos(count) {
    const endIndex = Math.min(currentPhotoIndex + count, allPhotos.length);
    
    console.log(`Loading photos from ${currentPhotoIndex} to ${endIndex}`);
    
    for (let i = currentPhotoIndex; i < endIndex; i++) {
        const photoItem = document.createElement('div');
        photoItem.className = 'gallery-item';
        photoItem.style.animationDelay = `${(i - currentPhotoIndex) * 0.1}s`;
        
        const img = document.createElement('img');
        // Use encodeURIComponent for the filename to handle special characters
        img.src = photoFolder + encodeURIComponent(allPhotos[i]);
        img.alt = `Event photo ${i + 1}`;
        img.loading = 'lazy';
        
        console.log(`Loading image ${i + 1}:`, img.src);
        
        // Error handling for images that fail to load
        img.onerror = function() {
            console.error('Failed to load:', this.src);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23333" width="400" height="500"/%3E%3Ctext fill="%2300d4ff" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E';
        };
        
        img.onload = function() {
            console.log('Successfully loaded:', this.src);
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';
        
        const title = document.createElement('p');
        title.className = 'gallery-item-title';
        title.textContent = `Event Memory ${i + 1}`;
        
        overlay.appendChild(title);
        photoItem.appendChild(img);
        photoItem.appendChild(overlay);
        photoGallery.appendChild(photoItem);
    }
    
    currentPhotoIndex = endIndex;
    
    console.log(`Current index: ${currentPhotoIndex}, Total photos: ${allPhotos.length}`);
    
    // Show/hide load more button
    if (currentPhotoIndex >= allPhotos.length) {
        loadMoreBtn.classList.remove('visible');
        console.log('All photos loaded, hiding button');
    } else {
        loadMoreBtn.classList.add('visible');
        console.log('More photos available, showing button');
    }
}

// Load initial photos
if (photoGallery) {
    console.log('Photo gallery found, loading photos...');
    console.log('Total photos available:', allPhotos.length);
    console.log('Photos per load:', photosPerLoad);
    loadPhotos(photosPerLoad);
    
    // Show the load more button initially if there are more photos
    if (allPhotos.length > photosPerLoad && loadMoreBtn) {
        loadMoreBtn.classList.add('visible');
        console.log('Load more button shown');
    }
} else {
    console.error('Photo gallery element not found!');
}

// Load more button handler
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadPhotos(photosPerLoad);
    });
}

}); // End DOMContentLoaded

// ===================================
// Photo Gallery Interactions (Legacy - Removed)
// ===================================
// Old draggable photo card code removed - now using grid gallery

// View All Stories Button (Legacy - Removed)
// Replaced with Load More functionality

// ===================================
// Scroll to Top Button
// ===================================
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });
}

// ===================================
// Footer Social Links Animation
// ===================================
const footerSocialLinks = document.querySelectorAll('.footer-social-link');

footerSocialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-5px) rotate(5deg) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) rotate(0deg) scale(1)';
    });
});


// ===================================
// Image Modal/Lightbox System
// ===================================
class ImageModal {
    constructor() {
        this.modal = null;
        this.currentImageIndex = 0;
        this.images = [];
        this.currentImageSrc = null;
        this.init();
    }

    init() {
        // Create modal HTML
        const modalHTML = `
            <div class="image-modal" id="imageModal">
                <button class="image-modal-close" id="modalClose" aria-label="Close image">&times;</button>
                <button class="image-modal-nav image-modal-prev" id="modalPrev" aria-label="Previous image">&#10094;</button>
                <div class="image-modal-content">
                    <img class="image-modal-img" id="modalImage" src="" alt="Full size image">
                </div>
                <button class="image-modal-nav image-modal-next" id="modalNext" aria-label="Next image">&#10095;</button>
                <div class="image-modal-counter" id="modalCounter"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', modalHTML);
        
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.closeBtn = document.getElementById('modalClose');
        this.prevBtn = document.getElementById('modalPrev');
        this.nextBtn = document.getElementById('modalNext');
        this.counter = document.getElementById('modalCounter');
        
        // Event listeners
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.prevBtn.addEventListener('click', () => this.showPrevious());
        this.nextBtn.addEventListener('click', () => this.showNext());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.showPrevious();
            if (e.key === 'ArrowRight') this.showNext();
        });
        
        // Touch support for swipe
        let touchStartX = 0;
        this.modal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        this.modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) this.showNext();
            if (touchEndX - touchStartX > 50) this.showPrevious();
        });
        
        this.attachToImages();
    }

    attachToImages() {
        // Find all images to attach click handlers
        const clickableImages = document.querySelectorAll('.gallery-item img, .profile-image, img[data-modal-enable]');
        
        clickableImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collectImages();
                
                // Find current image index in the collected images array
                this.currentImageIndex = this.images.findIndex(item => item.src === img.src);
                if (this.currentImageIndex === -1) {
                    // Fallback to the clicked image if not found
                    this.currentImageIndex = 0;
                }
                this.openModal(img.src, img.alt);
            });
        });
    }

    collectImages() {
        // Collect all images that should be in the gallery
        const clickableImages = document.querySelectorAll('.gallery-item img, .profile-image, img[data-modal-enable]');
        this.images = Array.from(clickableImages).map(img => ({
            src: img.src,
            alt: img.alt || 'Image'
        }));
    }

    openModal(src, alt) {
        this.currentImageSrc = src;
        this.modalImage.src = src;
        this.modalImage.alt = alt;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateCounter();
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    showNext() {
        if (this.images.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        const nextImage = this.images[this.currentImageIndex];
        this.modalImage.src = nextImage.src;
        this.modalImage.alt = nextImage.alt;
        this.updateCounter();
    }

    showPrevious() {
        if (this.images.length === 0) return;
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        const prevImage = this.images[this.currentImageIndex];
        this.modalImage.src = prevImage.src;
        this.modalImage.alt = prevImage.alt;
        this.updateCounter();
    }

    updateCounter() {
        if (this.images.length > 1) {
            this.counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
            this.counter.style.display = 'block';
        } else {
            this.counter.style.display = 'none';
        }
    }
}

// ===================================
// Image Swiper Component (Vanilla JS)
// ===================================
class ImageSwiper {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.cardWidth = options.cardWidth || 280;
        this.cardHeight = options.cardHeight || 380;
        this.cardSpacing = options.cardSpacing || 12;
        
        // Get images and labels from data attributes
        const imagesStr = this.container.getAttribute('data-images') || '';
        const labelsStr = this.container.getAttribute('data-labels') || '';
        
        this.images = imagesStr.split(',').map(img => img.trim()).filter(img => img);
        this.labels = labelsStr.split(',').map(label => label.trim()).filter(label => label);
        
        this.cardOrder = Array.from({ length: this.images.length }, (_, i) => i);
        this.isSwiping = false;
        this.startX = 0;
        this.currentX = 0;
        this.animationFrameId = null;
        
        this.init();
    }
    
    init() {
        this.renderCards();
        this.attachEventListeners();
    }
    
    renderCards() {
        // Clear existing cards
        this.container.innerHTML = '';
        
        // Create cards based on current order
        this.cardOrder.forEach((originalIndex, displayIndex) => {
            const card = document.createElement('article');
            card.className = 'swiper-card';
            card.dataset.index = displayIndex;
            
            const zIndex = this.images.length - displayIndex;
            const offsetY = displayIndex * this.cardSpacing;
            
            card.style.cssText = `
                z-index: ${zIndex};
                transform: translateY(${offsetY}px) scale(${1 - displayIndex * 0.05});
                opacity: ${displayIndex === 0 ? 1 : 0.7};
            `;
            
            card.innerHTML = `
                <img src="${this.images[originalIndex]}" alt="${this.labels[originalIndex] || 'Event image'}" loading="lazy">
                <div class="swiper-card-label">${this.labels[originalIndex] || ''}</div>
            `;
            
            this.container.appendChild(card);
        });
    }
    
    attachEventListeners() {
        this.container.addEventListener('pointerdown', (e) => this.handleStart(e));
        this.container.addEventListener('pointermove', (e) => this.handleMove(e));
        this.container.addEventListener('pointerup', (e) => this.handleEnd(e));
        this.container.addEventListener('pointercancel', (e) => this.handleEnd(e));
    }
    
    handleStart(e) {
        if (this.isSwiping) return;
        this.isSwiping = true;
        this.startX = e.clientX;
        this.currentX = e.clientX;
    }
    
    handleMove(e) {
        if (!this.isSwiping) return;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            this.currentX = e.clientX;
            const deltaX = this.currentX - this.startX;
            this.applySwipeStyles(deltaX);
            
            // Auto-complete swipe if threshold exceeded
            if (Math.abs(deltaX) > 100) {
                this.handleEnd(e);
            }
        });
    }
    
    handleEnd(e) {
        if (!this.isSwiping) return;
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        const deltaX = this.currentX - this.startX;
        const threshold = 50;
        
        if (Math.abs(deltaX) > threshold) {
            // Swipe completed - rotate cards
            setTimeout(() => {
                this.rotateCards(deltaX > 0);
            }, 150);
        } else {
            // Swipe cancelled - reset
            this.resetCards();
        }
        
        this.isSwiping = false;
        this.startX = 0;
        this.currentX = 0;
    }
    
    applySwipeStyles(deltaX) {
        const cards = this.container.querySelectorAll('.swiper-card');
        const activeCard = cards[0];
        
        if (!activeCard) return;
        
        // Calculate rotation based on delta
        const rotation = (deltaX / 100) * 20;
        const scale = 1 - (Math.abs(deltaX) / 300) * 0.05;
        const opacity = 1 - (Math.abs(deltaX) / 200) * 0.5;
        
        activeCard.style.transform = `translateX(${deltaX}px) rotateZ(${rotation}deg) scale(${Math.max(0.8, scale)})`;
        activeCard.style.opacity = Math.max(0.3, opacity);
    }
    
    resetCards() {
        const cards = this.container.querySelectorAll('.swiper-card');
        cards.forEach((card, i) => {
            const offsetY = i * this.cardSpacing;
            card.style.transform = `translateY(${offsetY}px) scale(${1 - i * 0.05})`;
            card.style.opacity = i === 0 ? 1 : 0.7;
        });
    }
    
    rotateCards(isNext) {
        // Animate out the front card
        const cards = this.container.querySelectorAll('.swiper-card');
        const activeCard = cards[0];
        
        if (activeCard) {
            const direction = isNext ? 1 : -1;
            activeCard.style.transform = `translateX(${direction * 400}px) rotateZ(${direction * 20}deg)`;
            activeCard.style.opacity = '0';
        }
        
        // Update order after animation
        setTimeout(() => {
            if (isNext) {
                this.cardOrder.push(this.cardOrder.shift());
            } else {
                this.cardOrder.unshift(this.cardOrder.pop());
            }
            this.renderCards();
        }, 300);
    }
}

// Initialize swiper when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ImageSwiper('eventSwiper');
        const imageModal = new ImageModal();
    });
} else {
    new ImageSwiper('eventSwiper');
    const imageModal = new ImageModal();
}


// ===================================
// Image Modal/Lightbox Functionality
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];
    
    // Function to update gallery images array
    function updateGalleryImages() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    }
    
    // Function to open modal
    function openModal(index) {
        if (!modal || galleryImages.length === 0) return;
        
        currentImageIndex = index;
        const img = galleryImages[currentImageIndex];
        
        modal.classList.add('active');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalCaption.textContent = img.alt || `Event Memory ${currentImageIndex + 1}`;
        modalCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close modal
    function closeModal() {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Function to show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openModal(currentImageIndex);
    }
    
    // Function to show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openModal(currentImageIndex);
    }
    
    // Add click event to gallery items
    function attachGalleryClickEvents() {
        updateGalleryImages();
        
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                openModal(index);
            });
        });
    }
    
    // Initial attachment
    setTimeout(attachGalleryClickEvents, 500);
    
    // Re-attach when new photos are loaded
    const loadMoreBtn = document.getElementById('loadMorePhotos');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            setTimeout(attachGalleryClickEvents, 500);
        });
    }
    
    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevImage();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
    }
    
    // Click outside image to close
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal || !modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (modal) {
        modal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - show next
                showNextImage();
            } else {
                // Swiped right - show previous
                showPrevImage();
            }
        }
    }
});
