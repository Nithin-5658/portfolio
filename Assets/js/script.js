
/* =========================================
   CARVE - Homepage JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. AUTOMATIC FOOTER YEAR
    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }

    // 2. LIGHT / DARK THEME TOGGLE
    const themeToggle = document.getElementById('themeToggle');

    function readSavedTheme() {
        try {
            return localStorage.getItem('carve-theme');
        } catch (error) {
            return null;
        }
    }

    function updateThemeIcon() {
        if (!themeToggle) return;

        const light = document.body.classList.contains('light-theme');

        themeToggle.setAttribute(
            'aria-label',
            light ? 'Switch to dark theme' : 'Switch to light theme'
        );
        themeToggle.setAttribute('aria-pressed', String(light));
        themeToggle.title = light
            ? 'Switch to dark theme'
            : 'Switch to light theme';
    }

    if (readSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');

            const currentTheme = document.body.classList.contains('light-theme')
                ? 'light'
                : 'dark';

            try {
                localStorage.setItem('carve-theme', currentTheme);
            } catch (error) {
                // Theme still works for the current visit.
            }

            updateThemeIcon();
        });
    }

    // 3. MOBILE NAVIGATION
    const navigation = document.getElementById('mainNavigation');

    if (navigation) {
        navigation.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (
                    window.innerWidth < 1200 &&
                    navigation.classList.contains('show') &&
                    window.bootstrap
                ) {
                    window.bootstrap.Collapse
                        .getOrCreateInstance(navigation)
                        .hide();
                }
            });
        });
    }

    // Close the Bootstrap menu with Escape.
    document.addEventListener('keydown', event => {
        if (
            event.key === 'Escape' &&
            navigation &&
            navigation.classList.contains('show') &&
            window.bootstrap
        ) {
            window.bootstrap.Collapse
                .getOrCreateInstance(navigation)
                .hide();
        }
    });

    // 4. SCROLL REVEAL ANIMATIONS
    const revealItems = document.querySelectorAll('.reveal');

    const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -25px 0px'
            }
        );

        revealItems.forEach(item => revealObserver.observe(item));
    }

    // 5. AUTOMATIC TECHNOLOGY CAROUSEL
    const track = document.getElementById('technologyTrack');
    const viewport = track
        ? track.closest('.technology-viewport')
        : null;

    if (track && viewport) {

        // Get the original technology cards from HTML
        const originalCards = Array.from(
            track.querySelectorAll(':scope > .technology-card')
        );

        if (originalCards.length > 1) {

            // Create the first technology group
            const firstGroup = document.createElement('div');
            firstGroup.className = 'technology-group';

            originalCards.forEach(card => {
                firstGroup.appendChild(card);
            });

            // Duplicate the group for seamless looping
            const secondGroup = firstGroup.cloneNode(true);

            secondGroup.setAttribute('aria-hidden', 'true');

            secondGroup.querySelectorAll('img').forEach(img => {
                img.alt = '';
            });

            // Replace the original track contents
            track.replaceChildren(firstGroup, secondGroup);

            // Calculate card dimensions
            function updateTechnologyCards() {

                const visibleCount =
                    window.innerWidth <= 991 ? 3 : 4;

                const gap = window.innerWidth <= 640 ? 10 : 18;

                const viewportWidth = viewport.clientWidth;

                const cardWidth =
                    (viewportWidth - gap * (visibleCount - 1))
                    / visibleCount;

                track.style.setProperty(
                    '--tech-gap',
                    `${gap}px`
                );

                track.style.setProperty(
                    '--tech-card-width',
                    `${cardWidth}px`
                );
            }

            // Initialize card dimensions
            updateTechnologyCards();

            // Recalculate after resizing
            let resizeTimer;

            window.addEventListener('resize', () => {

                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(() => {
                    updateTechnologyCards();
                }, 150);

            });

            // Start automatic animation
            track.classList.add('is-auto-moving');
        }
    }

    // 6. BACK-TO-TOP BUTTON
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.classList.toggle('is-visible', window.scrollY > 420);
        };

        window.addEventListener('scroll', updateBackToTop, { passive: true });
        updateBackToTop();

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        });
    }

});
