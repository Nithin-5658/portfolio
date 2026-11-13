
/* =========================================
   CARVE - Homepage JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';


    // =====================================
    // 1. AUTOMATIC FOOTER YEAR
    // =====================================

    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }


    // =====================================
    // 2. LIGHT / DARK THEME TOGGLE
    // =====================================

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


    // =====================================
    // 3. MOBILE NAVIGATION
    // =====================================

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


    // =====================================
    // 4. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealItems = document.querySelectorAll('.reveal');

    const motionPreference = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const reduceMotion = motionPreference && motionPreference.matches;

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

        revealItems.forEach(item => observerObserve(item, revealObserver));
    }

    function observerObserve(item, observer) {
        observer.observe(item);
    }


    // =====================================
    // 5. ONE-CARD-AT-A-TIME TECHNOLOGY CAROUSEL
    //
    // Desktop: 4 visible cards.
    // Tablet/mobile: 3 visible cards.
    // One card slides left every 3.2 seconds.
    // The sequence loops cleanly.
    // =====================================

    const track = document.getElementById('technologyTrack');

    const viewport = track
        ? track.closest('.technology-viewport')
        : null;

    if (track && viewport) {

        // Ensure an older marquee animation cannot override this carousel.
        track.classList.remove('is-auto-moving');
        track.style.removeProperty('animation');

        const originalCards = Array.from(
            track.querySelectorAll(':scope > .technology-card')
        );

        const originalCount = originalCards.length;

        if (originalCount > 1) {

            // Add copies of the first cards for a seamless loop.
            const cloneCount = Math.min(4, originalCount);

            for (let i = 0; i < cloneCount; i += 1) {

                const duplicate = originalCards[i].cloneNode(true);

                duplicate.setAttribute('aria-hidden', 'true');

                duplicate.querySelectorAll('img').forEach(img => {
                    img.alt = '';
                });

                track.appendChild(duplicate);
            }

            let visibleCount = 4;
            let gap = 18;
            let stepSize = 0;
            let currentIndex = 0;
            let slideTimer = null;
            let resizeObserver = null;
            let resizeTimer = null;


            // Reset carousel without a visible transition.
            function resetPositionWithoutAnimation() {

                track.style.setProperty(
                    'transition',
                    'none',
                    'important'
                );

                currentIndex = 0;

                track.style.transform =
                    'translate3d(0, 0, 0)';

                // Force layout so the browser applies the instant reset.
                void track.offsetWidth;

                track.style.removeProperty('transition');
            }


            // Calculate responsive card dimensions.
            function updateCarouselLayout() {

                visibleCount =
                    window.innerWidth <= 991 ? 3 : 4;

                gap = window.innerWidth <= 640
                    ? 10
                    : (window.innerWidth <= 991 ? 14 : 18);

                const viewportWidth = viewport.clientWidth;

                if (!viewportWidth) return;

                const cardWidth = Math.max(
                    82,
                    (viewportWidth - gap * (visibleCount - 1))
                    / visibleCount
                );

                track.style.setProperty(
                    '--home-tech-gap',
                    `${gap}px`
                );

                track.style.setProperty(
                    '--home-tech-card-width',
                    `${cardWidth}px`
                );

                resetPositionWithoutAnimation();

                stepSize = cardWidth + gap;
            }


            // Move exactly one technology card to the left.
            function moveOneCardLeft() {

                if (document.hidden || !stepSize) return;

                currentIndex += 1;

                track.style.transform =
                    `translate3d(${-currentIndex * stepSize}px, 0, 0)`;
            }


            // After the original cards have moved out,
            // reset to the identical cloned sequence.
            track.addEventListener('transitionend', event => {

                if (
                    event.propertyName === 'transform' &&
                    currentIndex >= originalCount
                ) {
                    resetPositionWithoutAnimation();
                }

            });


            // Start the timed carousel.
            function startCarousel() {

                if (
                    slideTimer !== null ||
                    document.hidden
                ) {
                    return;
                }

                slideTimer =
                    window.setInterval(moveOneCardLeft, 3200);
            }


            // Stop the timed carousel.
            function stopCarousel() {

                if (slideTimer !== null) {

                    window.clearInterval(slideTimer);

                    slideTimer = null;
                }
            }


            // Set initial dimensions before the first movement.
            updateCarouselLayout();


            // Recalculate when the carousel viewport changes.
            if ('ResizeObserver' in window) {

                resizeObserver = new ResizeObserver(() => {
                    updateCarouselLayout();
                });

                resizeObserver.observe(viewport);

            } else {

                window.addEventListener('resize', () => {

                    window.clearTimeout(resizeTimer);

                    resizeTimer = window.setTimeout(
                        updateCarouselLayout,
                        150
                    );

                });

            }


            // Pause while the browser tab is hidden.
            // Resume automatically when the visitor returns.
            document.addEventListener('visibilitychange', () => {

                if (document.hidden) {
                    stopCarousel();
                } else {
                    startCarousel();
                }

            });


            // Start automatically on desktop, tablet and mobile.
            startCarousel();

        }

    }


    // =====================================
    // 6. BACK-TO-TOP BUTTON
    // =====================================

    const backToTop = document.getElementById('backToTop');

    if (backToTop) {

        const updateBackToTop = () => {

            backToTop.classList.toggle(
                'is-visible',
                window.scrollY > 420
            );

        };

        window.addEventListener(
            'scroll',
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();

        backToTop.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });

        });

    }

});
