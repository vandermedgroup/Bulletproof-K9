/* ============================================================================
   BULLETPROOF K9 — shared site JS
   Nav scroll state · mobile menu · reveal-on-scroll · hero parallax · footer year
   Loaded with `defer` on every page. All lookups are null-guarded so a page can
   safely omit any one of these elements.
   ============================================================================ */
(function () {
  'use strict';

  // footer year
  var yr = document.getElementById('yr');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  // nav background on scroll
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // mobile menu
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1160) setMenu(false); });
  }

  // hero image: paint first, animate after (fixes blank hero on first load)
  var heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    var startZoom = function () { heroImg.classList.add('zoom'); };
    var pre = new Image();
    pre.src = 'images/real-7.jpg';
    if (pre.decode) { pre.decode().then(startZoom).catch(startZoom); }
    else if (pre.complete) { startZoom(); }
    else { pre.onload = startZoom; pre.onerror = startZoom; }
  }

  // reveal on scroll (with light stagger for grouped items)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var sibs = Array.prototype.slice.call(e.target.parentNode.children).filter(function (n) {
            return n.classList && n.classList.contains('reveal');
          });
          var idx = sibs.indexOf(e.target);
          e.target.style.transitionDelay = (idx > 0 ? Math.min(idx, 5) * 0.08 : 0) + 's';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // subtle hero parallax
    var heroBg = document.getElementById('heroBg');
    if (heroBg) {
      var raf = false;
      window.addEventListener('scroll', function () {
        if (raf) return; raf = true;
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight) { heroBg.style.transform = 'translateY(' + (y * 0.12) + 'px)'; }
          raf = false;
        });
      }, { passive: true });
    }
  }
})();
