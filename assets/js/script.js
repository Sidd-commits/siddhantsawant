/**
 * Siddhant Sawant - Modern Portfolio Web Application Scripts
 * Features: Lenis Smooth Scroll Engine, Typewriter, Scroll Spy, Mobile Drawer,
 * Project Filters, Skill Gauges, 3D Card Tilt, Timeline Animator, Async Formspree Handler
 */

let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initSmoothScroll();
    initTypewriter();
    initNavbar();
    initProjectFilters();
    initSkillGauges();
    initSkillTagFilters();
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
   5. Circular SVG Skill Progress Gauges
   ========================================================================== */
function initSkillGauges() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (!skillItems.length) return;

    const circumference = 2 * Math.PI * 28; // ~175.93px

    skillItems.forEach(item => {
        const circleContainer = item.querySelector('.skill-circle');
        if (!circleContainer) return;

        // Inject SVG if not present
        if (!circleContainer.querySelector('svg')) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '72');
            svg.setAttribute('height', '72');
            svg.setAttribute('viewBox', '0 0 72 72');

            svg.innerHTML = `
                <defs>
                    <linearGradient id="skill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFA500"/>
                        <stop offset="100%" stop-color="#58A6FF"/>
                    </linearGradient>
                </defs>
                <circle class="skill-bg" cx="36" cy="36" r="28" />
                <circle class="skill-bar" cx="36" cy="36" r="28" 
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${circumference}" />
            `;
            circleContainer.appendChild(svg);
        }
    });

    // Animate on scroll into view
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const percentage = parseInt(item.getAttribute('data-skill'), 10) || 0;
                const bar = item.querySelector('.skill-bar');

                if (bar) {
                    const offset = circumference - (circumference * percentage / 100);
                    bar.style.strokeDashoffset = offset;
                }
                obs.unobserve(item);
            }
        });
    }, { threshold: 0.3 });

    skillItems.forEach(item => observer.observe(item));
}

/* ==========================================================================
   6. Interactive Skill Tag Cloud Filters
   ========================================================================== */
function initSkillTagFilters() {
    const filterBtns = document.querySelectorAll('.tag-filter-buttons .filter-btn');
    const tags = document.querySelectorAll('.skill-tag');

    if (!filterBtns.length || !tags.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            tags.forEach(tag => {
                if (filter === 'all' || tag.classList.contains(filter)) {
                    tag.style.display = 'inline-flex';
                    tag.style.opacity = '1';
                } else {
                    tag.style.display = 'none';
                    tag.style.opacity = '0';
                }
            });

            if (lenis) {
                setTimeout(() => lenis.resize(), 100);
            }
        });
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
}

