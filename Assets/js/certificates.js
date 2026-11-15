
/* =========================================
   CARVE - Certificates Page JavaScript

   Image-based certificate gallery.

   1. Footer year
   2. Shared theme
   3. Mobile navigation
   4. Certificate data
   5. Newest-first sorting
   6. JPG certificate gallery
   7. Provider filters
   8. Large certificate image viewer
   9. Scroll reveal animations

   Original PDF rendering has been removed.
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
        yearNode.textContent = new Date().getFullYear();
    }



    // =====================================
    // 2. SHARED LIGHT / DARK THEME
    // =====================================

    const themeToggle =
        document.getElementById('themeToggle');


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

                // Theme remains functional for this visit.

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
    // 4. CERTIFICATE DATA
    //
    // Images are stored inside:
    // Assets/documents/
    //
    // dateSort format:
    // YYYY-MM-DD
    //
    // Year-only NPTEL dates are retained
    // without inventing months or days.
    // =====================================

    const certificates = [

        // ---------------------------------
        // IBM SKILLSBUILD
        // ---------------------------------

        {
            image: 'IBM_Ai.jpg',

            provider: 'IBM SkillsBuild',
            category: 'ibm',

            date: '04 SEP 2026',
            dateSort: '2026-09-04',

            title: 'AI Fundamentals: Foundations for Understanding AI',

            icon: 'bi-cpu-fill'
        },

        {
            image: 'IBM_web.jpg',

            provider: 'IBM SkillsBuild',
            category: 'ibm',

            date: '12 AUG 2026',
            dateSort: '2026-08-12',

            title: 'Web Development Fundamentals',

            icon: 'bi-window-stack'
        },


        // ---------------------------------
        // COGNITIVE CLASS
        // ---------------------------------

        {
            image: 'CognitiveClass_SQL.jpg',

            provider: 'Cognitive Class',
            category: 'cognitive',

            date: '13 JUL 2026',
            dateSort: '2026-07-13',

            title: 'SQL and Relational Databases 101',

            icon: 'bi-database-fill'
        },


        // ---------------------------------
        // SIMPLILEARN
        // ---------------------------------

        {
            image: 'Simplilearn_Python.jpg',

            provider: 'Simplilearn',
            category: 'simplilearn',

            date: '08 JUL 2026',
            dateSort: '2026-07-08',

            title: 'Programming with Python 3.X',

            icon: 'bi-filetype-py'
        },

        {
            image: 'Simplilearn_Ai.jpg',

            provider: 'Simplilearn',
            category: 'simplilearn',

            date: '21 JUN 2026',
            dateSort: '2026-06-21',

            title: 'Introduction to Artificial Intelligence',

            icon: 'bi-stars'
        },

        {
            image: 'Simplilearn_Cloud.jpg',

            provider: 'Simplilearn',
            category: 'simplilearn',

            date: '21 JUN 2026',
            dateSort: '2026-06-21',

            title: 'Introduction to Cloud Computing',

            icon: 'bi-cloud-check-fill'
        },


        // ---------------------------------
        // NPTEL
        // ---------------------------------

        {
            image: 'Nptel_dbms.jpg',

            provider: 'NPTEL',
            category: 'nptel',

            date: '2026',
            dateSort: '2026-00-00',

            title: 'Database Management Systems',

            icon: 'bi-database-fill-gear'
        },

        {
            image: 'Nptel_C.jpg',

            provider: 'NPTEL',
            category: 'nptel',

            date: '2026',
            dateSort: '2026-00-00',

            title: 'Problem Solving through Programming in C',

            icon: 'bi-code-slash'
        },

        {
            image: 'Nptel_Java.jpg',

            provider: 'NPTEL',
            category: 'nptel',

            date: '2024',
            dateSort: '2024-00-00',

            title: 'Programming in Java',

            icon: 'bi-cup-hot-fill'
        },

        {
            image: 'Nptel_cloud.jpg',

            provider: 'NPTEL',
            category: 'nptel',

            date: '2023',
            dateSort: '2023-00-00',

            title: 'Cloud Computing',

            icon: 'bi-cloud-fill'
        }

    ];


    // Sort newest first.
    certificates.sort((a, b) => {

        return b.dateSort.localeCompare(a.dateSort);

    });



    // =====================================
    // 5. GALLERY ELEMENTS
    // =====================================

    const gallery =
        document.getElementById('credentialsGallery');

    const filterButtons =
        document.querySelectorAll('.credential-filter');

    const totalCount =
        document.getElementById('certificateCount');

    const emptyMessage =
        document.getElementById('credentialsEmpty');


    if (!gallery) return;



    // =====================================
    // 6. SAFE HTML TEXT
    // =====================================

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, character => {

            const entities = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };

            return entities[character];

        });

    }



    // =====================================
    // 7. CREATE CERTIFICATE CARD
    //
    // Each card includes:
    // - Original certificate JPG
    // - Provider
    // - Issue date
    // - Certificate title
    //
    // Clicking anywhere on the card opens
    // the larger image viewer.
    // =====================================

    function createCertificate(certificate, index) {

        const imagePath =
            `Assets/documents/${certificate.image}`;


        const safeImagePath =
            escapeHTML(imagePath);

        const safeTitle =
            escapeHTML(certificate.title);

        const safeProvider =
            escapeHTML(certificate.provider);

        const safeDate =
            escapeHTML(certificate.date);


        const article =
            document.createElement('article');

        article.className =
            `credential-item provider-${certificate.category}`;

        article.dataset.provider =
            certificate.category;

        article.dataset.image =
            imagePath;

        article.dataset.title =
            certificate.title;

        article.style.setProperty(
            '--item-index',
            index
        );


        article.setAttribute('role', 'button');

        article.setAttribute('tabindex', '0');

        article.setAttribute(
            'aria-label',
            `View ${certificate.title} certificate`
        );


        article.innerHTML = `

            <!-- CERTIFICATE IMAGE -->

            <div class="credential-paper-shell">


                <div class="credential-document-stage"
                    data-preview-stage>


                    <!-- Image loading state -->

                    <div class="credential-image-loading">

                        <i class="bi bi-image"
                            aria-hidden="true"></i>

                        <span>LOADING CERTIFICATE</span>

                        <span class="preview-loading-line"></span>

                    </div>



                    <!-- Image error state -->

                    <div class="credential-image-error">

                        <i class="bi bi-image-alt"
                            aria-hidden="true"></i>

                        <strong>Image not found</strong>

                        <small>
                            Check the JPG filename in Assets/documents.
                        </small>

                    </div>



                    <!-- Actual JPG image -->

                    <img
                        class="credential-preview-image"
                        src="${safeImagePath}"
                        alt="${safeTitle} certificate"
                        loading="lazy"
                        decoding="async">



                    <!-- Hover indicator -->

                    <div class="credential-image-open-indicator"
                        aria-hidden="true">

                        <span>

                            <i class="bi bi-arrows-angle-expand"></i>

                        </span>

                    </div>


                </div>

            </div>



            <!-- CERTIFICATE DETAILS -->

            <div class="credential-information">


                <div class="credential-information-top">


                    <span class="credential-provider-label">

                        <span class="provider-dot"></span>

                        ${safeProvider}

                    </span>


                    <time class="credential-issue-date">
                        ${safeDate}
                    </time>


                </div>



                <h3>${safeTitle}</h3>


            </div>

        `;


        // Image load: use its actual width-to-height ratio.
        const image =
            article.querySelector('.credential-preview-image');

        const stage =
            article.querySelector('[data-preview-stage]');


        function handleImageLoaded() {

            if (
                !image.naturalWidth ||
                !image.naturalHeight
            ) {
                return;
            }


            stage.style.aspectRatio =
                `${image.naturalWidth} / ${image.naturalHeight}`;


            stage.classList.add('is-loaded');

            stage.classList.remove('has-error');

        }


        image.addEventListener(
            'load',
            handleImageLoaded
        );


        image.addEventListener('error', () => {

            stage.classList.add('has-error');

            stage.classList.remove('is-loaded');

            console.error(
                'CARVE certificate image not found:',
                imagePath
            );

        });


        // Handle images already available from browser cache.
        if (image.complete) {

            if (image.naturalWidth > 0) {
                handleImageLoaded();
            } else {
                stage.classList.add('has-error');
            }

        }


        return article;

    }



    // =====================================
    // 8. GENERATE CERTIFICATE GALLERY
    // =====================================

    const certificateCards = [];


    certificates.forEach((certificate, index) => {

        const card =
            createCertificate(certificate, index);

        certificateCards.push(card);

        gallery.appendChild(card);

    });



    // =====================================
    // 9. CERTIFICATE FILTERING
    // =====================================

    function applyCertificateFilter(category) {

        let visibleCount = 0;


        certificateCards.forEach(card => {

            const matches =
                category === 'all' ||
                card.dataset.provider === category;


            card.hidden = !matches;


            if (matches) {

                visibleCount++;

            }

        });


        // Update selected filter.
        filterButtons.forEach(button => {

            const isActive =
                button.dataset.filter === category;

            button.classList.toggle(
                'active',
                isActive
            );

            button.setAttribute(
                'aria-pressed',
                String(isActive)
            );

        });


        // Update visible certificate count.
        if (totalCount) {

            totalCount.textContent =
                String(visibleCount).padStart(2, '0');

        }


        // Empty state.
        if (emptyMessage) {

            emptyMessage.hidden =
                visibleCount !== 0;

        }

    }



    filterButtons.forEach(button => {

        button.addEventListener('click', () => {

            applyCertificateFilter(
                button.dataset.filter
            );

        });

    });



    // =====================================
    // 10. LARGE CERTIFICATE IMAGE VIEWER
    // =====================================

    const modalElement =
        document.getElementById('credentialViewerModal');

    const modalTitle =
        document.getElementById('credentialViewerTitle');

    const viewerImage =
        document.getElementById('credentialViewerImage');

    const openTab =
        document.getElementById('credentialOpenTab');


    let modalInstance = null;


    if (
        modalElement &&
        window.bootstrap &&
        window.bootstrap.Modal
    ) {

        modalInstance =
            window.bootstrap.Modal.getOrCreateInstance(
                modalElement,
                {
                    backdrop: true,
                    keyboard: true,
                    focus: true
                }
            );

    }



    // -------------------------------------
    // OPEN FULL CERTIFICATE IMAGE
    // -------------------------------------

    function openCertificate(imagePath, title) {

        if (!imagePath || !viewerImage) return;


        // Fallback if Bootstrap modal is unavailable.
        if (!modalInstance) {

            window.open(
                imagePath,
                '_blank',
                'noopener'
            );

            return;

        }


        if (modalTitle) {

            modalTitle.textContent =
                title || 'Certificate';

        }


        if (viewerImage) {

            viewerImage.alt =
                `${title || 'Certificate'} – full image`;

            viewerImage.src =
                imagePath;

        }


        if (openTab) {

            openTab.href =
                imagePath;

        }


        modalInstance.show();

    }



    // -------------------------------------
    // CLICK ANYWHERE ON THE CARD
    // -------------------------------------

    gallery.addEventListener('click', event => {

        const card =
            event.target.closest('.credential-item');

        if (!card) return;


        openCertificate(
            card.dataset.image,
            card.dataset.title
        );

    });



    // -------------------------------------
    // KEYBOARD ACCESSIBILITY
    // -------------------------------------

    gallery.addEventListener('keydown', event => {

        const card =
            event.target.closest('.credential-item');

        if (
            !card ||
            (event.key !== 'Enter' && event.key !== ' ')
        ) {
            return;
        }


        event.preventDefault();


        openCertificate(
            card.dataset.image,
            card.dataset.title
        );

    });



    // -------------------------------------
    // RESET VIEWER WHEN CLOSED
    // -------------------------------------

    if (modalElement && viewerImage) {

        modalElement.addEventListener(
            'hidden.bs.modal',
            () => {

                viewerImage.removeAttribute('src');

                viewerImage.alt = 'Certificate';


                if (modalTitle) {

                    modalTitle.textContent =
                        'Certificate';

                }


                if (openTab) {

                    openTab.href = '#';

                }

            }
        );

    }



    // =====================================
    // 11. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealItems =
        document.querySelectorAll('.credential-reveal');


    const motionPreference =
        window.matchMedia
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

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add('is-visible');

                            observer.unobserve(entry.target);

                        }

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin: '0px 0px -25px 0px'
                }
            );


        revealItems.forEach(item => {

            revealObserver.observe(item);

        });

    }



    // =====================================
    // 12. INITIALIZE PAGE
    // =====================================

    applyCertificateFilter('all');


});
