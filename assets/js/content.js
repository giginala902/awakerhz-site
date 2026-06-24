/* ══════════════════════════════════════════════════════════════
   AwakerHz — renderer dei contenuti data-driven
   Legge i JSON multilingua da assets/data/ e costruisce le sezioni
   nella lingua attiva (window.I18n.lang). Si ri-renderizza al cambio lingua.
   Punti di innesto nell'HTML: <div data-content="chakras|binaural|hidden|store|food|books|about"></div>
   Richiede un server (fetch dei JSON): in locale usa http://localhost:8123
   ══════════════════════════════════════════════════════════════ */
(function () {
  const DATA = 'assets/data/';
  const cache = {};

  function lang() { return (window.I18n && window.I18n.lang) || 'en'; }
  function t(o) { if (!o) return ''; return o[lang()] || o.en || o.it || ''; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  async function load(name) {
    if (cache[name]) return cache[name];
    const r = await fetch(DATA + name + '.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('fetch ' + name + ' ' + r.status);
    const j = await r.json();
    cache[name] = j;
    return j;
  }

  function notice(mount, msg) {
    mount.innerHTML = `<div class="notice"><p class="notice-text">${esc(msg)}</p></div>`;
  }

  /* ── riga accordion (condivisa con lo stile Solfeggio) ── */
  function freqRow(o) {
    return `<div class="freq-row ${o.cls || ''}"${o.color ? ` style="--c:${esc(o.color)}"` : ''}>
      <div class="freq-row-head" role="button" tabindex="0" aria-expanded="false">
        <div class="freq-row-hz">${o.hz}</div>
        <div class="freq-row-main">
          <div class="freq-row-name">${esc(o.name)}</div>
          <div class="freq-row-desc">${esc(o.sub)}</div>
        </div>
        <span class="freq-row-chevron" aria-hidden="true"></span>
      </div>
      <div class="freq-row-body"><div class="freq-row-body-inner">
        <div class="freq-row-sep"></div>
        ${o.meta ? `<div class="freq-row-meta">${o.meta}</div>` : ''}
        <p class="freq-row-long">${esc(o.long)}</p>
      </div></div>
    </div>`;
  }

  /* ── riga accordion "info" (hidden / food): icona opzionale, niente colonna Hz ── */
  function infoRow(o) {
    return `<div class="freq-row is-info ${o.cls || ''}">
      <div class="freq-row-head" role="button" tabindex="0" aria-expanded="false">
        ${o.icon ? `<div class="freq-row-ico">${o.icon}</div>` : ''}
        <div class="freq-row-main">
          <div class="freq-row-name">${esc(o.name)}</div>
          ${o.sub ? `<div class="freq-row-desc">${esc(o.sub)}</div>` : ''}
        </div>
        <span class="freq-row-chevron" aria-hidden="true"></span>
      </div>
      <div class="freq-row-body"><div class="freq-row-body-inner">
        <div class="freq-row-sep"></div>
        <p class="freq-row-long">${esc(o.long || o.sub || '')}</p>
      </div></div>
    </div>`;
  }

  /* ── CHAKRA ── */
  async function renderChakras(mount) {
    const d = await load('chakras');
    const rows = d.items.map(c => freqRow({
      cls: 'is-chakra',
      color: c.color,
      hz: `${c.hz}<span class="freq-row-unit">Hz</span>`,
      name: `${t(c.name)} · ${esc(c.sanskrit)}`,
      sub: t(c.short),
      meta: `${esc(t(c.element))} · ${c.hz} Hz`,
      long: t(c.properties)
    })).join('');
    mount.innerHTML = `<p class="cat-intro">${esc(t(d.intro))}</p><div class="freq-list">${rows}</div>`;
  }

  /* ── BINAURAL ── */
  async function renderBinaural(mount) {
    const d = await load('binaural');
    const rows = d.items.map(b => freqRow({
      cls: 'is-binaural',
      color: b.color,
      hz: `<span class="bb-range">${esc(b.range)}</span>`,
      name: esc(b.name),
      sub: t(b.state),
      long: t(b.uses)
    })).join('');
    mount.innerHTML = `<p class="cat-intro">${esc(t(d.intro))}</p><div class="freq-list">${rows}</div>`;
  }

  /* ── HIDDEN KNOWLEDGE ── */
  const ICONS = {
    'flower-of-life': '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="8.8" r="3.2"/><circle cx="12" cy="15.2" r="3.2"/><circle cx="14.8" cy="10.4" r="3.2"/><circle cx="9.2" cy="10.4" r="3.2"/><circle cx="14.8" cy="13.6" r="3.2"/><circle cx="9.2" cy="13.6" r="3.2"/>',
    'eye': '<path d="M2.5 12C4.5 8 8 6 12 6s7.5 2 9.5 6c-2 4-5.5 6-9.5 6S4.5 16 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    'pyramid': '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 3v17M2.5 20 12 13l9.5 7"/>',
    'spiral': '<path d="M12 12a2 2 0 1 1 2 2 4 4 0 0 1-6-2 6.5 6.5 0 0 1 11-4.5"/>',
    'atom': '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>',
    'moon': '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
    'wave': '<path d="M2 12c2.5 0 2.5-5 5-5s2.5 10 5 10 2.5-10 5-10 2.5 5 5 5"/>',
    'key': '<circle cx="8" cy="8" r="4"/><path d="M11 11l9 9M16 16l2-2M19 19l2-2"/>',
    'star': '<path d="M12 3l2.6 5.6L21 9.3l-4.5 4.2L17.8 21 12 17.6 6.2 21l1.3-7.5L3 9.3l6.4-.7L12 3Z"/>'
  };
  function iconSvg(key) {
    const body = ICONS[key] || ICONS['star'];
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  async function renderHidden(mount) {
    const d = await load('hidden');
    const rows = d.topics.map(tp => infoRow({
      cls: 'is-topic',
      icon: iconSvg(tp.icon),
      name: t(tp.title),
      sub: t(tp.blurb),
      long: t(tp.long)
    })).join('');
    mount.innerHTML = `<p class="cat-intro">${esc(t(d.intro))}</p><div class="freq-list">${rows}</div>`;
  }

  /* ── VIDEOS (Caricamenti Recenti, auto da videos.json: miniatura cliccabile -> YouTube) ── */
  async function renderVideos(mount) {
    let d;
    try { d = await load('videos'); } catch (e) { mount.innerHTML = ''; return; }
    const vids = (d && d.videos) || [];
    if (!vids.length) { mount.innerHTML = ''; return; }
    mount.innerHTML = vids.map(function (v) {
      const tag = v.hz ? '<span class="video-tag">' + esc(v.hz) + '</span> ' : '';
      return '<a class="video-card fi" href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;display:block">'
        + '<div class="video-thumb" style="position:relative;aspect-ratio:16/9;overflow:hidden">'
        + '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="' + esc(v.title) + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">'
        + '<span aria-hidden="true" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(7,7,20,.25)"><span style="width:54px;height:54px;border-radius:50%;background:rgba(124,58,237,.92);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span></span>'
        + '</div>'
        + '<div class="video-info"><div class="video-title">' + esc(v.title) + '</div>'
        + '<div class="video-meta">' + tag + '<span>' + esc(v.duration || '') + '</span></div></div>'
        + '</a>';
    }).join('');
  }

  /* ── topics accordion generico (sleep / focus) ── */
  async function renderTopics(mount, name) {
    const d = await load(name);
    const rows = d.topics.map(tp => infoRow({
      cls: 'is-topic',
      icon: iconSvg(tp.icon),
      name: t(tp.title),
      sub: t(tp.blurb),
      long: t(tp.long)
    })).join('');
    mount.innerHTML = `<p class="cat-intro">${esc(t(d.intro))}</p><div class="freq-list">${rows}</div>`;
  }

  /* ── TABBED (store / food / books) ── */
  function cardProduct(p) {
    return `<div class="content-card">
      <div class="cc-media"><div class="cc-ph">✦</div></div>
      <div class="cc-body">
        <h3 class="cc-title">${esc(t(p.name))}</h3>
        <p class="cc-text">${esc(t(p.desc))}</p>
        <div class="cc-foot"><span class="cc-price">${esc(p.price || '')}</span><span class="cc-link">${esc(soon())}</span></div>
      </div></div>`;
  }
  function cardFood(it) {
    return infoRow({ cls: 'is-food', name: t(it.name), sub: t(it.desc), long: t(it.long) });
  }
  function cardBook(b) {
    return `<div class="content-card">
      <div class="cc-body">
        <div class="cc-kicker">${esc(b.author || '')}</div>
        <h3 class="cc-title">${esc(b.title || '')}</h3>
        <p class="cc-text">${esc(t(b.why))}</p>
      </div></div>`;
  }
  function soon() {
    return { it: 'In arrivo', en: 'Coming soon', es: 'Próximamente' }[lang()] || 'Coming soon';
  }

  async function renderTabbed(mount, name, cardFn, opts) {
    const d = await load(name);
    const secs = d.sections;
    const ids = secs.map((s, i) => `tab-${name}-${i}`);
    const bar = secs.map((s, i) =>
      `<button class="subtab${i === 0 ? ' active' : ''}" data-target="${ids[i]}" type="button">${esc(t(s.title))}</button>`
    ).join('');
    const rowsMode = !!(opts && opts.rows);
    const panels = secs.map((s, i) => {
      const items = (s.products || s.items || s.books || []);
      const inner = items.map(cardFn).join('');
      return `<div class="subpanel${i === 0 ? ' active' : ''}" id="${ids[i]}">
        <p class="cat-intro">${esc(t(s.intro))}</p>
        <div class="${rowsMode ? 'freq-list' : 'card-grid'}">${inner}</div>
      </div>`;
    }).join('');
    const disclaimer = (opts && opts.disclaimer && d.disclaimer)
      ? `<p class="content-disclaimer">${esc(t(d.disclaimer))}</p>` : '';
    mount.innerHTML = `<div class="subtabs" role="tablist">${bar}</div><div class="subpanels">${panels}</div>${disclaimer}`;
  }

  /* ── ABOUT (Cos'è AwakerHz) ── */
  async function renderAbout(mount) {
    const d = await load('about');
    const paras = (d.paragraphs || []).map(p => `<p class="about-p">${esc(t(p))}</p>`).join('');
    const values = (d.values || []).map(v => `
      <div class="value-card">
        <h3 class="value-title">${esc(t(v.title))}</h3>
        <p class="value-text">${esc(t(v.text))}</p>
      </div>`).join('');
    mount.innerHTML = `
      <p class="about-lead">${esc(t(d.lead))}</p>
      ${paras}
      <div class="about-mission">
        <div class="about-mission-label">${esc({ it: 'La Missione', en: 'The Mission', es: 'La Misión' }[lang()] || 'The Mission')}</div>
        <p class="about-p">${esc(t(d.mission))}</p>
      </div>
      <div class="values-grid">${values}</div>`;
  }

  const RENDERERS = {
    chakras: renderChakras,
    binaural: renderBinaural,
    hidden: renderHidden,
    videos: renderVideos,
    sleep: (m) => renderTopics(m, 'sleep'),
    focus: (m) => renderTopics(m, 'focus'),
    about: renderAbout,
    store: (m) => renderTabbed(m, 'store', cardProduct),
    food: (m) => renderTabbed(m, 'food', cardFood, { disclaimer: true, rows: true }),
    books: (m) => renderTabbed(m, 'books', cardBook)
  };

  async function renderAll() {
    const mounts = document.querySelectorAll('[data-content]');
    for (const m of mounts) {
      const kind = m.getAttribute('data-content');
      const fn = RENDERERS[kind];
      if (!fn) continue;
      try { await fn(m); }
      catch (e) {
        notice(m, 'Per vedere questa sezione servi il sito da un server locale (es. http://localhost:8123) — il caricamento dei contenuti non funziona aprendo il file direttamente.');
      }
    }
    // ripristina il pannello attivo dopo un re-render (cambio lingua)
    document.dispatchEvent(new CustomEvent('content:rendered'));
  }

  // render iniziale + ad ogni cambio lingua (l'evento parte da I18n.init in site.js)
  if (!document.querySelector('[data-content]')) return;
  document.addEventListener('i18n:changed', renderAll);
  // se per qualche motivo i18n non parte, render di sicurezza al load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { if (!window.I18n) renderAll(); });
  } else if (!window.I18n) {
    renderAll();
  }
})();
