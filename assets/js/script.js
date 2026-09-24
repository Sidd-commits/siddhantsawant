/**
 * Siddhant Sawant - Modern Portfolio Web Application Scripts
 * Features: Lenis Smooth Scroll Engine, Typewriter, Scroll Spy, Mobile Drawer,
 * Project Filters, Skill Gauges, 3D Card Tilt, Timeline Animator, Async Formspree Handler
 */

let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initSmoothScroll();
    initTypewriter();
    initNavbar();
    initProjectFilters();
    initSkillsMarquee();
    initEducationTimeline();
    init3DCardTilt();
    initContactForm();
    initBackToTop();
});

/* ==========================================================================
   1. Lenis Butter-Smooth Scroll Engine & Scroll Progress
   ========================================================================== */
function initSmoothScroll() {
    const scrollProgressBar = document.getElementById('scrollProgressBar');

    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.2,
            infinite: false
        });

        // Continuous high-performance RAF loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Track Lenis scroll event
        lenis.on('scroll', (e) => {
            // Update top reading progress bar
            if (scrollProgressBar) {
                const progress = Math.max(0, Math.min(1, e.progress || (e.scroll / e.limit) || 0));
                scrollProgressBar.style.width = `${(progress * 100).toFixed(2)}%`;
            }

            // Update navbar state
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (e.scroll > 40) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Update back to top button
            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                if (e.scroll > 400) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            }

            // Update active navigation link
            updateActiveNavLink(e.scroll);

            // Update education timeline progress
            updateTimelineProgress(e.scroll);
        });
    } else {
        // Fallback if Lenis is not available
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollProgressBar && docHeight > 0) {
                scrollProgressBar.style.width = `${(scrollY / docHeight * 100).toFixed(2)}%`;
            }

            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (scrollY > 40) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }

            const backToTopBtn = document.getElementById('backToTop');
            if (backToTopBtn) {
                if (scrollY > 400) backToTopBtn.classList.add('show');
                else backToTopBtn.classList.remove('show');
            }

            updateActiveNavLink(scrollY);
            updateTimelineProgress(scrollY);
        }, { passive: true });
    }

    // Intercept all internal anchor link clicks for buttery smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || !href) return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();

                // Close mobile menu drawer if open
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.getElementById('hamburger-menu');
                const navBackdrop = document.getElementById('nav-backdrop');
                if (navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    if (hamburger) hamburger.classList.remove('active');
                    if (navBackdrop) navBackdrop.classList.remove('show');
                    document.body.style.overflow = '';
                }

                if (lenis) {
                    lenis.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.3,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });
}

/* ==========================================================================
   2. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'Full-Stack Developer',
        'Machine Learning Enthusiast',
        'Computer Engineering Student',
        'Problem Solver & Builder',
        'Python & Java Developer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at end of word
            typingSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   3. Navbar Scroll Spy & Mobile Menu
   ========================================================================== */
function initNavbar() {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.getElementById('nav-backdrop');

    // Toggle Mobile Drawer
    function toggleMenu() {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        navBackdrop.classList.toggle('show');
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        navBackdrop.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });
}

// Optimized Scroll Spy
function updateActiveNavLink(currentScrollY) {
    const scrollPosition = (typeof currentScrollY === 'number' ? currentScrollY : window.scrollY) + 140;
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   4. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filterValue = tab.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            // If Lenis is active, notify resize
            if (lenis) {
                setTimeout(() => lenis.resize(), 320);
            }
        });
    });
}

/* ==========================================================================
   5. Interactive Skills & Technologies Marquee
   ========================================================================== */
function initSkillsMarquee() {
    const marqueeRows = document.querySelectorAll('.marquee-row');
    if (!marqueeRows.length) return;

    // Optional touch pause & smooth hover handling for mobile and desktop
    marqueeRows.forEach(row => {
        const track = row.querySelector('.marquee-track');
        if (!track) return;

        row.addEventListener('touchstart', () => {
            track.style.animationPlayState = 'paused';
        }, { passive: true });

        row.addEventListener('touchend', () => {
            track.style.animationPlayState = 'running';
        }, { passive: true });
    });
}

/* ==========================================================================
   7. Education Timeline Scroll Tracker
   ========================================================================== */
function initEducationTimeline() {
    const timelineItems = document.querySelectorAll('.edu-timeline-item');
    if (!timelineItems.length) return;

    // Fade-in timeline milestone items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    timelineItems.forEach(item => observer.observe(item));

    // Calculate initial layout & progress
    updateTimelineLayout();
    updateTimelineProgress();

    // Recalculate on window resize and image/font load
    window.addEventListener('resize', () => {
        updateTimelineLayout();
        updateTimelineProgress();
    }, { passive: true });

    window.addEventListener('load', () => {
        updateTimelineLayout();
        updateTimelineProgress();
    });
}

