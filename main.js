! function(o, c) {
    var n = c.documentElement,
        t = " w-mod-";
    n.className += t + "js", ("ontouchstart" in o || o.DocumentTouch && c instanceof DocumentTouch) && (n.className += t + "touch")
}(window, document);
(function() {
    var trigger = document.getElementById('products-trigger');
    var dropdown = document.getElementById('products-dropdown');
    if (!trigger || !dropdown) return;
    var icon = document.getElementById('products-icon');
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        var open = dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open);
        icon.textContent = open ? '\u2212' : '+';
    });
    document.addEventListener('click', function() {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        if (icon) icon.textContent = '+';
    });
})();
function switchLaptopTab(tabId) {
    var tabs = document.querySelectorAll('.laptop-tab');
    var panes = document.querySelectorAll('.laptop-tab-pane');
    tabs.forEach(function(b) { b.classList.remove('is-active'); });
    panes.forEach(function(p) {
        p.classList.toggle('is-active', p.getAttribute('data-pane') === tabId);
    });
    var activeBtn = document.querySelector('.laptop-tab[data-tab="' + tabId + '"]');
    if (activeBtn) activeBtn.classList.add('is-active');
}
(function() {
    var tabs = document.querySelectorAll('.laptop-tab');
    var panes = document.querySelectorAll('.laptop-tab-pane');
    tabs.forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchLaptopTab(btn.getAttribute('data-tab'));
        });
    });
})();
(function() {
    var dropdown = document.getElementById('products-dropdown');
    var trigger = document.getElementById('products-trigger');
    var icon = document.getElementById('products-icon');
    document.querySelectorAll('.nav-product-link').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var tabId = link.getAttribute('data-nav-tab');
            if (dropdown) dropdown.classList.remove('is-open');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            if (icon) icon.textContent = '+';
            document.getElementById('laptop-demo').scrollIntoView({ behavior: 'smooth' });
            switchLaptopTab(tabId);
        });
    });
})();

(function() {
    var items = document.querySelectorAll('.solutions-list-item');
    var imgEl = document.getElementById('solutions-illustration-img');
    if (!imgEl || !items.length) return;
    items.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            items.forEach(function(i) { i.classList.remove('solutions-list-item-featured'); });
            item.classList.add('solutions-list-item-featured');
            var src = item.getAttribute('data-solution-image');
            if (src) {
                imgEl.style.opacity = '0';
                setTimeout(function() {
                    imgEl.src = src;
                    imgEl.alt = item.querySelector('.solutions-list-title').textContent;
                    imgEl.style.opacity = '1';
                }, 120);
            }
        });
    });
})();

(function() {
    var track = document.getElementById('testimonial-track');
    var paginationEl = document.getElementById('testimonial-pagination');
    if (!track) return;
    var cards = track.querySelectorAll('.testimonial-card');
    var totalCards = cards.length;
    if (totalCards === 0) return;
    var gap = 24;
    var currentIndex = 0;
    var cardWidth = 0;
    var step = 0;
    function getVisible() {
        var w = window.innerWidth;
        return w > 991 ? 3 : w > 767 ? 2 : 1;
    }
    function getMaxIndex() { return Math.max(0, totalCards - getVisible()); }
    var maxIndex = getMaxIndex();
    function getStep() {
        if (cards[0]) {
            var rect = cards[0].getBoundingClientRect();
            cardWidth = rect.width;
            step = cardWidth + gap;
        }
    }
    function setTransform(idx) {
        getStep();
        track.style.transform = 'translate3d(-' + (idx * step) + 'px, 0, 0)';
    }
    function updatePagination() {
        if (!paginationEl) return;
        maxIndex = getMaxIndex();
        var dots = paginationEl.querySelectorAll('.testimonial-dot');
        var dotCount = dots.length;
        var dotIndex = maxIndex <= 0 ? 0 : (dotCount > 1 ? Math.min(dotCount - 1, Math.round((currentIndex / maxIndex) * (dotCount - 1))) : 0);
        dots.forEach(function(d, i) { d.classList.toggle('is-active', i === dotIndex); });
    }
    if (paginationEl) {
        var dotCount = Math.min(10, Math.max(1, totalCards));
        for (var d = 0; d < dotCount; d++) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonial-dot' + (d === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (d + 1));
            dot.addEventListener('click', function() {
                var i = parseInt(this.getAttribute('data-index'), 10);
                maxIndex = getMaxIndex();
                currentIndex = maxIndex <= 0 ? 0 : (dotCount > 1 ? Math.round((i / (dotCount - 1)) * maxIndex) : 0);
                setTransform(currentIndex);
                updatePagination();
                startAutoplay();
            });
            dot.setAttribute('data-index', String(d));
            paginationEl.appendChild(dot);
        }
    }
    var prevBtn = document.querySelector('.testimonial-prev');
    var nextBtn = document.querySelector('.testimonial-next');
    var autoplayInterval = 5000;
    var autoplayTimer;
    function startAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(function() {
            maxIndex = getMaxIndex();
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            setTransform(currentIndex);
            updatePagination();
        }, autoplayInterval);
    }
    if (prevBtn) prevBtn.addEventListener('click', function() {
        maxIndex = getMaxIndex();
        currentIndex = Math.max(0, currentIndex - 1);
        setTransform(currentIndex);
        updatePagination();
        startAutoplay();
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
        maxIndex = getMaxIndex();
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        setTransform(currentIndex);
        updatePagination();
        startAutoplay();
    });
    track.querySelectorAll('.testimonial-card-play').forEach(function(playBtn) {
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var card = this.closest('.testimonial-card-video');
            if (!card) return;
            // Play icon responds to click but no video is played (placeholder for future video)
            this.classList.add('testimonial-play-clicked');
            var btn = this;
            setTimeout(function() { btn.classList.remove('testimonial-play-clicked'); }, 300);
        });
    });
    function go() { maxIndex = getMaxIndex(); currentIndex = Math.min(currentIndex, maxIndex); setTransform(currentIndex); updatePagination(); }
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
    window.addEventListener('resize', function() { getStep(); maxIndex = getMaxIndex(); currentIndex = Math.min(currentIndex, maxIndex); setTransform(currentIndex); updatePagination(); });
    startAutoplay();
})();

