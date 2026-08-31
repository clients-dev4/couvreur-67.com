/* Couvreur 28 - JS minimal.
   Tout le reste (menu, carrousels, chatbox, avis, carte) est en CSS pur. */
(function () {
'use strict';

/* ---------- Lightbox galerie (seul JS conserve : navigation clavier) ---------- */
(function () {
    var lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;

    var content = lightbox.querySelector('.lightbox-media-container');
    var counter = lightbox.querySelector('.lightbox-counter');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');
    var images = document.querySelectorAll('.gallery-image');
    if (!images.length) return;

    // Sources uniques, dans l'ordre d'apparition
    var items = [];
    var seen = Object.create(null);
    images.forEach(function (img) {
        if (!seen[img.src]) { seen[img.src] = true; items.push(img.src); }
    });

    var index = 0;

    function render() {
        var img = new Image();
        img.src = items[index];
        img.alt = 'Realisation en grand';
        img.className = 'lightbox-media';
        content.replaceChildren(img);
        counter.textContent = (index + 1) + ' / ' + items.length;
    }
    function open(i) {
        index = i;
        render();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    function step(d) {
        index = (index + d + items.length) % items.length;
        render();
    }

    // Delegation : un seul listener pour toute la galerie
    var slider = document.getElementById('gallery-slider');
    if (slider) {
        slider.addEventListener('click', function (e) {
            var img = e.target.closest('.gallery-image');
            if (!img) return;
            var i = items.indexOf(img.src);
            if (i >= 0) open(i);
        });
    }

    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', function () { step(1); });
    prevBtn.addEventListener('click', function () { step(-1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'ArrowLeft') step(-1);
    });
})();

/* ---------- Estimateur : charge estimator.js au 1er clic seulement ---------- */
(function () {
    var toggle = document.getElementById('estimator-toggle');
    if (!toggle) return;

    var loading = false;
    toggle.addEventListener('click', function once() {
        if (loading) return;
        loading = true;
        toggle.removeEventListener('click', once);

        var s = document.createElement('script');
        s.src = 'estimator.js';
        s.onload = function () {
            // Le widget vient d'etre construit : on l'ouvre comme si on avait clique.
            var w = document.getElementById('price-estimator');
            if (w) w.classList.add('open');
        };
        document.head.appendChild(s);
    });
})();

})();
