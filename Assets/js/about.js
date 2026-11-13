
/* =========================================
   CARVE - About Me Page JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. AUTOMATIC FOOTER YEAR
    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }


    // 2. LIGHT / DARK THEME TOGGLE
    // Uses the same theme preference as index.html.

    const themeToggle = document.getElementById('themeToggle');

    function getSavedTheme() {
        try {
            return localStorage.getItem('carve-theme');
        } catch (error) {
            return null;
        }
    }

    function updateThemeIcon() {
        if (!themeToggle) return;

        const isLight =
            document.body.classList.contains('light-theme');

        themeToggle.setAttribute(
            'aria-label',
            isLight
                ? 'Switch to dark theme'
                : 'Switch to light theme'
        );

        themeToggle.setAttribute(
            'aria-pressed',
            String(isLight)
        );

        themeToggle.title = isLight
            ? 'Switch to dark theme'
            : 'Switch to light theme';
    }

    // Apply previously selected theme.
    if (getSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeIcon();

    // Toggle theme when clicked.
    if (themeToggle) {

        themeToggle.addEventListener('click', () => {

            document.body.classList.toggle('light-theme');

            const currentTheme =
                document.body.classList.contains('light-theme')
                    ? 'light'
                    : 'dark';

            try {
                localStorage.setItem(
                    'carve-theme',
                    currentTheme
                );
            } catch (error) {
                // Theme switching still works for this visit.
            }

            updateThemeIcon();

        });

    }


    // 3. MOBILE NAVIGATION
    const navigation =
        document.getElementById('mainNavigation');

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


    // 4. ESCAPE KEY CLOSES MOBILE MENU
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


    // 5. RESPECT REDUCED MOTION SETTINGS
    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

    if (reduceMotion) {

        document.querySelectorAll('.about-reveal')
            .forEach(element => {

                element.style.animation = 'none';
                element.style.opacity = '1';
                element.style.transform = 'none';

            });

    }

});
