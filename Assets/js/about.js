
/* =========================================
   CARVE - About Me Page JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Enable entrance animations only after JavaScript has loaded.
    document.documentElement.classList.add('js');


    // =====================================
    // 1. AUTOMATIC FOOTER YEAR
    // =====================================

    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }


    // =====================================
    // 2. SHARED LIGHT / DARK THEME
    // Uses the same localStorage key as CARVE homepage.
    // =====================================

    const themeToggle = document.getElementById('themeToggle');

    function readSavedTheme() {
        try {
            return localStorage.getItem('carve-theme');
        } catch (error) {
            return null;
        }
    }

    function updateThemeControl() {
        if (!themeToggle) return;

        const isLight = document.body.classList.contains('light-theme');

        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Switch to dark theme' : 'Switch to light theme'
        );

        themeToggle.setAttribute('aria-pressed', String(isLight));

        themeToggle.title = isLight
            ? 'Switch to dark theme'
            : 'Switch to light theme';
    }

    // Restore previously selected theme.
    if (readSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeControl();

    // Theme toggle click event.
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {

            document.body.classList.toggle('light-theme');

            const selectedTheme = document.body.classList.contains('light-theme')
                ? 'light'
                : 'dark';

            try {
                localStorage.setItem('carve-theme', selectedTheme);
            } catch (error) {
                // Theme switching still works for this page view.
            }

            updateThemeControl();
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
                    window.innerWidth < 992 &&
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


    // =====================================
    // 4. ESCAPE KEY CLOSES MOBILE MENU
    // =====================================

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
    // 5. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
    // =====================================

    const revealItems = document.querySelectorAll('.about-reveal');

    const motionPreference = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const reduceMotion = motionPreference && motionPreference.matches;

    // Display everything immediately when reduced motion is preferred
    // or when IntersectionObserver is unavailable.
    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        revealItems.forEach(item => {
            item.classList.add('is-visible');
        });
    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('is-visible');

                        // Stop observing after the animation.
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -35px 0px'
            }
        );

        revealItems.forEach(item => {
            revealObserver.observe(item);
        });

    }

});