// Dynamic progress bar height tracking
function updateTimelineProgress() {
    const eduSection = document.getElementById('education');
    const progressBar = document.querySelector('.edu-timeline-progress-bar');
    if (!eduSection || !progressBar) return;

    const rect = eduSection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
        const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
        const percent = Math.max(0, Math.min(100, (visible / rect.height) * 100));
        progressBar.style.height = `${percent}%`;
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
   11. Interactive Cyberpunk Glowing Custom Cursor System
   ========================================================================== */
function initCustomCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const cursorLabel = document.getElementById('cursorLabel');
    const canvas = document.getElementById('cursorTrail');

    if (!cursorDot || !cursorRing) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isBlueMode = false;
    let isViewMode = false;

    // --- Particle Canvas Setup ---
    let ctx = null;
    let particles = [];
    const MAX_PARTICLES = 35;

    if (canvas) {
        ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            if (ctx) ctx.scale(dpr, dpr);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    class SparkParticle {
        constructor(x, y, colorType) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.8 + 0.4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.size = Math.random() * 2.8 + 1.2;
            this.life = 1.0;
            this.decay = Math.random() * 0.045 + 0.035;
            this.colorType = colorType; // 'amber' or 'cyan'
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.96;
            this.vy *= 0.96;
            this.size = Math.max(0, this.size - 0.03);
            this.life -= this.decay;
        }

        draw(c) {
            if (this.life <= 0 || this.size <= 0) return;
            c.save();
            c.globalAlpha = Math.max(0, this.life);
            if (this.colorType === 'cyan') {
                c.fillStyle = '#58A6FF';
                c.shadowColor = '#38BDF8';
            } else {
                c.fillStyle = '#FFA500';
                c.shadowColor = '#FF8C00';
            }
            c.shadowBlur = 8;
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            c.fill();
            c.restore();
        }
    }

    function spawnSparks(x, y, count = 2, colorType = 'amber') {
        if (!ctx) return;
        for (let i = 0; i < count; i++) {
            if (particles.length < MAX_PARTICLES) {
                particles.push(new SparkParticle(x, y, colorType));
            }
        }
    }

    // --- Fast Mouse Tracking ---
    let lastX = -100;
    let lastY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            ringX = mouseX;
            ringY = mouseY;
        }
        cursorDot.classList.remove('cursor-hidden');
        cursorRing.classList.remove('cursor-hidden');
        if (canvas) canvas.classList.remove('cursor-hidden');

        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        // Spawn trailing spark particles if moved
        const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
        if (dist > 7) {
            spawnSparks(mouseX, mouseY, 1, isBlueMode ? 'cyan' : 'amber');
            lastX = mouseX;
            lastY = mouseY;
        }
    }, { passive: true });

    // --- Physics Render Loop ---
    function render() {
        if (isVisible) {
            // Smooth inertia lerp for the follower ring
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;

            cursorRing.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;

            // Render Particle Canvas
            if (ctx) {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.update();
                    p.draw(ctx);
                    if (p.life <= 0 || p.size <= 0) {
                        particles.splice(i, 1);
                    }
                }
            }
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // --- Tactile Click State & Shockwave Sparks ---
    window.addEventListener('mousedown', (e) => {
        cursorRing.classList.add('cursor-active');
        cursorDot.classList.add('cursor-active');
        spawnSparks(e.clientX, e.clientY, 8, isBlueMode ? 'cyan' : 'amber');
    }, { passive: true });

    window.addEventListener('mouseup', () => {
        cursorRing.classList.remove('cursor-active');
        cursorDot.classList.remove('cursor-active');
    }, { passive: true });

    // --- Window Visibility & Focus ---
    document.addEventListener('mouseleave', () => {
        isVisible = false;
        cursorDot.classList.add('cursor-hidden');
        cursorRing.classList.add('cursor-hidden');
        if (canvas) canvas.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        cursorDot.classList.remove('cursor-hidden');
        cursorRing.classList.remove('cursor-hidden');
        if (canvas) canvas.classList.remove('cursor-hidden');
    });

    // --- Intelligent Event Delegation for Cursor Reactions ---
    document.addEventListener('mouseover', (e) => {
        const target = e.target;

        // 1. Text input & Textarea focus state
        const textInputEl = target.closest('input, textarea');
        if (textInputEl) {
            cursorRing.classList.add('cursor-hover-text');
            cursorDot.classList.add('cursor-hover-text');
            return;
        }

        // 2. Project Card or Media Preview
        const cardEl = target.closest('.project-card, .project-media, .photo-card-wrapper');
        const isActionBtn = target.closest('.project-btn, .icon-link, .overlay-actions');

        if (cardEl && !isActionBtn) {
            cursorRing.classList.add('cursor-hover-view');
            cursorDot.classList.add('cursor-hover-view');
            if (cursorLabel) cursorLabel.textContent = 'EXPLORE';
            isViewMode = true;
            return;
        }

        // 3. Interactive Buttons, Links, Badges
        const interactiveEl = target.closest('a, button, .btn, .filter-tab, .social-btn, .icon-link, .tag-filter-buttons .filter-btn, .project-btn, .skill-tag, label, .exp-card, .cert-card, .stat-card');

        if (interactiveEl) {
            if (interactiveEl.classList.contains('btn-secondary') ||
                interactiveEl.classList.contains('icon-link-live') ||
                interactiveEl.classList.contains('accent-blue') ||
                interactiveEl.classList.contains('badge-1') ||
                interactiveEl.classList.contains('badge-4') ||
                interactiveEl.classList.contains('project-btn-live')) {
                cursorRing.classList.add('cursor-hover-blue');
                cursorDot.classList.add('cursor-hover-blue');
                isBlueMode = true;
            } else {
                cursorRing.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
                isBlueMode = false;
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target;
        const interactiveEl = target.closest('a, button, .btn, .filter-tab, .social-btn, .icon-link, .tag-filter-buttons .filter-btn, .project-btn, .skill-tag, input, textarea, select, label, .exp-card, .cert-card, .stat-card, .project-card, .project-media, .photo-card-wrapper');

        if (interactiveEl) {
            cursorRing.classList.remove('cursor-hover', 'cursor-hover-blue', 'cursor-hover-view', 'cursor-hover-text');
            cursorDot.classList.remove('cursor-hover', 'cursor-hover-blue', 'cursor-hover-view', 'cursor-hover-text');
            if (cursorLabel) cursorLabel.textContent = '';
            isBlueMode = false;
            isViewMode = false;
        }
    });
}
