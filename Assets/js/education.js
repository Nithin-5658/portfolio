
/* =========================================
   CARVE - Education Page JavaScript
   Straight road with synchronized progress and vehicle.
   Shared theme, navigation and reveal animations.
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
    // 2. SHARED LIGHT / DARK THEME
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

    if (readSavedTheme() === 'light') {
        document.body.classList.add('light-theme');
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

    // Escape key closes the mobile menu.
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
    // 4. EDUCATION SCROLL REVEAL
    // =====================================

    const revealItems =
        document.querySelectorAll('.education-reveal');

    const motionPreference = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const reduceMotion =
        motionPreference && motionPreference.matches;

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


    // =====================================
    // 5. ROADMAP ELEMENTS
    // =====================================

    const roadmap =
        document.getElementById('educationRoadmap');

    if (!roadmap) return;

    const roadTrack =
        roadmap.querySelector('.education-road-track');

    const roadSvg =
        roadTrack
            ? roadTrack.querySelector('.education-road-svg')
            : null;

    const roadEdge =
        roadSvg
            ? roadSvg.querySelector('.education-road-edge')
            : null;

    const roadBase =
        roadSvg
            ? roadSvg.querySelector('.education-road-base')
            : null;

    const roadProgress =
        roadSvg
            ? roadSvg.querySelector('.education-road-progress')
            : null;

    const roadDashes =
        roadSvg
            ? roadSvg.querySelector('.education-road-dashes')
            : null;

    if (
        !roadTrack ||
        !roadSvg ||
        !roadEdge ||
        !roadBase ||
        !roadProgress ||
        !roadDashes
    ) {
        console.warn('CARVE: Roadmap SVG elements are missing.');
        return;
    }


    // =====================================
    // 6. FIND OR CREATE THE VEHICLE
    // =====================================

    let vehicle =
        roadmap.querySelector('#educationRoadVehicle');

    if (!vehicle) {

        vehicle = document.createElement('div');

        vehicle.id = 'educationRoadVehicle';
        vehicle.className = 'education-road-vehicle';

        vehicle.setAttribute('aria-hidden', 'true');

        vehicle.innerHTML = `
            <span class="education-vehicle-glow"></span>
            <span class="education-vehicle-body">
                <i class="bi bi-car-front-fill"></i>
            </span>
        `;

        roadmap.appendChild(vehicle);
    }


    // =====================================
    // 7. ROAD STATE
    // =====================================

    let roadLength = 0;
    let ticking = false;
    let resizeObserver = null;


    // =====================================
    // 8. BUILD THE STRAIGHT ROAD
    // =====================================

    function buildStraightRoad() {

        const trackRect =
            roadTrack.getBoundingClientRect();

        if (
            trackRect.width < 2 ||
            trackRect.height < 2
        ) {
            return;
        }


        // Find milestone marker positions.
        const markers = Array.from(
            roadmap.querySelectorAll('.education-marker')
        );

        const markerXPositions = markers
            .map(marker => {

                const core = marker.querySelector(
                    '.education-marker-core'
                );

                if (!core) return null;

                const rect = core.getBoundingClientRect();

                return (
                    rect.left +
                    rect.width / 2 -
                    trackRect.left
                );

            })
            .filter(Number.isFinite);

        if (!markerXPositions.length) return;


        // Calculate the common road centre.
        // It adapts automatically to desktop and mobile.
        const roadX =
            markerXPositions.reduce(
                (sum, x) => sum + x,
                0
            ) / markerXPositions.length;


        // Determine road starting position.
        const startLabel =
            roadmap.querySelector('.education-route-start');

        let startY = 0;

        if (startLabel) {

            const startRect =
                startLabel.getBoundingClientRect();

            startY = Math.max(
                0,
                startRect.bottom - trackRect.top + 5
            );

        }


        // Extend the road to the bottom of its track.
        const endY = trackRect.height;


        // Create one straight vertical SVG path.
        const pathData =
            `M ${roadX.toFixed(2)} ${startY.toFixed(2)} ` +
            `L ${roadX.toFixed(2)} ${endY.toFixed(2)}`;


        // Update responsive SVG dimensions.
        roadSvg.setAttribute(
            'viewBox',
            `0 0 ${trackRect.width.toFixed(2)} ${trackRect.height.toFixed(2)}`
        );


        // Every road layer follows the exact same path.
        roadEdge.setAttribute('d', pathData);
        roadBase.setAttribute('d', pathData);
        roadProgress.setAttribute('d', pathData);
        roadDashes.setAttribute('d', pathData);


        // Measure the complete road using the base path.
        // Its geometry is unaffected by stroke-dash settings.
        roadLength = roadBase.getTotalLength();

        if (
            !Number.isFinite(roadLength) ||
            roadLength <= 0
        ) {
            roadLength = 0;
            return;
        }


        // ---------------------------------
        // IMPORTANT: PROGRESS INITIALIZATION
        // ---------------------------------

        // One dash equal to the full road length,
        // followed by another full-length gap.
        //
        // Dash offset = full length means the road
        // starts with no cyan progress visible.

        roadProgress.style.setProperty(
            'stroke',
            'url(#educationRoadGlow) #00d5ff',
            'important'
        );

        roadProgress.style.setProperty(
            'stroke-dasharray',
            `${roadLength} ${roadLength}`,
            'important'
        );

        roadProgress.style.setProperty(
            'stroke-dashoffset',
            `${roadLength}`,
            'important'
        );

        roadProgress.style.setProperty(
            'opacity',
            '1',
            'important'
        );


        // Set initial vehicle and road positions.
        updateJourneyProgress();
    }


    // =====================================
    // 9. SHARED ROAD / VEHICLE PROGRESS
    // =====================================

    function updateJourneyProgress() {

        if (!roadLength) {
            ticking = false;
            return;
        }


        const trackRect =
            roadTrack.getBoundingClientRect();


        // Get the start and end of the complete road.
        const firstPoint =
            roadBase.getPointAtLength(0);

        const lastPoint =
            roadBase.getPointAtLength(roadLength);


        // Convert road positions into viewport coordinates.
        const startScreenY =
            trackRect.top + firstPoint.y;

        const endScreenY =
            trackRect.top + lastPoint.y;


        // The progress reference line on the screen.
        // As the page scrolls, this line travels
        // through the entire education road.
        const triggerY =
            window.innerHeight * 0.68;


        // Calculate how far the reference line has travelled
        // between the beginning and end of the road.
        const roadScreenDistance =
            endScreenY - startScreenY;

        let progress = 0;

        if (roadScreenDistance > 0) {

            progress = (
                triggerY - startScreenY
            ) / roadScreenDistance;

        }

        // Keep progress between 0 and 1.
        progress = Math.max(
            0,
            Math.min(1, progress)
        );


        // Calculate the physical length of the filled road.
        const filledLength =
            roadLength * progress;


        // ---------------------------------
        // A. CYAN PROGRESS BAR
        // ---------------------------------

        /*
           The SVG path has a dash equal to the full road length.

           At 0%:
           dashoffset = full road length (empty road)

           At 50%:
           dashoffset = half road length (half illuminated)

           At 100%:
           dashoffset = 0 (fully illuminated)

           This reveals the road continuously from its starting point.
        */

        const remainingDash =
            roadLength - filledLength;

        roadProgress.style.setProperty(
            'stroke-dashoffset',
            `${remainingDash}`,
            'important'
        );


        // ---------------------------------
        // B. POSITION THE VEHICLE
        // ---------------------------------

        // Use the same filledLength for the vehicle.
        // Therefore the vehicle always sits at the
        // leading edge of the cyan progress.

        const currentPoint =
            roadBase.getPointAtLength(filledLength);


        // Convert SVG coordinates into roadmap coordinates.
        const roadmapRect =
            roadmap.getBoundingClientRect();

        const vehicleX =
            trackRect.left -
            roadmapRect.left +
            currentPoint.x;

        const vehicleY =
            trackRect.top -
            roadmapRect.top +
            currentPoint.y;


        // Centre the vehicle exactly on the progress endpoint.
        vehicle.style.left =
            `${vehicleX}px`;

        vehicle.style.top =
            `${vehicleY}px`;


        // Vehicle start and destination states.
        vehicle.classList.toggle(
            'vehicle-started',
            progress > 0
        );

        vehicle.classList.toggle(
            'vehicle-arrived',
            progress >= 1
        );


        ticking = false;
    }


    // =====================================
    // 10. SCROLL UPDATE
    // =====================================

    function requestJourneyUpdate() {

        if (ticking) return;

        ticking = true;

        window.requestAnimationFrame(
            updateJourneyProgress
        );
    }


    // =====================================
    // 11. RESPONSIVE ROAD REBUILD
    // =====================================

    function refreshRoad() {

        window.requestAnimationFrame(() => {
            buildStraightRoad();
        });
    }


    window.addEventListener(
        'scroll',
        requestJourneyUpdate,
        { passive: true }
    );

    window.addEventListener(
        'resize',
        refreshRoad,
        { passive: true }
    );


    // =====================================
    // 12. OBSERVE SIZE CHANGES
    // =====================================

    if ('ResizeObserver' in window) {

        resizeObserver =
            new ResizeObserver(refreshRoad);

        resizeObserver.observe(roadmap);

        roadmap.querySelectorAll(
            '.education-card, ' +
            '.education-route-start, ' +
            '.education-route-finish'
        ).forEach(element => {

            resizeObserver.observe(element);

        });

    }


    // =====================================
    // 13. REBUILD AFTER IMAGES LOAD
    // =====================================

    roadmap.querySelectorAll(
        '.education-card-media img'
    ).forEach(image => {

        if (!image.complete) {

            image.addEventListener(
                'load',
                refreshRoad,
                { once: true }
            );

        }

    });


    // =====================================
    // 14. REBUILD AFTER FONTS LOAD
    // =====================================

    if (document.fonts && document.fonts.ready) {

        document.fonts.ready.then(refreshRoad);

    }


    // =====================================
    // 15. INITIALIZE ROAD
    // =====================================

    refreshRoad();

    window.addEventListener(
        'load',
        refreshRoad,
        { once: true }
    );

});
