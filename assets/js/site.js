/* ══════════════════════════════════════════════════════════════
   AwakerHz — script comune a tutte le pagine
   - Inietta header (nav) e footer condivisi → un solo punto da modificare.
   - Evidenzia il tab attivo in base a <body data-page="...">.
   - Gestisce: scroll nav, menu mobile, switch lingua, card frequenze, newsletter.
   - Eseguito con defer DOPO i18n-data.js e i18n.js.
   ══════════════════════════════════════════════════════════════ */
(function () {

  const YT = 'https://youtube.com/@AwakerHz';

  /* ─────────────── HEADER ─────────────── */
  const NAV_ITEMS = [
    { page: 'home',        href: 'index.html',            key: 'nav.home',        en: 'Home' },
    { page: 'frequencies', href: 'frequencies.html',      key: 'nav.frequencies', en: 'Frequencies' },
    { page: 'books',       href: 'books.html',            key: 'nav.books',       en: 'Books' },
    { page: 'store',       href: 'store.html',            key: 'nav.store',       en: 'Store' },
    { page: 'health',      href: 'health.html',           key: 'nav.health',      en: 'Health & Food' },
    { page: 'hidden',      href: 'hidden-knowledge.html', key: 'nav.hidden',      en: 'Hidden Knowledge' },
    { page: 'about',       href: 'about.html',            key: 'nav.about',       en: 'Manifesto' }
  ];

  function navLinks(cls) {
    return NAV_ITEMS.map(i =>
      `<a class="${cls}" data-page-link="${i.page}" href="${i.href}" data-i18n="${i.key}">${i.en}</a>`
    ).join('');
  }

  function langSwitch(extraCls) {
    return `<div class="lang-switch ${extraCls || ''}">
        <button class="lang-btn" data-lang="it" type="button">IT</button>
        <button class="lang-btn" data-lang="en" type="button">EN</button>
        <button class="lang-btn" data-lang="es" type="button">ES</button>
      </div>`;
  }

  const HEADER = `
    <nav id="mainNav">
      <a href="index.html" class="nav-logo">AWAKERHZ</a>
      <ul class="nav-links">
        ${NAV_ITEMS.map(i => `<li><a data-page-link="${i.page}" href="${i.href}" data-i18n="${i.key}">${i.en}</a></li>`).join('')}
      </ul>
      <div class="nav-right">
        ${langSwitch()}
      </div>
      <button class="nav-ham" type="button" aria-label="Menu" id="navHam">☰</button>
    </nav>
    <div class="nav-mobile" id="mobileMenu">
      ${navLinks('')}
      ${langSwitch('lang-switch-mobile')}
    </div>`;

  const FOOTER = `
    <footer>
      <div class="footer-bar"></div>
      <div class="footer-logo">AWAKERHZ</div>
      <div class="footer-tagline" data-i18n="footer.tagline">Awaken body, mind and consciousness</div>
      <div class="footer-links">
        <a href="${YT}" target="_blank" rel="noopener">YouTube</a>
        <a href="frequencies.html" data-i18n="nav.frequencies">Frequencies</a>
        <a href="books.html" data-i18n="nav.books">Books</a>
        <a href="health.html" data-i18n="nav.health">Health &amp; Food</a>
        <a href="about.html" data-i18n="nav.about">Manifesto</a>
        <a href="mailto:contact@awakerhz.com">contact@awakerhz.com</a>
      </div>
      <div class="footer-copy" data-i18n="footer.copy">© 2025 AwakerHz  ·  awakerhz.com  ·  All rights reserved</div>
    </footer>`;

  /* ─────────────── MOUNT ─────────────── */
  function mount() {
    const h = document.getElementById('site-header');
    const f = document.getElementById('site-footer');
    if (h) h.innerHTML = HEADER;
    if (f) f.innerHTML = FOOTER;

    // tab attivo
    const page = document.body.getAttribute('data-page');
    if (page) {
      document.querySelectorAll('[data-page-link="' + page + '"]').forEach(a => a.classList.add('active'));
    }

    wireNav();
    wireLang();
    wireFreqRows();
    wireSubtabs();
    wireSocials();
    wireNewsletter();
    wireFadeIn();

    if (window.I18n) window.I18n.init();
  }

  /* ─────────────── NAV behaviour ─────────────── */
  function wireNav() {
    const nav = document.getElementById('mainNav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    const ham = document.getElementById('navHam');
    if (ham) ham.addEventListener('click', toggleMenu);

    // chiudi il menu cliccando fuori o su un link
    document.addEventListener('click', e => {
      const menu = document.getElementById('mobileMenu');
      if (!menu) return;
      if (e.target.closest('#mobileMenu a')) { menu.classList.remove('open'); return; }
      if (!e.target.closest('#mobileMenu') && !e.target.closest('#navHam')) menu.classList.remove('open');
    });
  }

  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('open');
  }
  window.navToggle = toggleMenu; // compat

  /* ─────────────── language switch ─────────────── */
  function wireLang() {
    document.addEventListener('click', e => {
      const b = e.target.closest('.lang-btn');
      if (!b) return;
      if (window.I18n) window.I18n.setLang(b.getAttribute('data-lang'));
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
    });
  }

  /* ─────────────── frequency rows: accordion verticale ─────────────── */
  // Altezza esatta calcolata a runtime → niente clipping in nessuna lingua/larghezza.
  function setRowOpen(row, open) {
    const body = row.querySelector('.freq-row-body');
    const head = row.querySelector('.freq-row-head');
    row.classList.toggle('expanded', open);
    if (head) head.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (body) body.style.maxHeight = open ? (body.scrollHeight + 'px') : '0px';
  }

  function recalcOpenRows() {
    document.querySelectorAll('.freq-row.expanded .freq-row-body').forEach(b => {
      b.style.maxHeight = 'none';
      const h = b.scrollHeight;
      b.style.maxHeight = h + 'px';
    });
  }

  // delega: funziona anche per le righe generate dinamicamente (chakra/binaural)
  function wireFreqRows() {
    document.addEventListener('click', (e) => {
      const head = e.target.closest('.freq-row-head');
      if (!head || e.target.closest('a')) return;
      const row = head.closest('.freq-row');
      setRowOpen(row, !row.classList.contains('expanded'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const head = e.target.closest('.freq-row-head');
      if (!head) return;
      e.preventDefault();
      const row = head.closest('.freq-row');
      setRowOpen(row, !row.classList.contains('expanded'));
    });
    // righe aperte staticamente all'avvio
    document.querySelectorAll('.freq-row.expanded').forEach(r => setRowOpen(r, true));
    // dopo un render dinamico o un cambio lingua → ricalcola le righe aperte
    document.addEventListener('content:rendered', () => requestAnimationFrame(recalcOpenRows));
    document.addEventListener('i18n:changed', () => requestAnimationFrame(recalcOpenRows));
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(recalcOpenRows, 150); }, { passive: true });
  }

  // sotto-tab (pills): mostra il pannello corrispondente, scope = genitore della barra
  function wireSubtabs() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.subtab');
      if (!btn) return;
      const bar = btn.closest('.subtabs');
      const scope = bar.parentElement;
      const target = btn.getAttribute('data-target');
      bar.querySelectorAll('.subtab').forEach(b => b.classList.toggle('active', b === btn));
      scope.querySelectorAll('.subpanel').forEach(p => p.classList.toggle('active', p.id === target));
    });
  }

  // link social non ancora configurati (href="#") → non far saltare la pagina
  function wireSocials() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('.hero-social[data-soon]');
      if (a) e.preventDefault();
    });
  }

  /* ─────────────── newsletter (Formspree) ─────────────── */
  function wireNewsletter() {
    const form = document.getElementById('nlForm');
    if (!form) return;
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const label = btn.textContent;
      btn.textContent = '…';
      try {
        const r = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (r.ok) {
          form.style.display = 'none';
          const s = document.getElementById('nlSuccess');
          if (s) s.style.display = 'block';
        } else { btn.textContent = label; }
      } catch { btn.textContent = label; }
    });
  }

  /* ─────────────── fade-in on scroll ─────────────── */
  function wireFadeIn() {
    const els = document.querySelectorAll('.fi');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('vis'); });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }

  /* go */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
