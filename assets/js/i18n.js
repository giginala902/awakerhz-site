/* ══════════════════════════════════════════════════════════════
   AwakerHz — motore di traduzione (i18n)
   - L'inglese è il testo già presente nell'HTML (baseline + SEO).
   - IT/ES arrivano da i18n-data.js (window.I18N).
   - Marca gli elementi con:
       data-i18n="chiave"       → traduce textContent
       data-i18n-html="chiave"  → traduce innerHTML (per testo con markup)
       data-i18n-ph="chiave"    → traduce l'attributo placeholder
   - La scelta lingua è salvata in localStorage.
   ══════════════════════════════════════════════════════════════ */
(function () {
  const SUPPORTED = ['en', 'it', 'es'];
  const STORE_KEY = 'awaker_lang';
  let current = 'en';

  function dict(lang) {
    return (window.I18N && window.I18N[lang]) || {};
  }

  // Salva la versione inglese originale la prima volta che incontriamo l'elemento.
  function snapshot(el) {
    if (el.hasAttribute('data-i18n') && el._en === undefined) el._en = el.textContent;
    if (el.hasAttribute('data-i18n-html') && el._enHtml === undefined) el._enHtml = el.innerHTML;
    if (el.hasAttribute('data-i18n-ph') && el._enPh === undefined) el._enPh = el.getAttribute('placeholder') || '';
  }

  function applyTo(el, lang) {
    snapshot(el);
    const d = dict(lang);

    if (el.hasAttribute('data-i18n')) {
      const k = el.getAttribute('data-i18n');
      el.textContent = (lang === 'en') ? el._en : (d[k] != null ? d[k] : el._en);
    }
    if (el.hasAttribute('data-i18n-html')) {
      const k = el.getAttribute('data-i18n-html');
      el.innerHTML = (lang === 'en') ? el._enHtml : (d[k] != null ? d[k] : el._enHtml);
    }
    if (el.hasAttribute('data-i18n-ph')) {
      const k = el.getAttribute('data-i18n-ph');
      el.setAttribute('placeholder', (lang === 'en') ? el._enPh : (d[k] != null ? d[k] : el._enPh));
    }
  }

  function apply(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    current = lang;

    document.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-ph]')
      .forEach(el => applyTo(el, lang));

    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  function detect() {
    let saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : 'en';
  }

  window.I18n = {
    init() { apply(detect()); },
    setLang(l) { apply(l); },
    apply,
    get lang() { return current; },
    SUPPORTED
  };
})();
