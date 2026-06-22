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
        navigator.serviceWorker.register('./sw.js')
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
// Project Card Tilt Effect (desktop only)
// ===================================
const projectCards = document.querySelectorAll('.project-card, .role-card');
const enableCardTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (enableCardTilt) {
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
}

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
                if (text === 'âˆž') return;
                
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
        const icon = link.querySelector('.social-icon-img, i');
        if (!icon) return;
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    link.addEventListener('mouseleave', () => {
        const icon = link.querySelector('.social-icon-img, i');
        if (!icon) return;
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%cðŸ‘‹ Hello, Developer!', 'color: #00d4ff; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to Benjamin Wakida\'s Portfolio', 'color: #00ff88; font-size: 16px;');
console.log('%cInterested in the code? Check out my GitHub: https://github.com/kida256-glitch', 'color: #94a3b8; font-size: 14px;');
console.log('%cLet\'s build something amazing together! ðŸš€', 'color: #00d4ff; font-size: 14px;');

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
    
    // Add click event to gallery items via delegation
    function attachGalleryClickEvents() {
        updateGalleryImages();
    }

    const photoGalleryEl = document.getElementById('photoGallery');
    if (photoGalleryEl) {
        photoGalleryEl.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;
            updateGalleryImages();
            const items = Array.from(document.querySelectorAll('.gallery-item'));
            const index = items.indexOf(item);
            if (index >= 0) openModal(index);
        });
    }

    document.addEventListener('gallery:updated', attachGalleryClickEvents);

    // Initial attachment
    setTimeout(attachGalleryClickEvents, 500);
    
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
