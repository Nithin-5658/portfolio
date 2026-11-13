
/* =========================================
   CARVE - Education Page JavaScript
   Page-specific behaviour; leaves index.js untouched.
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    document.documentElement.classList.add('js');

    // 1. AUTOMATIC FOOTER YEAR
    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }


    // 2. LIGHT / DARK THEME TOGGLE
    // Uses the same saved theme preference as the homepage and About page.

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

        const isLight =
            document.body.classList.contains('light-theme');

        themeToggle.setAttribute(
            'aria-pressed',
            String(isLight)
        );

        themeToggle.setAttribute(
            'aria-label',
            isLight
                ? 'Switch to dark theme'
                : 'Switch to light theme'
        );

        themeToggle.title = isLight
            ? 'Switch to dark theme'
            : 'Switch to light theme';
    }

    // Apply previously selected theme.
    if (readSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeControl();

    // Toggle theme when clicked.
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {

            document.body.classList.toggle('light-theme');

            const selectedTheme =
                document.body.classList.contains('light-theme')
                    ? 'light'
                    : 'dark';

            try {
                localStorage.setItem(
                    'carve-theme',
                    selectedTheme
                );
            } catch (error) {
                // Theme switching still works for the current page.
            }

            updateThemeControl();
        });
    }


    // 3. MOBILE NAVIGATION
    // Close the Bootstrap mobile navigation after choosing a page.

    const navigation =
        document.getElementById('mainNavigation');

    if (navigation) {
        navigation.querySelectorAll('.nav-link').forEach((link) => {

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


    // 4. EDUCATION TIMELINE SCROLL ANIMATIONS
    // Reveal headings and timeline cards when they enter the viewport.

    const revealItems =
        document.querySelectorAll('.education-reveal');

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    // Show everything immediately if reduced motion is enabled
    // or IntersectionObserver is not supported.
    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {
        revealItems.forEach((item) => {
            item.classList.add('is-visible');
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('is-visible');

                    // Stop observing once the element is revealed.
                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -35px 0px'
        }
    );

    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

});
