/**
 * Siddhant Sawant - Modern Portfolio Web Application Scripts
 * Features: Typewriter, Navbar Scroll Spy, Mobile Drawer, Project Filters,
 * Skill Gauges, 3D Card Tilt, Timeline Animator, Async Formspree Handler
 */

document.addEventListener('DOMContentLoaded', () => {
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
   1. Dynamic Typewriter Effect
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
   2. Navbar Scroll Spy & Mobile Menu
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navItems = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll Navbar blur background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

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

    // Close menu when clicking nav links
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });

    // Scroll Spy
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 140;

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
}

/* ==========================================================================
   3. Project Filter Tabs
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
        });
    });
}

/* ==========================================================================
   4. Circular SVG Skill Progress Gauges
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
   5. Interactive Skill Tag Cloud Filters
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
        });
    });
}

/* ==========================================================================
   6. Education Timeline Scroll Tracker
   ========================================================================== */
function initEducationTimeline() {
    const timelineItems = document.querySelectorAll('.edu-timeline-item');
    const progressBar = document.querySelector('.edu-timeline-progress-bar');
    const eduSection = document.getElementById('education');

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

    // Dynamic progress bar height tracking
    function updateTimelineProgress() {
        if (!eduSection || !progressBar) return;

        const rect = eduSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top);
            const percent = Math.max(0, Math.min(100, (visible / rect.height) * 100));
            progressBar.style.height = `${percent}%`;
        }
    }

    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress, { passive: true });
    updateTimelineProgress();
}

/* ==========================================================================
   7. 3D Card Parallax Tilt Effect
   ========================================================================== */
function init3DCardTilt() {
    // Only enable on desktop pointers
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
   8. Contact Form Asynchronous Handler (Formspree)
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
   9. Back to Top Floating Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