// Dynamically align track to connect from center of first milestone to center of last milestone
function updateTimelineLayout() {
    const container = document.querySelector('.edu-timeline-container');
    const track = document.querySelector('.edu-timeline-track');
    const items = document.querySelectorAll('.edu-timeline-item');
    if (!container || !track || items.length < 2) return;

    const firstMarker = items[0].querySelector('.edu-marker-circle');
    const lastMarker = items[items.length - 1].querySelector('.edu-marker-circle');
    if (!firstMarker || !lastMarker) return;

    const containerRect = container.getBoundingClientRect();
    const firstRect = firstMarker.getBoundingClientRect();
    const lastRect = lastMarker.getBoundingClientRect();

    const firstCenterY = (firstRect.top + firstRect.height / 2) - containerRect.top;
    const lastCenterY = (lastRect.top + lastRect.height / 2) - containerRect.top;
    const firstCenterX = (firstRect.left + firstRect.width / 2) - containerRect.left;

    track.style.top = `${Math.round(firstCenterY)}px`;
    track.style.height = `${Math.round(lastCenterY - firstCenterY)}px`;
    track.style.left = `${Math.round(firstCenterX)}px`;
}

// Dynamic progress bar height tracking from first marker (0%) to last milestone marker (100%)
function updateTimelineProgress() {
    const progressBar = document.querySelector('.edu-timeline-progress-bar');
    const items = document.querySelectorAll('.edu-timeline-item');
    if (!progressBar || items.length < 2) return;

    const firstMarker = items[0].querySelector('.edu-marker-circle');
    const lastMarker = items[items.length - 1].querySelector('.edu-marker-circle');
    if (!firstMarker || !lastMarker) return;

    const firstRect = firstMarker.getBoundingClientRect();
    const lastRect = lastMarker.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Focal tracking point in the viewport (~55% down the screen where the reader looks)
    const focalPoint = windowHeight * 0.55;

    const startY = firstRect.top + firstRect.height / 2;
    const endY = lastRect.top + lastRect.height / 2;
    const totalDistance = endY - startY;

    if (totalDistance <= 0) return;

    const currentDistance = focalPoint - startY;
    let percent = (currentDistance / totalDistance) * 100;
    percent = Math.max(0, Math.min(100, percent));

    progressBar.style.height = `${percent.toFixed(2)}%`;

    if (percent > 0 && percent < 100) {
        progressBar.classList.add('active');
    } else {
        progressBar.classList.remove('active');
    }
}

/* ==========================================================================
   8. 3D Card Parallax Tilt Effect
   ========================================================================== */
function init3DCardTilt() {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('[data-tilt], .exp-card, .cert-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((centerY - y) / centerY) * 7;
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

/* ==========================================================================
   9. Contact Form Asynchronous Handler (Formspree)
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function clearErrors() {
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (messageError) messageError.textContent = '';
        formStatus.className = 'form-status-alert';
        formStatus.textContent = '';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your name.';
            isValid = false;
        }

        if (!emailInput.value.trim()) {
            emailError.textContent = 'Please enter your email address.';
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please provide a valid email address.';
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            messageError.textContent = 'Please write a brief message.';
            isValid = false;
        }

        if (!isValid) return;

        // Sending state
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>Sending Message...</span>`;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = "Thank you! Your message has been sent successfully. I'll get back to you shortly.";
                formStatus.className = 'form-status-alert success show';
                form.reset();
            } else {
                const data = await response.json().catch(() => null);
                if (data && data.errors) {
                    formStatus.textContent = data.errors.map(err => err.message).join(', ');
                } else {
                    formStatus.textContent = "Something went wrong sending the message. Please feel free to email me directly at siddhantsawant8222@gmail.com";
                }
                formStatus.className = 'form-status-alert error show';
            }
        } catch (error) {
            formStatus.textContent = "Network error. Please email me directly at siddhantsawant8222@gmail.com or call +91 7045931324.";
            formStatus.className = 'form-status-alert error show';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });
}

/* ==========================================================================
   10. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.4,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

/* ==========================================================================
   11. Seamless Light / Dark Theme Switcher & Persistence
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    function applyTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            try {
                localStorage.setItem('portfolio-theme', theme);
            } catch (e) {}
        }

        const isLight = theme === 'light';
        themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
        themeToggleBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.classList.add('theme-transitioning');
        applyTheme(nextTheme, true);

        window.setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 400);
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (!savedTheme) {
            applyTheme(e.matches ? 'light' : 'dark', false);
        }
    });

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(currentTheme, false);
}
