
/* ==========================================================
   NITHIN LAIJU - CINEMATIC INTRO CONTROLLER
   Completely independent of the existing script.js.
   ========================================================== */

(() => {
    'use strict';

    const intro = document.getElementById('nithinIntro');

    if (!intro) return;

    const root = document.documentElement;

    const reducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startTime = performance.now();

    const minimumDuration = reducedMotion ? 350 : 2250;
    const maximumDuration = reducedMotion ? 1000 : 3200;

    let exitTimer = null;
    let fallbackTimer = null;
    let removed = false;
    let exitStarted = false;

    const previousOverflow = root.style.overflow;

    // Prevent background scrolling during the intro.
    root.style.overflow = 'hidden';

    function restoreScrolling() {
        root.style.overflow = previousOverflow;
    }

    function removeIntro() {
        if (removed) return;

        removed = true;

        if (fallbackTimer !== null) {
            window.clearTimeout(fallbackTimer);
        }

        intro.remove();
        restoreScrolling();
    }

    function exitIntro() {
        if (exitStarted || removed) return;

        exitStarted = true;

        if (exitTimer !== null) {
            window.clearTimeout(exitTimer);
        }

        intro.classList.add('is-leaving');

        // Restore scrolling when the cinematic transition starts.
        restoreScrolling();

        intro.addEventListener('transitionend', event => {
            if (
                event.target === intro &&
                event.propertyName === 'transform'
            ) {
                removeIntro();
            }
        }, { once: true });

        // Fallback in case transitionend is not fired.
        fallbackTimer = window.setTimeout(
            removeIntro,
            reducedMotion ? 250 : 1000
        );
    }

    function scheduleExit() {
        if (exitStarted || exitTimer !== null) return;

        const elapsed = performance.now() - startTime;

        const remaining = Math.max(
            0,
            minimumDuration - elapsed
        );

        exitTimer = window.setTimeout(
            exitIntro,
            remaining
        );
    }

    // Never keep the intro on screen for too long.
    const maximumTimer = window.setTimeout(
        exitIntro,
        maximumDuration
    );

    // Start the exit after the page finishes loading.
    if (document.readyState === 'complete') {
        scheduleExit();
    } else {
        window.addEventListener('load', scheduleExit, {
            once: true
        });
    }

})();
