
/* =========================================
   CARVE - Contact Me Page JavaScript

   1. Automatic footer year
   2. Shared light/dark theme
   3. Mobile Bootstrap navigation
   4. Scroll reveal animations
   5. Copy email functionality

   Page-specific behaviour only.
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    document.documentElement.classList.add('js');


    // =====================================
    // 1. AUTOMATIC FOOTER YEAR
    // =====================================

    const yearNode =
        document.getElementById('currentYear');

    if (yearNode) {

        yearNode.textContent =
            new Date().getFullYear();

    }



    // =====================================
    // 2. SHARED LIGHT / DARK THEME
    // =====================================

    const themeToggle =
        document.getElementById('themeToggle');


    // Read the previously selected theme.
    function readSavedTheme() {

        try {

            return localStorage.getItem('carve-theme');

        } catch (error) {

            return null;

        }

    }


    // Update theme button accessibility and tooltip.
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


    // Restore the saved theme.
    if (readSavedTheme() === 'light') {

        document.body.classList.add('light-theme');

    }


    updateThemeControl();



    // Toggle the theme.
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

                // Theme still works for the current visit.

            }


            updateThemeControl();

        });

    }



    // =====================================
    // 3. MOBILE BOOTSTRAP NAVIGATION
    // =====================================

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
    // 5. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealItems =
        document.querySelectorAll('.contact-reveal');


    const motionPreference =
        window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null;


    const reduceMotion =
        motionPreference && motionPreference.matches;



    // Show all content immediately when reduced
    // motion is preferred or observer is unavailable.
    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {

        revealItems.forEach(item => {

            item.classList.add('is-visible');

        });

    } else {


        const revealObserver =
            new IntersectionObserver(

                (entries, observer) => {


                    entries.forEach(entry => {


                        if (entry.isIntersecting) {


                            entry.target.classList.add('is-visible');


                            // Reveal an element only once.
                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },

                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -30px 0px'
                }

            );


        revealItems.forEach(item => {

            revealObserver.observe(item);

        });

    }



    // =====================================
    // 6. COPY EMAIL FUNCTIONALITY
    // =====================================

    const copyButtons =
        document.querySelectorAll('.contact-copy-button');

    const copyStatus =
        document.getElementById('contactCopyStatus');


    // Fallback for browsers without Clipboard API access.
    function fallbackCopyText(text) {

        const temporaryInput =
            document.createElement('textarea');


        temporaryInput.value = text;

        temporaryInput.setAttribute('readonly', '');

        temporaryInput.style.position = 'fixed';

        temporaryInput.style.left = '-9999px';

        temporaryInput.style.top = '0';

        temporaryInput.style.opacity = '0';


        document.body.appendChild(temporaryInput);


        temporaryInput.select();

        temporaryInput.setSelectionRange(
            0,
            temporaryInput.value.length
        );


        let successful = false;


        try {

            successful =
                document.execCommand('copy');

        } catch (error) {

            successful = false;

        }


        temporaryInput.remove();


        return successful;

    }



    // Copy using the most reliable available method.
    async function copyEmailAddress(email) {

        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText === 'function'
        ) {

            try {

                await navigator.clipboard.writeText(email);

                return true;

            } catch (error) {

                // Try the fallback below.

            }

        }


        return fallbackCopyText(email);

    }



    // Give the user visual feedback.
    function updateCopyButton(button, copied) {

        const label =
            button.querySelector('span');

        const icon =
            button.querySelector('i');


        if (!label || !icon) return;


        if (copied) {

            label.textContent = 'Copied';

            icon.className = 'bi bi-check2';


            button.classList.add('is-copied');

        } else {

            label.textContent = 'Copy';

            icon.className = 'bi bi-copy';


            button.classList.remove('is-copied');

        }

    }



    // Handle every copy button.
    copyButtons.forEach(button => {


        let resetTimer = null;


        button.addEventListener('click', async () => {


            const email =
                button.dataset.copyEmail;


            if (!email) return;


            if (resetTimer !== null) {

                clearTimeout(resetTimer);

            }


            const copied =
                await copyEmailAddress(email);


            if (copied) {


                updateCopyButton(button, true);


                if (copyStatus) {

                    copyStatus.textContent =
                        'Email address copied successfully.';

                }


            } else {


                if (copyStatus) {

                    copyStatus.textContent =
                        'Unable to copy automatically. Please use the email address shown.';

                }

            }


            // Reset the button after a short interval.
            if (copied) {

                resetTimer = setTimeout(() => {

                    updateCopyButton(button, false);

                    if (copyStatus) {
                        copyStatus.textContent = '';
                    }

                }, 2200);

            }

        });

    });



    // =====================================
    // 7. INITIALIZE CONTACT PAGE
    // =====================================

    updateThemeControl();

});
