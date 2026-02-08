/*
  Interactions légères:
  - menu mobile
  - theme toggle (persist)
  - reveal on scroll
  - back-to-top
  - contact feedback (Formspree)
  - secret access (boulanger)
*/

(function () {
  const root = document.documentElement;

  // Theme
  const THEME_KEY = 'sd_theme';
  const themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) applyTheme(storedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // Mobile nav
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    function closeMenu(){
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('open')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Active section highlight
    const links = Array.from(navMenu.querySelectorAll('a'));
    const targets = links
      .map((a) => {
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return null;
        const el = document.querySelector(href);
        return el ? { a, el } : null;
      })
      .filter(Boolean);

    if (targets.length) {
      const secObs = new IntersectionObserver(
        (entries) => {
          let best = null;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          }
          if (!best) return;
          const id = '#' + best.target.id;
          for (const { a } of targets) {
            a.classList.toggle('is-active', (a.getAttribute('href') === id));
          }
        },
        { rootMargin: '-30% 0px -55% 0px', threshold: [0.12, 0.2, 0.35] }
      );

      targets.forEach(({ el }) => secObs.observe(el));
    }
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => obs.observe(el));
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      backToTop.classList.toggle('show', y > 500);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Form feedback
  const form = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  if (form && formFeedback) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formFeedback.textContent = 'Envoi en cours…';

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          form.reset();
          formFeedback.textContent = 'Message envoyé ✅';
        } else {
          formFeedback.textContent = 'Erreur lors de l\'envoi. Réessaie plus tard.';
        }
      } catch {
        formFeedback.textContent = 'Erreur réseau. Réessaie plus tard.';
      }
    });
  }

  // Secret access (content conserved)
  const secretBtn = document.getElementById('secretBtn');
  const secretInput = document.getElementById('secretAnswer');
  const secretFeedback = document.getElementById('secretFeedback');

  function checkSecret() {
    if (!secretInput || !secretFeedback) return;
    const input = (secretInput.value || '').trim().toLowerCase();

    if (input === 'boulanger') {
      secretFeedback.textContent = '✅ Accès autorisé ! Redirection…';
      secretFeedback.style.color = '#baf7c6';
      setTimeout(() => {
        window.location.href = 'secret.html';
      }, 900);
    } else {
      secretFeedback.textContent = '❌ Mauvaise réponse.';
      secretFeedback.style.color = '#ffb3b3';
    }
  }

  if (secretBtn) secretBtn.addEventListener('click', checkSecret);
  if (secretInput) {
    secretInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkSecret();
    });
  }
})();
