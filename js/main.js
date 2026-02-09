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

  // Toast (optional)
  const toastEl = document.getElementById('toast');
  const toastTitle = document.getElementById('toastTitle');
  const toastSub = document.getElementById('toastSub');
  function toast(title, sub=''){
    if (!toastEl || !toastTitle || !toastSub) return;
    toastTitle.textContent = title;
    toastSub.textContent = sub;
    toastEl.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // Theme
  const THEME_KEY = 'sd_theme';
  const themeBtn = document.getElementById('themeToggle');
  const themeBtn2 = document.getElementById('themeToggle2');

  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) applyTheme(storedTheme);

  function toggleTheme(){
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  if (themeBtn) themeBtn.addEventListener('click', () => { toggleTheme(); toast('Thème', root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'); });
  if (themeBtn2) themeBtn2.addEventListener('click', () => { toggleTheme(); toast('Thème', root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'); });

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

    // immediate reveal above the fold
    requestAnimationFrame(() => {
      for (const el of revealEls) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) {
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      }
    });
  }

  // Footer year
  const yearNow = document.getElementById('yearNow');
  if (yearNow) yearNow.textContent = String(new Date().getFullYear());

  // Scroll progress
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const p = Math.max(0, Math.min(1, (doc.scrollTop || window.scrollY || 0) / max));
      scrollProgress.style.width = (p * 100).toFixed(2) + '%';
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
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
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formFeedback.textContent = 'Envoi en cours…';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi…';
      }

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
          toast('Message envoyé', 'Merci');
        } else {
          formFeedback.textContent = 'Erreur lors de l\'envoi. Réessaie plus tard.';
          toast('Erreur', 'Envoi impossible');
        }
      } catch {
        formFeedback.textContent = 'Erreur réseau. Réessaie plus tard.';
        toast('Erreur réseau', 'Réessaie plus tard');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer';
        }
      }
    });
  }

  // Command palette (Ctrl+K)
  function ensurePalette(){
    let el = document.getElementById('cmdPalette');
    if (el) return el;

    el = document.createElement('div');
    el.className = 'palette';
    el.id = 'cmdPalette';
    el.innerHTML = `
      <div class="palette__panel" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="palette__top">
          <input class="palette__input" id="cmdInput" placeholder="Rechercher une action…" autocomplete="off" />
          <div class="palette__hint">Esc</div>
        </div>
        <div class="palette__list" id="cmdList"></div>
      </div>
    `;

    el.addEventListener('click', (e) => {
      if (e.target === el) hidePalette();
    });

    document.body.appendChild(el);
    return el;
  }

  function buildActions(){
    const actions = [];

    // anchors from nav if present
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.querySelectorAll('a[href^="#"]').forEach((a) => {
        const href = a.getAttribute('href');
        const label = a.textContent.trim();
        if (!href || !label) return;
        actions.push({ label, meta: 'Section', kind: 'hash', value: href });
      });
    }

    // common actions
    actions.push({ label: 'Ouvrir GitHub', meta: 'Lien', kind: 'url', value: 'https://github.com/SonFire03' });
    actions.push({ label: 'Recruiter view (10s)', meta: 'Page', kind: 'path', value: 'recruiter.html' });
    actions.push({ label: 'Ouvrir Certifications', meta: 'Page', kind: 'path', value: 'projet/certif/certifications.html' });
    actions.push({ label: 'Ouvrir Progress', meta: 'Page', kind: 'path', value: 'projet/timeline/index.html' });

    const cv = document.querySelector('a[href$="CV_Sofiane_Dehimi.pdf"], a[href*="CV_Sofiane_Dehimi.pdf"]');
    if (cv) actions.push({ label: 'Télécharger CV (PDF)', meta: 'Fichier', kind: 'url', value: cv.getAttribute('href') });

    return actions;
  }

  function showPalette(){
    const el = ensurePalette();
    el.classList.add('show');
    const input = document.getElementById('cmdInput');
    const list = document.getElementById('cmdList');

    window.__cmdActions = buildActions();
    window.__cmdIndex = 0;

    function render(){
      const q = (input.value || '').trim().toLowerCase();
      const all = window.__cmdActions || [];
      const items = all.filter(a => !q || (a.label + ' ' + a.meta).toLowerCase().includes(q));
      window.__cmdFiltered = items;
      if (window.__cmdIndex >= items.length) window.__cmdIndex = Math.max(0, items.length - 1);

      list.innerHTML = '';
      items.forEach((a, i) => {
        const div = document.createElement('div');
        div.className = 'palette__item';
        div.setAttribute('role','option');
        div.setAttribute('aria-selected', i === window.__cmdIndex ? 'true' : 'false');
        div.innerHTML = `<div><div class="palette__label"></div><div class="palette__meta"></div></div><div class="palette__meta">↵</div>`;
        div.querySelector('.palette__label').textContent = a.label;
        div.querySelectorAll('.palette__meta')[0].textContent = a.meta;
        div.addEventListener('click', () => runAction(i));
        list.appendChild(div);
      });
    }

    function runAction(idx){
      const items = window.__cmdFiltered || [];
      const a = items[idx];
      if (!a) return;
      hidePalette();
      if (a.kind === 'hash') {
        window.location.hash = a.value;
        return;
      }
      if (a.kind === 'path') {
        const base = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname.replace(/\/[^/]*$/, '/');
        // if already in /projet/..., base handles relative; simplest: use absolute from site root
        window.location.href = '/' + (a.value || '');
        return;
      }
      window.open(a.value, '_blank', 'noreferrer');
    }

    function onKey(e){
      if (e.key === 'Escape') { e.preventDefault(); hidePalette(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); window.__cmdIndex = Math.min((window.__cmdIndex||0)+1, (window.__cmdFiltered||[]).length-1); render(); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); window.__cmdIndex = Math.max((window.__cmdIndex||0)-1, 0); render(); return; }
      if (e.key === 'Enter') { e.preventDefault(); runAction(window.__cmdIndex||0); return; }
    }

    window.__cmdRender = render;
    window.__cmdOnKey = onKey;

    input.oninput = render;
    document.addEventListener('keydown', onKey);
    input.focus();
    input.select();
    render();
  }

  function hidePalette(){
    const el = document.getElementById('cmdPalette');
    if (el) el.classList.remove('show');
    const input = document.getElementById('cmdInput');
    if (input) input.value = '';
    if (window.__cmdOnKey) document.removeEventListener('keydown', window.__cmdOnKey);
    window.__cmdOnKey = null;
  }

  const openPaletteBtn = document.getElementById('openPalette');
  if (openPaletteBtn) openPaletteBtn.addEventListener('click', showPalette);

  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      showPalette();
    }
  });

  // Certifications page: filter + search
  const certFilters = document.getElementById('certFilters');
  const certSearch = document.getElementById('certSearch');
  const certCount = document.getElementById('certCount');
  const certCards = Array.from(document.querySelectorAll('.cert[data-source][data-title]'));

  if (certCards.length && (certFilters || certSearch)) {
    let filter = 'all';

    const setPressed = () => {
      if (!certFilters) return;
      certFilters.querySelectorAll('button[data-filter]').forEach((b) => {
        const v = b.getAttribute('data-filter');
        b.setAttribute('aria-pressed', v === filter ? 'true' : 'false');
      });
    };

    const apply = () => {
      const q = (certSearch?.value || '').trim().toLowerCase();
      let visible = 0;

      for (const c of certCards) {
        const src = (c.getAttribute('data-source') || '');
        const title = (c.getAttribute('data-title') || '').toLowerCase();
        const matchFilter = (filter === 'all') || (src === filter);
        const matchQuery = !q || title.includes(q);
        const ok = matchFilter && matchQuery;
        c.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      }

      if (certCount) certCount.textContent = `${visible} / ${certCards.length}`;
    };

    if (certFilters) {
      certFilters.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]');
        if (!btn) return;
        filter = btn.getAttribute('data-filter') || 'all';
        setPressed();
        apply();
      });
    }

    if (certSearch) {
      certSearch.addEventListener('input', apply);
    }

    setPressed();
    apply();
  }

  // Copy links
  async function copyText(btn, text, okLabel, toastTitle, toastSub){
    if (!btn || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = okLabel;
      toast(toastTitle, toastSub);
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch {
      // ignore
    }
  }

  const copyGithub = document.getElementById('copyGithub');
  if (copyGithub) {
    copyGithub.addEventListener('click', () =>
      copyText(copyGithub, 'https://github.com/SonFire03', 'Copié ✅', 'Copié', 'Lien GitHub')
    );
  }

  const copyPortfolio = document.getElementById('copyPortfolio');
  if (copyPortfolio) {
    copyPortfolio.addEventListener('click', () =>
      copyText(copyPortfolio, 'https://sonfire03.github.io/mon-site/', 'Copié ✅', 'Copié', 'Lien portfolio')
    );
  }

  const copyRecruiter = document.getElementById('copyRecruiter');
  if (copyRecruiter) {
    copyRecruiter.addEventListener('click', () =>
      copyText(copyRecruiter, 'https://sonfire03.github.io/mon-site/recruiter.html', 'Copié ✅', 'Copié', 'Recruiter view')
    );
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
