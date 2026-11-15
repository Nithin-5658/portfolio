
/* =========================================
   CARVE - Projects Page JavaScript
   Fixed mobile visibility and reveal issues
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    document.documentElement.classList.add('js');


    // 1. FOOTER YEAR
    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }


    // 2. THEME
    const themeToggle = document.getElementById('themeToggle');

    function updateThemeControl() {

        if (!themeToggle) return;

        const isLight = document.body.classList.contains('light-theme');

        themeToggle.setAttribute('aria-pressed', String(isLight));

        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Switch to dark theme' : 'Switch to light theme'
        );
    }

    try {
        if (localStorage.getItem('carve-theme') === 'light') {
            document.body.classList.add('light-theme');
        }
    } catch (error) {
        // Continue without saved theme.
    }

    updateThemeControl();

    if (themeToggle) {

        themeToggle.addEventListener('click', () => {

            document.body.classList.toggle('light-theme');

            const selectedTheme =
                document.body.classList.contains('light-theme')
                    ? 'light'
                    : 'dark';

            try {
                localStorage.setItem('carve-theme', selectedTheme);
            } catch (error) {
                // Theme still works for the current visit.
            }

            updateThemeControl();

        });
    }


    // 3. MOBILE NAVIGATION
    const navigation = document.getElementById('mainNavigation');

    if (navigation && window.bootstrap) {

        navigation.querySelectorAll('.nav-link').forEach(link => {

            link.addEventListener('click', () => {

                if (
                    window.innerWidth < 992 &&
                    navigation.classList.contains('show')
                ) {

                    window.bootstrap.Collapse
                        .getOrCreateInstance(navigation)
                        .hide();
                }
            });
        });
    }


    // 4. PROJECT FILTERING
    const filterButtons =
        document.querySelectorAll('.project-filter');

    const projectCards =
        document.querySelectorAll('.project-card');

    const visibleProjectCount =
        document.getElementById('visibleProjectCount');

    const emptyState =
        document.getElementById('projectsEmptyState');


    // 5. SCROLL REVEAL
    const revealItems =
        document.querySelectorAll('.project-reveal');

    let revealObserver = null;


    const reduceMotion =
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    // Define this function in the main scope.
    // It can now safely be called by the filter function.
    function observeVisibleProjects() {

        if (!revealObserver) return;

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


    if (
        !reduceMotion &&
        'IntersectionObserver' in window
    ) {

        revealObserver = new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('is-visible');

                        observer.unobserve(entry.target);
                    }
                });

            },

            {
                threshold: 0.05,
                rootMargin: '0px 0px -20px 0px'
            }

        );

    } else {

        // Ensure all elements are visible when animation
        // is disabled or IntersectionObserver is unavailable.
        revealItems.forEach(item => {
            item.classList.add('is-visible');
        });

    }


    function updateProjectCount(count) {

        if (visibleProjectCount) {

            visibleProjectCount.textContent =
                String(count).padStart(2, '0');
        }
    }


    function applyProjectFilter(selectedFilter) {

        let visibleCount = 0;

        projectCards.forEach(card => {

            const shouldShow =
                selectedFilter === 'all' ||
                card.dataset.category === selectedFilter;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });


        filterButtons.forEach(button => {

            const isActive =
                button.dataset.filter === selectedFilter;

            button.classList.toggle('active', isActive);

            button.setAttribute(
                'aria-pressed',
                String(isActive)
            );
        });


        updateProjectCount(visibleCount);


        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }


        // Re-observe visible cards after filtering.
        observeVisibleProjects();
    }


    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            const selectedFilter = button.dataset.filter;

            if (!selectedFilter) return;

            applyProjectFilter(selectedFilter);

        });
    });


    // Initial filtering.
    applyProjectFilter('all');


    // Observe all remaining reveal elements.
    observeVisibleProjects();


    updateThemeControl();

});
