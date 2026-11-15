
/* =========================================
   CARVE - Projects Page JavaScript

   1. Automatic footer year
   2. Shared light / dark theme
   3. Mobile Bootstrap navigation
   4. Project category filtering
   5. Scroll reveal animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    'use strict';


    // Enable CSS reveal animations after JavaScript loads.
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


    // Read the saved theme safely.
    function readSavedTheme() {

        try {

            return localStorage.getItem('carve-theme');

        } catch (error) {

            return null;

        }

    }



    // Update the theme button.
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



    // Restore the previously selected theme.
    if (readSavedTheme() === 'light') {

        document.body.classList.add('light-theme');

    }


    updateThemeControl();



    // Toggle between light and dark themes.
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

                // Theme switching still works for this visit.

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



    // Close mobile navigation using Escape.
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
    // 4. PROJECT CATEGORY FILTERING
    // =====================================

    const filterButtons =
        document.querySelectorAll('.project-filter');


    const projectCards =
        document.querySelectorAll('.project-card');


    const visibleProjectCount =
        document.getElementById('visibleProjectCount');


    const emptyState =
        document.getElementById('projectsEmptyState');


    let currentFilter = 'all';



    // Update the project counter.
    function updateProjectCount(count) {

        if (!visibleProjectCount) return;


        visibleProjectCount.textContent =
            String(count).padStart(2, '0');

    }



    // Apply the selected category filter.
    function applyProjectFilter(selectedFilter) {

        currentFilter = selectedFilter;


        let visibleCount = 0;


        projectCards.forEach(card => {


            const cardCategory =
                card.dataset.category;


            const shouldShow =
                selectedFilter === 'all' ||
                cardCategory === selectedFilter;


            card.hidden = !shouldShow;


            if (shouldShow) {

                visibleCount++;

            }

        });



        // Update selected filter styling.
        filterButtons.forEach(button => {


            const isActive =
                button.dataset.filter === selectedFilter;


            button.classList.toggle(
                'active',
                isActive
            );


            button.setAttribute(
                'aria-pressed',
                String(isActive)
            );

        });



        // Update the visible project total.
        updateProjectCount(visibleCount);



        // Show an empty state only when needed.
        if (emptyState) {

            emptyState.hidden =
                visibleCount !== 0;

        }



        // Observe newly visible cards for animation.
        observeVisibleProjects();

    }



    // Filter button click events.
    filterButtons.forEach(button => {


        button.addEventListener('click', () => {


            const selectedFilter =
                button.dataset.filter;


            if (
                !selectedFilter ||
                selectedFilter === currentFilter
            ) {

                return;

            }


            applyProjectFilter(selectedFilter);

        });

    });



    // Initial filter.
    applyProjectFilter('all');



    // =====================================
    // 5. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealItems =
        document.querySelectorAll('.project-reveal');


    const motionPreference =
        window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null;


    const reduceMotion =
        motionPreference && motionPreference.matches;


    let revealObserver = null;



    // Show everything immediately if the user
    // prefers reduced motion or the browser does
    // not support IntersectionObserver.
    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {

        revealItems.forEach(item => {

            item.classList.add('is-visible');

        });

    } else {


        revealObserver =
            new IntersectionObserver(

                (entries, observer) => {


                    entries.forEach(entry => {


                        if (entry.isIntersecting) {


                            entry.target.classList.add('is-visible');


                            // Animate each element only once.
                            observer.unobserve(entry.target);

                        }

                    });

                },

                {
                    threshold: 0.08,
                    rootMargin: '0px 0px -25px 0px'
                }

            );



        // Observe items that are not yet revealed.
        function observeVisibleProjects() {


            revealItems.forEach(item => {


                if (
                    item.classList.contains('is-visible') ||
                    item.hidden
                ) {

                    return;

                }


                revealObserver.observe(item);

            });

        }



        observeVisibleProjects();

    }



    // =====================================
    // 6. INITIAL PAGE UPDATE
    // =====================================

    updateThemeControl();

});
