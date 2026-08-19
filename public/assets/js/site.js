/**
 * Site interactions — plain JS, no jQuery.
 * Replaces: slicknav (mobile nav), jquery.sticky (sticky header),
 * scrollUp (back-to-top), slick (testimonial carousel),
 * ion.rangeSlider (price filter), nice-select (native <select> is used as-is).
 * Every block below guards on the element existing, so this file is safe
 * to load on every page even though not every page has every feature.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initStickyHeader();
        initBackToTop();
        initTestimonialCarousel();
        initPriceRangeSlider();
    });

    // ---- Mobile nav: clones the desktop menu into a slide-in panel ----
    function initMobileNav() {
        var toggle = document.getElementById('navToggle');
        var panel = document.getElementById('mobileNav');
        var source = document.getElementById('navigation');
        if (!toggle || !panel || !source) return;

        panel.innerHTML = source.innerHTML;

        toggle.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('is-open');
            toggle.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close the panel after a link is tapped.
        panel.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') !== '#') {
                panel.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---- Sticky header: adds the theme's existing .sticky-bar.sticky classes on scroll ----
    function initStickyHeader() {
        var header = document.querySelector('.header-sticky');
        if (!header) return;
        var threshold = 120;

        function onScroll() {
            var stuck = window.scrollY > threshold;
            header.classList.toggle('sticky-bar', stuck);
            header.classList.toggle('sticky', stuck);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ---- Back to top button ----
    function initBackToTop() {
        var btn = document.getElementById('scrollUp');
        if (!btn) return;

        function toggle() {
            btn.style.display = window.scrollY > 300 ? 'block' : 'none';
        }
        toggle();
        window.addEventListener('scroll', toggle, { passive: true });

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Testimonial carousel: one slide visible at a time + dots + arrows ----
    function initTestimonialCarousel() {
        var roots = document.querySelectorAll('.h1-testimonial-active');
        roots.forEach(function (root) {
            var slides = Array.prototype.slice.call(root.querySelectorAll('.single-testimonial'));
            if (slides.length < 2) return; // nothing to rotate

            var current = 0;

            var dotsList = document.createElement('ul');
            dotsList.className = 'slick-dots';
            var dots = slides.map(function (_, i) {
                var li = document.createElement('li');
                var button = document.createElement('button');
                button.type = 'button';
                button.addEventListener('click', function () {
                    show(i);
                });
                li.appendChild(button);
                dotsList.appendChild(li);
                return li;
            });
            root.appendChild(dotsList);

            var prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'slick-arrow slick-prev';
            prevBtn.textContent = 'Previous';
            prevBtn.addEventListener('click', function () {
                show(current - 1);
            });

            var nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'slick-arrow slick-next';
            nextBtn.textContent = 'Next';
            nextBtn.addEventListener('click', function () {
                show(current + 1);
            });

            root.appendChild(prevBtn);
            root.appendChild(nextBtn);

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('slick-active', i === current);
                });
            }

            show(0);
        });
    }

    // ---- Dual-thumb price range slider (native <input type="range"> pair) ----
    function initPriceRangeSlider() {
        var wrappers = document.querySelectorAll('[data-price-range]');
        wrappers.forEach(function (wrapper) {
            var minInput = wrapper.querySelector('.price-range-min');
            var maxInput = wrapper.querySelector('.price-range-max');
            var fromDisplay = wrapper.querySelector('.price-value-from');
            var toDisplay = wrapper.querySelector('.price-value-to');
            if (!minInput || !maxInput) return;

            function update() {
                var minVal = parseInt(minInput.value, 10);
                var maxVal = parseInt(maxInput.value, 10);
                if (minVal > maxVal) {
                    // keep the two thumbs from crossing
                    [minInput.value, maxInput.value] = [maxVal, minVal];
                    minVal = parseInt(minInput.value, 10);
                    maxVal = parseInt(maxInput.value, 10);
                }
                if (fromDisplay) fromDisplay.value = minVal;
                if (toDisplay) toDisplay.value = maxVal;
            }

            minInput.addEventListener('input', update);
            maxInput.addEventListener('input', update);
            update();
        });
    }
})();
