
/* =========================================
   CARVE - SKILLS PAGE JAVASCRIPT
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    document.documentElement.classList.add('js');


    // =====================================
    // 1. AUTOMATIC FOOTER YEAR
    // =====================================

    const yearNode = document.getElementById('currentYear');

    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }



    // =====================================
    // 2. LIGHT / DARK THEME
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


    // Restore previously selected theme.

    if (readSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
    }

    updateThemeControl();


    // Theme switching.

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

                // Theme switching still works for this page.

            }

            updateThemeControl();

        });

    }



    // =====================================
    // 3. MOBILE NAVIGATION
    // =====================================

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


    // =====================================
    // 4. SOLAR SYSTEM TECHNOLOGY ANIMATION
    // =====================================

    const solarSystem =
        document.getElementById('technologyOrbit');

    if (solarSystem) {

        const planetNodes = Array.from(
            solarSystem.querySelectorAll('.orbit-node')
        );


        // Store the orbital information for each planet.
        const planets = planetNodes.map((node) => ({
            element: node,
            orbit: node.dataset.orbit,
            angle: Number(node.dataset.angle || 0) * (Math.PI / 180),
            speed: Number(node.dataset.speed || 0.3)
        }));


        // Read the orbit sizes from the responsive CSS.
        let orbitRadii = {
            inner: 92,
            middle: 135,
            outer: 180
        };


        function updateOrbitRadii() {

            const styles =
                window.getComputedStyle(solarSystem);

            orbitRadii.inner =
                parseFloat(
                    styles.getPropertyValue('--inner-radius')
                ) || 92;

            orbitRadii.middle =
                parseFloat(
                    styles.getPropertyValue('--middle-radius')
                ) || 135;

            orbitRadii.outer =
                parseFloat(
                    styles.getPropertyValue('--outer-radius')
                ) || 180;

            positionPlanets();
        }


        /*
         * Calculate the circular position of every planet.
         *
         * X = radius × cos(angle)
         * Y = radius × sin(angle)
         *
         * The planets are moved using CSS transform
         * variables, without rotating the planet itself.
         * This keeps their icons and names upright.
         */

        function positionPlanets() {

            planets.forEach((planet) => {

                const radius =
                    orbitRadii[planet.orbit] || 92;

                const x =
                    Math.cos(planet.angle) * radius;

                const y =
                    Math.sin(planet.angle) * radius;

                planet.element.style.setProperty(
                    '--planet-x',
                    `${x.toFixed(2)}px`
                );

                planet.element.style.setProperty(
                    '--planet-y',
                    `${y.toFixed(2)}px`
                );

            });

        }


        // Calculate initial positions.
        updateOrbitRadii();


        // Recalculate orbit sizes when the screen changes.
        if ('ResizeObserver' in window) {

            const orbitResizeObserver =
                new ResizeObserver(() => {
                    updateOrbitRadii();
                });

            orbitResizeObserver.observe(solarSystem);

        } else {

            window.addEventListener(
                'resize',
                updateOrbitRadii
            );

        }


        // ---------------------------------
        // CONTINUOUS PLANET MOVEMENT
        // ---------------------------------

        let animationFrame = null;
        let previousTime = null;


        function animatePlanets(timestamp) {

            if (previousTime === null) {
                previousTime = timestamp;
            }

            const elapsed = Math.min(
                (timestamp - previousTime) / 1000,
                0.05
            );

            previousTime = timestamp;


            planets.forEach((planet) => {

                /*
                 * Different speeds create different
                 * orbital periods, like a solar system.
                 *
                 * Multiplying by 1.5 makes movement
                 * noticeable without being too fast.
                 */

                planet.angle +=
                    planet.speed * 1.5 * elapsed;

            });


            // Update all seven planet positions.
            positionPlanets();


            // Keep the animation running.
            animationFrame =
                window.requestAnimationFrame(animatePlanets);

        }


        function startOrbitAnimation() {

            if (
                animationFrame !== null ||
                document.hidden
            ) {
                return;
            }

            previousTime = null;

            animationFrame =
                window.requestAnimationFrame(animatePlanets);

        }


        function stopOrbitAnimation() {

            if (animationFrame !== null) {

                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;

            }

            previousTime = null;

        }


        /*
         * Start automatically when the page loads.
         * This orbit does not depend on hovering or clicking.
         */

        startOrbitAnimation();


        /*
         * Pause only while the browser tab is hidden.
         * Resume automatically when the visitor returns.
         */

        document.addEventListener(
            'visibilitychange',
            () => {

                if (document.hidden) {
                    stopOrbitAnimation();
                } else {
                    startOrbitAnimation();
                }

            }
        );

    }

    
    // =====================================
    // 5. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealItems =
        document.querySelectorAll('.skills-reveal');

    const reduceMotion =
        window.matchMedia &&
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;


    // Show all elements immediately when necessary.

    if (
        reduceMotion ||
        !('IntersectionObserver' in window)
    ) {

        revealItems.forEach((item) => {

            item.classList.add('is-visible');

        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add('is-visible');

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

    }

});
