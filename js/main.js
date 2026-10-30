(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Dynamic footer year ── */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ── Theme toggle ── */
  var root = document.documentElement;
  var themeBtn = document.querySelector('[data-theme-toggle]');
  var themeMeta = document.getElementById('theme-color-meta');
  var storedTheme = null;

  try {
    storedTheme = localStorage.getItem('theme');
  } catch (e) {}

  function isDark() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyThemeMeta(dark) {
    if (themeMeta) {
      themeMeta.setAttribute('content', dark ? '#111318' : '#f4f3ef');
    }
  }

  applyThemeMeta(isDark());

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      themeBtn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      applyThemeMeta(next === 'dark');
    });

    if (storedTheme === 'dark' || storedTheme === 'light') {
      themeBtn.setAttribute(
        'aria-label',
        storedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    } else {
      themeBtn.setAttribute(
        'aria-label',
        isDark() ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  /* ── Mobile navigation ── */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    var desktopQuery = window.matchMedia('(min-width: 721px)');

    function setMenuOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    function isMenuOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    toggle.addEventListener('click', function () {
      setMenuOpen(!isMenuOpen());
    });

    menu.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isMenuOpen()) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (!isMenuOpen()) return;
      var t = event.target;
      if (toggle.contains(t) || menu.contains(t)) return;
      setMenuOpen(false);
    });

    function onDesktopChange(event) {
      if (event.matches) setMenuOpen(false);
    }

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', onDesktopChange);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(onDesktopChange);
    }
  }

  /* ── Section reveals ── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (revealEls.length) {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-in');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }
  }
})();