(function() {
    var form = document.getElementById('aboutus-demo-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
})();

(function() {
    var list = document.getElementById('pricing-faq-list');
    if (!list) return;
    var items = list.querySelectorAll('.pricing-faq-item');
    items.forEach(function(item) {
        var btn = item.querySelector('.pricing-faq-question');
        var chevron = item.querySelector('.pricing-faq-chevron');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var isOpen = item.classList.contains('is-open');
            items.forEach(function(i) {
                i.classList.remove('is-open');
                var q = i.querySelector('.pricing-faq-question');
                var ch = i.querySelector('.pricing-faq-chevron');
                if (q) q.setAttribute('aria-expanded', 'false');
                if (ch) ch.textContent = '\u25B6';
            });
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
                if (chevron) chevron.textContent = '\u25BC';
            }
        });
    });
})();

(function() {
    var form = document.getElementById('pricing-demo-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
})();

(function() {
    function initOpModelCarousel() {
        var section = document.querySelector('.op-model-section');
        if (!section) return;
        var cardsEl = document.getElementById('op-model-cards');
        var cards = section.querySelectorAll('.op-model-card');
        var dots = section.querySelectorAll('.op-model-dot');
        var progressBar = document.getElementById('op-model-progress-bar');
        var dotsViewport = document.getElementById('op-model-dots-viewport');
        var total = cards.length;
        var current = 0;
        var interval = 5000;
        var dotWidth = 48;
        function scrollDotsViewport(idx) {
            if (!dotsViewport || !dots.length) return;
            var maxScroll = dotsViewport.scrollWidth - dotsViewport.clientWidth;
            if (maxScroll <= 0) return;
            var scrollPos = Math.min(maxScroll, Math.max(0, (idx - 2) * dotWidth));
            dotsViewport.scrollTo({ left: scrollPos, behavior: 'smooth' });
        }
        function scrollToCard(idx) {
            var card = cards[idx];
            if (card && cardsEl) {
                var scrollOffset = (card.offsetLeft + card.offsetWidth / 2) - (cardsEl.clientWidth / 2);
                cardsEl.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
            }
        }
        function goTo(step) {
            current = (step + total) % total;
            cards.forEach(function(c, i) {
                c.classList.toggle('op-model-card-active', i === current);
            });
            dots.forEach(function(d, i) {
                d.classList.toggle('op-model-dot-active', i === current);
            });
            scrollToCard(current);
            scrollDotsViewport(current);
            if (progressBar && dots.length > 0) {
                progressBar.style.left = '18px';
                var lineWidth = current > 0 ? (current * dotWidth) : 0;
                progressBar.style.width = lineWidth + 'px';
            }
        }
        var timer = setInterval(function() {
            goTo(current + 1);
        }, interval);
        dots.forEach(function(dot, i) {
            dot.addEventListener('click', function() {
                goTo(i);
                clearInterval(timer);
                timer = setInterval(function() { goTo(current + 1); }, interval);
            });
        });
        window.addEventListener('resize', function() { goTo(current); });
        goTo(0);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOpModelCarousel);
    } else {
        initOpModelCarousel();
    }
})();

(function() {
    function initPricingShowMore() {
        var section = document.getElementById('pricing-table-section');
        var btn = document.querySelector('.pricing-show-more');
        if (section && btn) {
            btn.addEventListener('click', function() {
                var expanded = section.classList.toggle('is-expanded');
                btn.textContent = expanded ? 'Show Less' : 'Show More';
            });
        }
        document.querySelectorAll('.pricing-mobile-show-more').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var card = this.closest('.pricing-mobile-card');
                if (!card) return;
                var expanded = card.classList.toggle('is-expanded');
                this.textContent = expanded ? 'Show Less' : 'Show More';
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPricingShowMore);
    } else {
        initPricingShowMore();
    }
})();
