/**
 * Event gallery: circular 3D showcase + filtered grid (photos.json manifest).
 */
(function () {
    const PHOTO_FOLDER = 'kida101/';
    const PHOTOS_PER_LOAD = 18;
    const FEATURED_COUNT = 12;

    let allPhotos = [];
    let filteredPhotos = [];
    let currentIndex = 0;
    let activeFilter = 'all';
    let rotation = 0;
    let isScrolling = false;
    let scrollTimeout = null;
    let animationFrame = null;

    const circularRoot = document.getElementById('circularGallery');
    const circularStage = document.getElementById('circularGalleryStage');
    const photoGallery = document.getElementById('photoGallery');
    const loadMoreBtn = document.getElementById('loadMorePhotos');
    const filterBar = document.getElementById('galleryFilters');
    const photoCountEl = document.getElementById('galleryPhotoCount');

    function photoUrl(file) {
        return PHOTO_FOLDER + encodeURIComponent(file);
    }

    function dispatchGalleryUpdated() {
        document.dispatchEvent(new CustomEvent('gallery:updated'));
    }

    function getCategories() {
        const categories = new Set(allPhotos.map((p) => p.category));
        return ['all', ...Array.from(categories).sort()];
    }

    function selectFeaturedPhotos() {
        const picked = [];
        const seenCategories = new Set();
        const priorityFiles = [
            'AWSUCU (14 of 193).jpg',
            'Epicshots256-139.jpg',
            '20260411_133021.jpg',
            'IMG_7236.jpg',
            '_MG_7031.jpg',
            '20260418_165716.jpg',
            '20260425_175317.jpg',
            '20260509_142112.jpg',
            '_DSC5805.jpg',
            'Epicshots256-161.jpg',
            '20260228_145525.jpg',
            '20260320_111101.jpg'
        ];

        priorityFiles.forEach((file) => {
            const photo = allPhotos.find((p) => p.file === file);
            if (photo && picked.length < FEATURED_COUNT) {
                picked.push(photo);
                seenCategories.add(photo.category);
            }
        });

        allPhotos.forEach((photo) => {
            if (picked.length >= FEATURED_COUNT) return;
            if (picked.some((p) => p.file === photo.file)) return;
            if (!seenCategories.has(photo.category) || picked.length < 8) {
                picked.push(photo);
                seenCategories.add(photo.category);
            }
        });

        return picked.slice(0, FEATURED_COUNT);
    }

    function buildCircularGallery(items) {
        if (!circularRoot || !circularStage || items.length === 0) return;

        circularStage.innerHTML = '';
        const angleStep = 360 / items.length;
        const radius = window.innerWidth < 768 ? 320 : window.innerWidth < 1024 ? 460 : 580;

        items.forEach((item, index) => {
            const angle = index * angleStep;
            const card = document.createElement('article');
            card.className = 'circular-gallery-card';
            card.setAttribute('role', 'group');
            card.setAttribute('aria-label', item.title);
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            card.dataset.angle = String(angle);

            card.innerHTML = `
                <div class="circular-gallery-card-inner">
                    <img src="${photoUrl(item.file)}" alt="${item.title}" loading="lazy">
                    <div class="circular-gallery-card-caption">
                        <h3>${item.title}</h3>
                        <p>${item.category}</p>
                        <span>Photo by ${item.photographer}</span>
                    </div>
                </div>
            `;

            circularStage.appendChild(card);
        });

        circularRoot.style.setProperty('--gallery-radius', `${radius}px`);
        updateCircularOpacity();
    }

    let scrollBound = false;

    function bindCircularScrollOnce() {
        if (scrollBound) return;
        scrollBound = true;

        const track = document.querySelector('.circular-gallery-scroll-track');
        if (!track) return;

        window.addEventListener('scroll', () => {
            const rect = track.getBoundingClientRect();
            const trackHeight = track.offsetHeight - window.innerHeight;
            if (trackHeight <= 0) return;

            const scrolled = Math.min(Math.max(-rect.top, 0), trackHeight);
            const progress = scrolled / trackHeight;
            rotation = progress * 360;
            isScrolling = true;
            updateCircularTransform();

            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        }, { passive: true });
    }

    function updateCircularTransform() {
        if (!circularStage) return;
        circularStage.style.transform = `rotateY(${rotation}deg)`;
        updateCircularOpacity();
    }

    function updateCircularOpacity() {
        if (!circularStage) return;
        const cards = circularStage.querySelectorAll('.circular-gallery-card');
        const totalRotation = rotation % 360;

        cards.forEach((card) => {
            const itemAngle = Number(card.dataset.angle || 0);
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.35, 1 - normalizedAngle / 180);
            card.style.opacity = String(opacity);
        });
    }

    function startAutoRotate() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        if (window.matchMedia('(max-width: 768px)').matches) return;

        const tick = () => {
            if (!isScrolling) {
                rotation += 0.015;
                updateCircularTransform();
            }
            animationFrame = requestAnimationFrame(tick);
        };

        animationFrame = requestAnimationFrame(tick);
    }

    function renderFilters() {
        if (!filterBar) return;

        filterBar.innerHTML = '';
        getCategories().forEach((category) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `gallery-filter-btn${category === activeFilter ? ' active' : ''}`;
            btn.textContent = category === 'all' ? 'All Photos' : category;
            btn.dataset.filter = category;
            btn.addEventListener('click', () => {
                activeFilter = category;
                currentIndex = 0;
                filterBar.querySelectorAll('.gallery-filter-btn').forEach((b) => {
                    b.classList.toggle('active', b.dataset.filter === category);
                });
                applyFilter();
                if (photoGallery) photoGallery.innerHTML = '';
                loadPhotos(PHOTOS_PER_LOAD);
            });
            filterBar.appendChild(btn);
        });
    }

    function applyFilter() {
        filteredPhotos = activeFilter === 'all'
            ? allPhotos
            : allPhotos.filter((p) => p.category === activeFilter);

        if (photoCountEl) {
            photoCountEl.textContent = `${filteredPhotos.length} photo${filteredPhotos.length === 1 ? '' : 's'}`;
        }
    }

    function loadPhotos(count) {
        if (!photoGallery) return;

        const endIndex = Math.min(currentIndex + count, filteredPhotos.length);

        for (let i = currentIndex; i < endIndex; i++) {
            const photo = filteredPhotos[i];
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.animationDelay = `${(i - currentIndex) * 0.05}s`;

            item.innerHTML = `
                <img src="${photoUrl(photo.file)}" alt="${photo.title}" loading="lazy" decoding="async">
                <div class="gallery-item-overlay">
                    <p class="gallery-item-category">${photo.category}</p>
                    <p class="gallery-item-title">${photo.title}</p>
                </div>
            `;

            photoGallery.appendChild(item);
        }

        currentIndex = endIndex;

        if (loadMoreBtn) {
            loadMoreBtn.classList.toggle('visible', currentIndex < filteredPhotos.length);
        }

        dispatchGalleryUpdated();
    }

    async function initGallery() {
        if (!photoGallery && !circularRoot) return;

        try {
            const response = await fetch('photos.json');
            if (!response.ok) throw new Error('Could not load photos.json');
            const data = await response.json();
            allPhotos = data.photos || [];
        } catch (error) {
            console.error('Gallery manifest failed to load:', error);
            return;
        }

        applyFilter();
        renderFilters();
        buildCircularGallery(selectFeaturedPhotos());
        bindCircularScrollOnce();
        startAutoRotate();
        loadPhotos(PHOTOS_PER_LOAD);

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => loadPhotos(PHOTOS_PER_LOAD));
        }

        window.addEventListener('resize', () => {
            buildCircularGallery(selectFeaturedPhotos());
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }
})();
