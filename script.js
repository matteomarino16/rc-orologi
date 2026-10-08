/* ==========================================================================
   RC OROLOGI — script.js
   JavaScript vanilla. Librerie opzionali via CDN: Lenis (smooth scroll),
   Three.js + RoomEnvironment + GLTFLoader (scena 3D in home).
   Ogni libreria è facoltativa: se non viene caricata il sito funziona comunque.
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURAZIONE
     ------------------------------------------------------------------------ */
  const CONFIG = {
    whatsapp: '393314187649',
    // Per sostituire l'orologio procedurale con un modello reale:
    // 1) inserire il file in assets/watch.glb  2) impostare enabled: true
    // (il caricamento di file .glb richiede che il sito sia servito da un web server, non da file://)
    watchModel: { enabled: false, url: 'assets/watch.glb', size: 2.4 }
  };

  /* ------------------------------------------------------------------------
     CATALOGO PRODOTTI
     Struttura pensata per essere sostituita da un database / CMS:
     basta popolare questo array (es. con fetch('/api/products')) e richiamare
     initShowcase() / renderCatalog().
     ------------------------------------------------------------------------ */
  const products = [
    {
      id: 'rolex-daytona-126500ln',
      brand: 'Rolex',
      model: 'Cosmograph Daytona',
      reference: '126500LN',
      year: '2023',
      condition: 'Ottime condizioni',
      diameter: '40 mm',
      material: 'Acciaio Oystersteel, quadrante bianco, lunetta Cerachrom',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia internazionale Rolex',
      price: 29500,
      images: ['assets/watches/rolex-daytona-panda.jpg'],
      category: 'Rolex',
      tag: 'Nuovo arrivo',
      featured: true,
      added: '2026-10-01',
      description: 'La Daytona in acciaio con quadrante bianco e calibro 4131. Bracciale Oyster, nessun segno rilevante.'
    },
    {
      id: 'rolex-daytona-126515ln',
      brand: 'Rolex',
      model: 'Cosmograph Daytona',
      reference: '126515LN',
      year: '2024',
      condition: 'Come nuovo',
      diameter: '40 mm',
      material: 'Oro Everose 18 ct, cinturino Oysterflex',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia internazionale Rolex + 12 mesi RC Orologi',
      price: 43000,
      images: ['assets/watches/rolex-daytona-everose.jpg'],
      category: 'Rolex',
      tag: '',
      featured: true,
      added: '2026-09-21',
      description: 'Il cronografo per eccellenza in oro Everose, lunetta in Cerachrom nera.'
    },
    {
      id: 'rolex-deepsea-136660',
      brand: 'Rolex',
      model: 'Deepsea “D-Blue”',
      reference: '136660',
      year: '2023',
      condition: 'Come nuovo',
      diameter: '44 mm',
      material: 'Acciaio Oystersteel e titanio RLX',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia internazionale Rolex',
      price: 14900,
      images: ['assets/watches/rolex-deepsea.jpg'],
      category: 'Rolex',
      tag: '',
      featured: true,
      added: '2026-09-12',
      description: 'Il quadrante sfumato blu-nero dedicato alle esplorazioni degli abissi. Impermeabile fino a 3.900 metri.'
    },
    {
      id: 'rolex-datejust-126334',
      brand: 'Rolex',
      model: 'Datejust 41',
      reference: '126334',
      year: '2022',
      condition: 'Ottime condizioni',
      diameter: '41 mm',
      material: 'Rolesor bianco, lunetta zigrinata in oro bianco, Jubilee',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia internazionale Rolex',
      price: 12400,
      images: ['assets/watches/rolex-datejust-41.jpg'],
      category: 'Rolex',
      tag: '',
      featured: false,
      added: '2026-08-20',
      description: 'Il classico per eccellenza, con bracciale Jubilee e quadrante grigio ardesia.'
    },
    {
      id: 'rolex-explorer-224270',
      brand: 'Rolex',
      model: 'Explorer 40',
      reference: '224270',
      year: '2023',
      condition: 'Come nuovo',
      diameter: '40 mm',
      material: 'Acciaio Oystersteel',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia internazionale Rolex',
      price: 8400,
      images: ['assets/watches/rolex-explorer.jpg'],
      category: 'Rolex',
      tag: '',
      featured: false,
      added: '2026-07-30',
      description: 'Il quadrante nero con i numeri 3, 6 e 9: essenziale e leggibile, nella nuova cassa da 40 mm.'
    },
    {
      id: 'tudor-bb58-79030n',
      brand: 'Tudor',
      model: 'Black Bay Fifty-Eight',
      reference: 'M79030N-0001',
      year: '2022',
      condition: 'Ottime condizioni',
      diameter: '39 mm',
      material: 'Acciaio, dettagli dorati',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia Tudor 5 anni',
      price: 3350,
      images: ['assets/watches/tudor-bb58.jpg'],
      category: 'Tudor',
      tag: '',
      featured: true,
      added: '2026-09-18',
      description: 'Proporzioni vintage e calibro manifattura MT5402. Uno dei Tudor più amati.'
    },
    {
      id: 'omega-speedmaster-dsotm',
      brand: 'Omega',
      model: 'Speedmaster “Dark Side of the Moon”',
      reference: '311.92.44.51.01.007',
      year: '2021',
      condition: 'Ottime condizioni',
      diameter: '44,25 mm',
      material: 'Ceramica nera',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia Omega',
      price: 8900,
      images: ['assets/watches/omega-speedmaster-moon.jpg'],
      category: 'Omega',
      tag: '',
      featured: true,
      added: '2026-09-05',
      description: 'Lo Speedmaster interamente in ceramica nera, con calibro Co-Axial 9300.'
    },
    {
      id: 'omega-aqua-terra-150',
      brand: 'Omega',
      model: 'Seamaster Aqua Terra 150M',
      reference: '220.10.41.21.01.001',
      year: '2020',
      condition: 'Ottime condizioni',
      diameter: '41 mm',
      material: 'Acciaio, quadrante nero a doghe',
      box: 'Full set: scatola e garanzia',
      warranty: '12 mesi RC Orologi',
      price: 4600,
      images: ['assets/watches/omega-aqua-terra.jpg'],
      category: 'Omega',
      tag: '',
      featured: false,
      added: '2026-08-02',
      description: 'Master Chronometer certificato METAS, quadrante ispirato ai ponti delle barche a vela.'
    },
    {
      id: 'omega-seamaster-300m',
      brand: 'Omega',
      model: 'Seamaster Professional 300M',
      reference: '2220.80.00',
      year: '2008',
      condition: 'Buone condizioni',
      diameter: '41 mm',
      material: 'Acciaio, quadrante blu “onde”',
      box: 'Solo scatola',
      warranty: '12 mesi RC Orologi',
      price: 2900,
      images: ['assets/watches/omega-seamaster-300.jpg'],
      category: 'Omega',
      tag: '',
      featured: false,
      added: '2026-06-18',
      description: 'La referenza resa celebre dal cinema, con quadrante a onde e lunetta blu. Revisionato.'
    },
    {
      id: 'cartier-santos-wssa0039',
      brand: 'Cartier',
      model: 'Santos de Cartier Large',
      reference: 'WSSA0039',
      year: '2023',
      condition: 'Come nuovo',
      diameter: '39,8 mm',
      material: 'Acciaio, sistema QuickSwitch',
      box: 'Full set: scatola e garanzia',
      warranty: 'Garanzia Cartier',
      price: 8500,
      images: ['assets/watches/cartier-santos.jpg'],
      category: 'Cartier',
      tag: '',
      featured: true,
      added: '2026-09-10',
      description: 'L’icona quadrata di Cartier, con bracciale e cinturino intercambiabili.'
    },
    {
      id: 'cartier-roadster-chrono',
      brand: 'Cartier',
      model: 'Roadster Chronograph',
      reference: 'W62019X6',
      year: '2008',
      condition: 'Buone condizioni',
      diameter: '43 mm',
      material: 'Acciaio',
      box: 'Solo garanzia',
      warranty: '12 mesi RC Orologi',
      price: 5200,
      images: ['assets/watches/cartier-roadster.jpg'],
      category: 'Cartier',
      tag: '',
      featured: false,
      added: '2026-07-12',
      description: 'Cassa a tonneau e lente d’ingrandimento sul datario: un Cartier dal carattere sportivo.'
    },
    {
      id: 'zenith-chronomaster-sport',
      brand: 'Zenith',
      model: 'Chronomaster Sport',
      reference: '03.3100.3600/21.M3100',
      year: '2022',
      condition: 'Ottime condizioni',
      diameter: '41 mm',
      material: 'Acciaio, lunetta in ceramica',
      box: 'Full set: scatola e garanzia',
      warranty: '12 mesi RC Orologi',
      price: 10900,
      images: ['assets/watches/zenith-chronomaster-black.jpg'],
      category: 'Altri',
      tag: '',
      featured: false,
      added: '2026-07-28',
      description: 'Calibro El Primero 3600 con misurazione al decimo di secondo.'
    }
  ];

  /* ------------------------------------------------------------------------
     UTILITY
     ------------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smoothstep = t => t * t * (3 - 2 * t);

  const priceFormatter = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 });
  const formatPrice = p => (typeof p === 'number' ? `€ ${priceFormatter.format(p)}` : 'Prezzo su richiesta');
  const productName = p => `${p.brand} ${p.model}`;
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const root = document.documentElement;
  const body = document.body;
  const page = body.dataset.page;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isSmallScreen = () => window.innerWidth < 900;

  root.classList.add('js');

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let scrollY = window.scrollY;

  /* ------------------------------------------------------------------------
     SMOOTH SCROLL (Lenis, facoltativo)
     ------------------------------------------------------------------------ */
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
  }

  const headerOffset = () => (isSmallScreen() ? 62 : 68);

  function scrollToTarget(target, immediate = false) {
    let top;
    if (target === 0 || target === 'top') top = 0;
    else if (target instanceof Element) {
      if (target.id === 'top') top = 0;
      else if (target.id === 'collezione-3d') top = target.getBoundingClientRect().top + window.scrollY;
      else top = target.getBoundingClientRect().top + window.scrollY - headerOffset() + 1;
    } else return;

    if (lenis) lenis.scrollTo(top, { duration: immediate ? 0 : 1.6, immediate });
    else window.scrollTo({ top, behavior: immediate || prefersReducedMotion ? 'auto' : 'smooth' });
  }

  // Link interni (#ancora oppure pagina.html#ancora sulla stessa pagina)
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href*="#"]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = url.hash === '#top' ? $('#top') || 0 : document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    if (target && target.classList && target.classList.contains('drawer')) { openDrawer(); return; }
    scrollToTarget(target || 0);
  });

  /* ------------------------------------------------------------------------
     HEADER & MENU
     ------------------------------------------------------------------------ */
  const header = $('#siteHeader');
  const menuToggle = $('.menu-toggle');
  const menu = $('#mobileMenu');

  function openMenu() {
    body.classList.add('menu-open', 'is-locked');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Chiudi il menu');
    menu.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    setTimeout(() => { const first = $('a', menu); if (first) first.focus({ preventScroll: true }); }, 400);
  }
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open', 'is-locked');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Apri il menu');
    menu.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => (body.classList.contains('menu-open') ? closeMenu() : openMenu()));
    $$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (!isSmallScreen()) closeMenu(); });
  }

  /* ------------------------------------------------------------------------
     LOGO HERO → HEADER (solo home)
     Il logo è un unico elemento fixed: la sua posizione/scala viene interpolata
     tra il segnaposto nell'hero e lo slot del logo nell'header.
     ------------------------------------------------------------------------ */
  const flyLogo = $('#flyLogo');
  const heroSlot = $('#heroLogoSlot');
  const headerLogoImg = $('.site-header__logo img');
  const heroContent = $('.hero__content');
  const heroCue = $('.hero__cue');

  const fly = { start: null, progress: 0, displayed: 0 };

  function measureFly() {
    if (!flyLogo || !heroSlot) return;
    const r = heroSlot.getBoundingClientRect();
    // Il contenuto dell'hero ha un translate di parallax (scrollY * 0.25): lo compensiamo
    const shift = window.scrollY * 0.25;
    fly.start = { x: r.left, y: r.top + window.scrollY - shift, w: r.width };
    flyLogo.style.width = `${r.width}px`;
  }

  function updateFly() {
    if (!flyLogo || !fly.start) return;
    // Fase di "attesa": il logo resta grande per i primi pixel di scroll
    const hold = vh * 0.04;
    const range = vh * (isSmallScreen() ? 0.55 : 0.7);
    fly.progress = clamp((scrollY - hold) / range);
    fly.displayed = prefersReducedMotion ? fly.progress : lerp(fly.displayed, fly.progress, 0.14);
    if (Math.abs(fly.displayed - fly.progress) < 0.0005) fly.displayed = fly.progress;

    const e = easeInOutCubic(fly.displayed);
    const end = headerLogoImg.getBoundingClientRect();
    // Prima del trasferimento il logo scorre leggermente con la pagina (effetto "sollevato")
    const startY = fly.start.y - Math.min(scrollY, hold + range) * 0.35;
    const x = lerp(fly.start.x, end.left, e);
    const y = lerp(startY, end.top, e);
    const scale = lerp(fly.start.w, end.width, e) / fly.start.w;
    flyLogo.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

    header.classList.toggle('is-scrolled', fly.displayed > 0.82);

    // Testi dell'hero si dissolvono mentre il logo viene "portato via"
    const fade = clamp(scrollY / (vh * 0.3));
    if (heroContent) {
      heroContent.style.opacity = (1 - fade).toFixed(3);
      heroContent.style.transform = `translate3d(0, ${(scrollY * 0.25).toFixed(1)}px, 0)`;
    }
    if (heroCue) heroCue.style.opacity = (1 - clamp(scrollY / (vh * 0.15))).toFixed(3);
  }

  function updateHeaderSimple() {
    header.classList.toggle('is-scrolled', scrollY > 40);
  }

  /* ------------------------------------------------------------------------
     TESTI "SPLIT" E REVEAL ALLO SCROLL
     ------------------------------------------------------------------------ */
  function splitText(el) {
    if (el.dataset.splitDone) return;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words
      .map((w, i) => `<span class="split-word" aria-hidden="true"><span style="--i:${i}">${escapeHTML(w)}</span></span>`)
      .join(' ');
    el.dataset.splitDone = '1';
  }

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })
    : null;

  function setupReveals(scope = document) {
    $$('[data-split]', scope).forEach(splitText);
    // Stagger automatico tra elementi fratelli
    const groups = new Map();
    $$('[data-reveal]', scope).forEach(el => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach(list => list.forEach((el, i) => el.style.setProperty('--d', `${Math.min(i * 0.09, 0.6)}s`)));

    const targets = $$('[data-reveal], [data-split]', scope).filter(el => !el.classList.contains('is-in'));
    if (!revealObserver || prefersReducedMotion) {
      targets.forEach(el => el.classList.add('is-in'));
      return;
    }
    targets.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     PARALLAX
     ------------------------------------------------------------------------ */
  const parallaxItems = new Set();
  const parallaxObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(en => (en.isIntersecting ? parallaxItems.add(en.target) : parallaxItems.delete(en.target)));
      }, { rootMargin: '20% 0px' })
    : null;

  if (!prefersReducedMotion && parallaxObserver) {
    $$('[data-parallax]').forEach(el => parallaxObserver.observe(el.parentElement));
  }

  function updateParallax() {
    parallaxItems.forEach(parent => {
      const el = parent.querySelector(':scope > [data-parallax]');
      if (!el) return;
      const factor = parseFloat(el.dataset.parallax) || 0;
      const r = parent.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - vh / 2) * -factor;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }

  /* ------------------------------------------------------------------------
     CURSORE CUSTOM (solo desktop)
     ------------------------------------------------------------------------ */
  const cursor = $('.cursor');
  const cur = { x: vw / 2, y: vh / 2, rx: vw / 2, ry: vh / 2, active: false };

  if (cursor && finePointer && !prefersReducedMotion) {
    root.classList.add('has-cursor');
    const dot = $('.cursor__dot', cursor);
    const ring = $('.cursor__ring', cursor);
    const label = $('.cursor__label', cursor);
    cursor.classList.add('is-hidden');

    window.addEventListener('mousemove', e => {
      cur.x = e.clientX; cur.y = e.clientY;
      if (!cur.active) { cur.rx = cur.x; cur.ry = cur.y; cur.active = true; }
      cursor.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));

    document.addEventListener('mouseover', e => {
      const view = e.target.closest('[data-cursor="view"]');
      const interactive = e.target.closest('a, button, select, label, [role="button"], .service');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hover', !view && !!interactive);
      label.textContent = view ? (view.dataset.cursorLabel || 'Scopri') : '';
    });

    cur.render = () => {
      cur.rx = lerp(cur.rx, cur.x, 0.18);
      cur.ry = lerp(cur.ry, cur.y, 0.18);
      dot.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      ring.style.transform = `translate3d(${cur.rx.toFixed(1)}px, ${cur.ry.toFixed(1)}px, 0)`;
    };
  }

  /* ------------------------------------------------------------------------
     CARD PRODOTTO
     ------------------------------------------------------------------------ */
  function cardHTML(p, i, withReveal) {
    const img = p.images[0];
    return `
      <article class="card" style="--i:${i}" ${withReveal ? 'data-reveal' : ''}>
        <div class="card__media">
          <img src="${escapeHTML(img)}" alt="${escapeHTML(productName(p))} referenza ${escapeHTML(p.reference)}" loading="lazy" decoding="async" width="1000" height="1250">
          ${p.tag ? `<span class="card__tag">${escapeHTML(p.tag)}</span>` : ''}
          <div class="card__overlay" aria-hidden="true">
            <span>${escapeHTML(p.condition)} · ${escapeHTML(p.diameter)}</span>
            <span class="card__cta">Scopri</span>
          </div>
        </div>
        <div class="card__info">
          <p class="card__brand">${escapeHTML(p.brand)}</p>
          <h3 class="card__model">${escapeHTML(p.model)}</h3>
          <p class="card__price">${formatPrice(p.price)}</p>
          <p class="card__meta">${escapeHTML(p.reference)} · ${escapeHTML(p.year)}</p>
        </div>
        <button class="card__open" type="button" data-product="${escapeHTML(p.id)}" data-cursor="view" data-cursor-label="Scopri"
          aria-label="Scopri ${escapeHTML(productName(p))}, referenza ${escapeHTML(p.reference)}, ${escapeHTML(p.year)}, ${escapeHTML(p.condition)}, ${formatPrice(p.price)}"></button>
      </article>`;
  }

  /* --- Riga "lotto" (elenco in stile casa d'aste) --- */
  function lotHTML(p, i) {
    const n = String(i + 1).padStart(2, '0');
    return `
      <li class="lot" style="--i:${i}">
        <span class="lot__thumb"><img src="${escapeHTML(p.images[0])}" alt="" loading="lazy" decoding="async"></span>
        <span class="lot__n">${n}</span>
        <span class="lot__brand">${escapeHTML(p.brand)}</span>
        <span class="lot__model">${escapeHTML(p.model)}<small>${escapeHTML(p.condition)}</small><small class="lot__mref">${escapeHTML(p.reference)} · ${escapeHTML(p.year)}</small></span>
        <span class="lot__ref">${escapeHTML(p.reference)}</span>
        <span class="lot__year">${escapeHTML(p.year)}</span>
        <span class="lot__price">${formatPrice(p.price)}</span>
        <svg class="lot__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>
        <button class="lot__open" type="button" data-product="${escapeHTML(p.id)}" data-preview="${escapeHTML(p.images[0])}" data-cursor="view" data-cursor-label="Scopri"
          aria-label="${escapeHTML(productName(p))}, referenza ${escapeHTML(p.reference)}, ${escapeHTML(p.year)}, ${escapeHTML(p.condition)}, ${formatPrice(p.price)}"></button>
      </li>`;
  }

  /* --- Home: collezione a scorrimento orizzontale --- */
  const showcase = { section: $('.showcase'), track: $('#showcaseTrack'), bar: $('#showcaseBar'), dist: 0, top: 0, x: 0 };

  function slideHTML(p) {
    return `
      <article class="slide">
        <div class="slide__media">
          <img src="${escapeHTML(p.images[0])}" alt="${escapeHTML(productName(p))} referenza ${escapeHTML(p.reference)}" loading="lazy" decoding="async">
          ${p.tag ? `<span class="slide__tag">${escapeHTML(p.tag)}</span>` : ''}
        </div>
        <div class="slide__info">
          <p class="slide__brand">${escapeHTML(p.brand)}</p>
          <h3 class="slide__model">${escapeHTML(p.model)}</h3>
          <p class="slide__price">${formatPrice(p.price)}</p>
          <p class="slide__meta">${escapeHTML(p.reference)} · ${escapeHTML(p.year)} · ${escapeHTML(p.condition)}</p>
        </div>
        <button class="slide__open" type="button" data-product="${escapeHTML(p.id)}" data-cursor="view" data-cursor-label="Scopri"
          aria-label="Scopri ${escapeHTML(productName(p))}, referenza ${escapeHTML(p.reference)}, ${formatPrice(p.price)}"></button>
      </article>`;
  }

  function initShowcase() {
    if (!showcase.track) return;
    const list = [...products]
      .sort((a, b) => (b.featured - a.featured) || (new Date(b.added) - new Date(a.added)))
      .slice(0, 8);
    $('.showcase__end', showcase.track).insertAdjacentHTML('beforebegin', list.map(slideHTML).join(''));
    const count = $('#showcaseCount');
    if (count) count.textContent = String(products.length);
    measureShowcase();
    window.addEventListener('resize', measureShowcase);
    window.addEventListener('load', measureShowcase);
  }

  // Su desktop la sezione viene "allungata" quanto serve per far scorrere la fila in orizzontale
  function measureShowcase() {
    if (!showcase.section) return;
    // Su mobile il titolo sta sopra il carosello; su desktop è la prima "slide" della fila
    const intro = $('.showcase__intro');
    if (intro) {
      if (isSmallScreen() && intro.parentElement === showcase.track) { showcase.track.before(intro); showcase.track.scrollLeft = 0; }
      else if (!isSmallScreen() && intro.parentElement !== showcase.track) showcase.track.prepend(intro);
    }
    if (isSmallScreen()) { showcase.section.style.height = ''; showcase.dist = 0; showcase.track.style.transform = ''; return; }
    showcase.dist = Math.max(0, showcase.track.scrollWidth - window.innerWidth);
    showcase.section.style.height = `${showcase.dist + window.innerHeight}px`;
    showcase.top = showcase.section.getBoundingClientRect().top + window.scrollY;
  }

  function updateShowcase() {
    if (!showcase.section || !showcase.dist) return;
    const p = clamp((scrollY - showcase.top) / showcase.dist);
    const target = -p * showcase.dist;
    showcase.x = prefersReducedMotion ? target : lerp(showcase.x, target, 0.12);
    showcase.track.style.transform = `translate3d(${showcase.x.toFixed(1)}px, 0, 0)`;
    if (showcase.bar) showcase.bar.style.transform = `scaleX(${p.toFixed(4)})`;
  }

  /* --- Anteprima foto che segue il cursore sopra l'elenco --- */
  const preview = { el: null, img: null, x: 0, y: 0, cx: 0, cy: 0, on: false };
  function initLotPreview() {
    if (!finePointer || prefersReducedMotion || !$('.lots')) return;
    preview.el = document.createElement('div');
    preview.el.className = 'lot-preview';
    preview.el.setAttribute('aria-hidden', 'true');
    preview.img = document.createElement('img');
    preview.img.alt = '';
    preview.el.appendChild(preview.img);
    body.appendChild(preview.el);

    document.addEventListener('mousemove', e => {
      preview.x = e.clientX; preview.y = e.clientY;
      const hit = e.target.closest('.lot__open');
      if (hit) {
        if (!preview.on) { preview.cx = preview.x; preview.cy = preview.y; }
        if (preview.img.getAttribute('src') !== hit.dataset.preview) preview.img.src = hit.dataset.preview;
        preview.on = true;
      } else preview.on = false;
      preview.el.classList.toggle('is-visible', preview.on);
    }, { passive: true });
    window.addEventListener('scroll', () => { if (preview.on) { preview.on = false; preview.el.classList.remove('is-visible'); } }, { passive: true });

    preview.render = () => {
      preview.cx = lerp(preview.cx, preview.x, 0.16);
      preview.cy = lerp(preview.cy, preview.y, 0.16);
      // l'immagine sta a sinistra del cursore, centrata in verticale
      preview.el.style.transform = `translate3d(${(preview.cx - 260).toFixed(1)}px, ${(preview.cy - 144).toFixed(1)}px, 0)`;
    };
  }

  /* --- Servizi: lo sfondo cambia con il servizio selezionato --- */
  function initServices() {
    const tabs = $$('.sx__tab');
    if (!tabs.length) return;
    const imgs = $$('.sx__bg img');
    const panels = $$('.sx__panel');
    let current = 0;
    const select = (idx, focus) => {
      if (idx === current && !focus) return;
      current = idx;
      tabs.forEach((t, i) => {
        const on = i === idx;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      imgs.forEach((im, i) => im.classList.toggle('is-active', i === idx));
      panels.forEach((p, i) => { p.hidden = i !== idx; p.classList.toggle('is-active', i === idx); });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      if (finePointer) t.addEventListener('mouseenter', () => select(i));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  }

  /* --- Pagina prodotti: filtri e ordinamento --- */
  const catalog = { filter: 'all', sort: 'recent', view: 'grid' };

  function getCatalogList() {
    const list = products.filter(p => catalog.filter === 'all' || p.category === catalog.filter);
    const byPrice = p => (typeof p.price === 'number' ? p.price : Infinity);
    switch (catalog.sort) {
      case 'price-asc': return list.sort((a, b) => byPrice(a) - byPrice(b));
      case 'price-desc': return list.sort((a, b) => byPrice(b) - byPrice(a));
      default: return list.sort((a, b) => new Date(b.added) - new Date(a.added));
    }
  }

  function renderCatalog() {
    const grid = $('#productGrid');
    if (!grid) return;
    const list = getCatalogList();
    const lotList = $('#productList');
    const asList = catalog.view === 'list' && lotList;
    grid.hidden = !!asList;
    if (lotList) lotList.hidden = !asList;
    if (asList) { lotList.innerHTML = list.map(lotHTML).join(''); grid.innerHTML = ''; }
    else { grid.innerHTML = list.map((p, i) => cardHTML(p, i, false)).join(''); if (lotList) lotList.innerHTML = ''; }
    const count = $('#resultsCount');
    if (count) count.textContent = `${list.length} ${list.length === 1 ? 'orologio disponibile' : 'orologi disponibili'}`;
    $('#emptyState').hidden = list.length > 0;
  }

  function initCatalog() {
    const filters = $('#filters');
    if (!filters) return;

    // Conteggi per categoria
    $$('.filter', filters).forEach(btn => {
      const f = btn.dataset.filter;
      const n = f === 'all' ? products.length : products.filter(p => p.category === f).length;
      $('sup', btn).textContent = n;
    });

    // Filtro iniziale da URL (?marca=rolex)
    const fromUrl = new URLSearchParams(location.search).get('marca');
    if (fromUrl) {
      const match = $$('.filter', filters).find(b => b.dataset.filter.toLowerCase() === fromUrl.toLowerCase());
      if (match) catalog.filter = match.dataset.filter;
    }

    const setActive = () => $$('.filter', filters).forEach(b => {
      const on = b.dataset.filter === catalog.filter;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    filters.addEventListener('click', e => {
      const btn = e.target.closest('.filter');
      if (!btn || btn.dataset.filter === catalog.filter) return;
      catalog.filter = btn.dataset.filter;
      setActive();
      renderCatalog();
      const url = new URL(location.href);
      if (catalog.filter === 'all') url.searchParams.delete('marca');
      else url.searchParams.set('marca', catalog.filter.toLowerCase());
      history.replaceState(null, '', url);
    });

    const sortSelect = $('#sortSelect');
    sortSelect.addEventListener('change', () => { catalog.sort = sortSelect.value; renderCatalog(); });

    // Vista griglia / elenco (ricordata nel browser)
    try { if (localStorage.getItem('rc-view') === 'list') catalog.view = 'list'; } catch (_) { /* storage non disponibile */ }
    const viewBtns = $$('[data-view]');
    const syncView = () => viewBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === catalog.view)));
    viewBtns.forEach(b => b.addEventListener('click', () => {
      if (catalog.view === b.dataset.view) return;
      catalog.view = b.dataset.view;
      try { localStorage.setItem('rc-view', catalog.view); } catch (_) { /* ignora */ }
      syncView();
      renderCatalog();
    }));
    syncView();

    setActive();
    renderCatalog();
  }

  /* ------------------------------------------------------------------------
     MODAL DETTAGLIO PRODOTTO
     ------------------------------------------------------------------------ */
  const modal = $('#productModal');
  const modalBody = $('#modalBody');
  let lastFocus = null;

  function productDetailHTML(p) {
    const waText = encodeURIComponent(`Buongiorno RC Orologi, vorrei informazioni su ${productName(p)} ref. ${p.reference}.`);
    const thumbs = p.images.length > 1
      ? `<div class="pd__thumbs">${p.images.map((src, i) => `
          <button class="pd__thumb ${i === 0 ? 'is-active' : ''}" type="button" data-src="${escapeHTML(src)}" aria-label="Immagine ${i + 1} di ${p.images.length}">
            <img src="${escapeHTML(src)}" alt="" loading="lazy" decoding="async">
          </button>`).join('')}</div>`
      : '';
    const specs = [
      ['Marca', p.brand],
      ['Modello', p.model],
      ['Referenza', p.reference],
      ['Anno', p.year],
      ['Diametro', p.diameter],
      ['Materiale', p.material],
      ['Condizioni', p.condition],
      ['Corredo', p.box],
      ['Garanzia', p.warranty]
    ].filter(([, v]) => v);

    return `
      <div class="pd">
        <div class="pd__gallery">
          <div class="pd__main"><img id="pdMainImg" src="${escapeHTML(p.images[0])}" alt="${escapeHTML(productName(p))}" decoding="async"></div>
          ${thumbs}
        </div>
        <div class="pd__info">
          <p class="pd__brand">${escapeHTML(p.brand)}</p>
          <h2 class="pd__title" id="modalTitle">${escapeHTML(p.model)}</h2>
          <p class="pd__ref">Ref. ${escapeHTML(p.reference)} · ${escapeHTML(p.year)}</p>
          <p class="pd__price">${formatPrice(p.price)}<small>IVA inclusa · Disponibile in boutique</small></p>
          ${p.description ? `<p class="pd__desc">${escapeHTML(p.description)}</p>` : ''}
          <dl class="pd__specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHTML(v)}</dd></div>`).join('')}</dl>
          <div class="pd__actions">
            <button class="btn btn--dark" type="button" data-inquire="${escapeHTML(p.id)}"><span>Richiedi informazioni</span></button>
            <a class="btn pd__wa" href="https://wa.me/${CONFIG.whatsapp}?text=${waText}" target="_blank" rel="noopener"><span>WhatsApp</span></a>
          </div>
        </div>
      </div>`;
  }

  function openProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p || !modal) return;
    lastFocus = document.activeElement;
    modalBody.innerHTML = productDetailHTML(p);
    modal.hidden = false;
    body.classList.add('is-locked');
    if (lenis) lenis.stop();
    $('.modal__panel', modal).scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    setTimeout(() => $('.modal__close', modal).focus({ preventScroll: true }), 60);
  }

  function closeProduct(restoreFocus = true) {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    body.classList.remove('is-locked');
    if (lenis) lenis.start();
    setTimeout(() => { modal.hidden = true; modalBody.innerHTML = ''; }, prefersReducedMotion ? 0 : 650);
    if (restoreFocus && lastFocus) lastFocus.focus({ preventScroll: true });
  }

  if (modal) {
    document.addEventListener('click', e => {
      const opener = e.target.closest('[data-product]');
      if (opener) { openProduct(opener.dataset.product); return; }
      if (e.target.closest('[data-close]') && !modal.hidden) { closeProduct(); return; }
      const thumb = e.target.closest('.pd__thumb');
      if (thumb) {
        const main = $('#pdMainImg');
        main.style.opacity = 0;
        setTimeout(() => { main.src = thumb.dataset.src; main.style.opacity = 1; }, 200);
        $$('.pd__thumb', modal).forEach(t => t.classList.toggle('is-active', t === thumb));
        return;
      }
      const inquire = e.target.closest('[data-inquire]');
      if (inquire) {
        const p = products.find(x => x.id === inquire.dataset.inquire);
        closeProduct(false);
        prefillInquiry(p);
      }
    });

    document.addEventListener('keydown', e => {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeProduct();
      if (e.key === 'Tab') {
        // Focus trap
        const focusables = $$('button, a[href], input, select, textarea', modal).filter(el => !el.disabled && el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------------
     FORM RICHIESTA INFORMAZIONI
     ------------------------------------------------------------------------ */
  const form = $('#inquiryForm');

  function prefillInquiry(p) {
    const watchInput = $('#f-watch');
    if (watchInput && p) {
      watchInput.value = `${productName(p)} — Ref. ${p.reference}`;
      const msg = $('#f-msg');
      if (msg && !msg.value) msg.value = `Buongiorno, vorrei ricevere maggiori informazioni su questo orologio.`;
    }
    setTimeout(openDrawer, 350);
  }

  /* ------------------------------------------------------------------------
     PANNELLO LATERALE "RICHIEDI INFORMAZIONI"
     ------------------------------------------------------------------------ */
  const drawer = $('#richiesta.drawer');
  let drawerLastFocus = null;

  function openDrawer() {
    if (!drawer || !drawer.hidden) return;
    drawerLastFocus = document.activeElement;
    drawer.hidden = false;
    body.classList.add('is-locked');
    if (lenis) lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.classList.add('is-open')));
    setTimeout(() => { const f = $('#f-name'); if (f) f.focus({ preventScroll: true }); }, 500);
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    body.classList.remove('is-locked');
    if (lenis) lenis.start();
    setTimeout(() => { drawer.hidden = true; }, prefersReducedMotion ? 0 : 700);
    if (drawerLastFocus) drawerLastFocus.focus({ preventScroll: true });
  }
  if (drawer) {
    drawer.addEventListener('click', e => { if (e.target.closest('[data-drawer-close]')) closeDrawer(); });
    document.addEventListener('keydown', e => {
      if (drawer.hidden) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        const f = $$('button, a[href], input, textarea, select', drawer).filter(el => !el.disabled && el.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    if (location.hash === '#richiesta') setTimeout(openDrawer, 600);
  }

  /**
   * Punto di integrazione backend: sostituire con fetch verso il proprio endpoint
   * (es. Formspree, Netlify Forms, API PHP). Deve restituire una Promise.
   */
  function sendInquiry(data) {
    return new Promise(resolve => setTimeout(() => resolve({ ok: true, data }), 1200));
  }

  if (form) {
    const fields = {
      name: { el: $('#f-name', form), validate: v => (v.trim().length >= 3 && /\p{L}/u.test(v) ? '' : 'Inserisci nome e cognome.') },
      email: { el: $('#f-email', form), validate: v => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Inserisci un indirizzo email valido.') },
      phone: {
        el: $('#f-phone', form),
        validate: v => {
          if (!v.trim()) return '';
          const digits = v.replace(/\D/g, '');
          return /^\+?[0-9\s().-]+$/.test(v.trim()) && digits.length >= 6 && digits.length <= 15 ? '' : 'Inserisci un numero di telefono valido.';
        }
      },
      watch: { el: $('#f-watch', form), validate: () => '' },
      message: { el: $('#f-msg', form), validate: v => (v.trim().length >= 10 ? '' : 'Scrivi un messaggio di almeno 10 caratteri.') },
      privacy: { el: $('#f-privacy', form), validate: (v, el) => (el.checked ? '' : 'È necessario accettare l’informativa privacy.') }
    };
    let attempted = false;

    function showError(key, msg) {
      const { el } = fields[key];
      const wrap = el.closest('.field') || el.closest('.check');
      const errEl = document.getElementById(el.getAttribute('aria-describedby'));
      if (errEl) errEl.textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (wrap) {
        wrap.classList.toggle('is-invalid', !!msg);
        wrap.classList.toggle('is-valid', !msg && el.type !== 'checkbox' && !!el.value.trim());
      }
    }
    const check = key => {
      const f = fields[key];
      const msg = f.validate(f.el.value, f.el);
      showError(key, msg);
      return !msg;
    };

    Object.keys(fields).forEach(key => {
      const { el } = fields[key];
      el.addEventListener('blur', () => { if (el.value || attempted) check(key); });
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => { if (attempted || el.getAttribute('aria-invalid') === 'true') check(key); });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      attempted = true;
      const results = Object.keys(fields).map(k => [k, check(k)]);
      const firstInvalid = results.find(([, ok]) => !ok);
      if (firstInvalid) { fields[firstInvalid[0]].el.focus(); return; }

      const btn = $('button[type="submit"]', form);
      const label = $('span', btn);
      btn.disabled = true;
      btn.classList.add('is-loading');
      label.textContent = 'Invio in corso';

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        await sendInquiry(data);
        $('.form__success', form).hidden = false;
        $('.form__success .form__reset', form).focus({ preventScroll: true });
      } finally {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        label.textContent = 'Invia richiesta';
      }
    });

    $('.form__reset', form).addEventListener('click', () => {
      form.reset();
      attempted = false;
      Object.keys(fields).forEach(k => showError(k, ''));
      $$('.field', form).forEach(f => f.classList.remove('is-valid'));
      $('.form__success', form).hidden = true;
      fields.name.el.focus();
    });

    // Suggerimenti "Orologio di interesse"
    const dl = $('#watchList');
    if (dl) dl.innerHTML = products.map(p => `<option value="${escapeHTML(`${productName(p)} — Ref. ${p.reference}`)}"></option>`).join('');

    // Precompilazione da URL (?orologio=...)
    const q = new URLSearchParams(location.search).get('orologio');
    if (q) fields.watch.el.value = q;
  }

  /* ------------------------------------------------------------------------
     STATO APERTURA BOUTIQUE (orario di Roma)
     ------------------------------------------------------------------------ */
  function updateOpenStatus() {
    const el = $('#openStatus');
    if (!el) return;
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(new Date())
        .reduce((acc, p) => ((acc[p.type] = p.value), acc), {});
      const minutes = parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
      const open = parts.weekday !== 'Sun' &&
        ((minutes >= 600 && minutes < 750) || (minutes >= 960 && minutes < 1170));
      el.textContent = open ? 'Aperto ora' : 'Ora chiuso';
      el.classList.toggle('is-open', open);
    } catch (_) { /* Intl non disponibile */ }
  }

  /* ------------------------------------------------------------------------
     OROLOGIO 3D (Three.js)
     ------------------------------------------------------------------------ */
  function webglAvailable() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (_) { return false; }
  }

  function isLowPowerDevice() {
    const nav = navigator;
    if (new URLSearchParams(location.search).has('no3d')) return true;
    if (nav.connection && nav.connection.saveData) return true;
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return true;
    if (nav.deviceMemory && nav.deviceMemory <= 2) return true;
    return false;
  }

  function createWatchScene() {
    const stage = $('.watch-stage');
    const canvas = $('#watchCanvas');
    if (!stage || !canvas) return null;

    if (!window.THREE || !webglAvailable() || isLowPowerDevice() || prefersReducedMotion) {
      root.classList.add('no-webgl');
      return createChaptersOnly(stage);
    }

    const THREE = window.THREE;
    const mobile = isSmallScreen() || !finePointer;
    const Q = mobile ? { seg: 64, links: 6, dpr: 1.5 } : { seg: 128, links: 8, dpr: 2 };

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (_) {
      root.classList.add('no-webgl');
      return createChaptersOnly(stage);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, Q.dpr));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Riflessi: ambiente "studio" generato proceduralmente
    if (THREE.RoomEnvironment) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    }

    // Illuminazione cinematografica
    scene.add(new THREE.AmbientLight(0xffffff, 0.15));
    const key = new THREE.DirectionalLight(0xffe6c2, 2.2);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9d6ff, 1.4);
    rim.position.set(5, -2, -4);
    scene.add(rim);
    const top = new THREE.SpotLight(0xfff3dc, 3, 30, Math.PI / 7, 0.6, 1.2);
    top.position.set(2, 6, 7);
    scene.add(top);

    const pivot = new THREE.Group();       // controllato dallo scroll
    scene.add(pivot);
    const watch = buildProceduralWatch(THREE, Q);
    pivot.add(watch.group);

    // Sostituzione opzionale con modello .glb
    if (CONFIG.watchModel.enabled && THREE.GLTFLoader) {
      new THREE.GLTFLoader().load(CONFIG.watchModel.url, gltf => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const wrap = new THREE.Group();
        wrap.add(model);
        wrap.scale.setScalar(CONFIG.watchModel.size / Math.max(size.x, size.y, size.z));
        pivot.remove(watch.group);
        pivot.add(wrap);
        watch.hands = null;
      }, undefined, () => { /* il modello procedurale resta attivo */ });
    }

    // Coreografia allo scroll: keyframe [progress, x, y, rotX, rotY, rotZ, scale]
    // Le transizioni avvengono a cavallo dei cambi capitolo (0.34 / 0.67)
    const KF_DESKTOP = [
      [0.00, 1.15, 0.00, 0.32, -0.55, 0.10, 0.74],
      [0.20, 1.10, 0.00, 0.26, -0.35, 0.08, 0.76],
      [0.46, -1.15, 0.00, -0.12, 0.85, -0.06, 0.82],
      [0.55, -1.15, 0.00, -0.08, 0.70, -0.06, 0.82],
      [0.80, 1.10, 0.00, 0.42, -0.20, 0.04, 0.90],
      [1.00, 1.10, 0.00, 0.46, -0.05, 0.04, 0.92]
    ];
    // Schermi verticali (smartphone, tablet): orologio centrato in alto, sopra i testi.
    // La scala qui è relativa: viene moltiplicata per "portraitFit" calcolato in resize().
    const KF_MOBILE = [
      [0.00, 0.00, 0.66, 0.32, -0.50, 0.08, 1.00],
      [0.20, 0.00, 0.66, 0.26, -0.30, 0.06, 1.00],
      [0.46, 0.00, 0.70, -0.10, 0.85, -0.05, 1.06],
      [0.55, 0.00, 0.70, -0.08, 0.70, -0.05, 1.06],
      [0.80, 0.00, 0.68, 0.42, -0.20, 0.05, 1.10],
      [1.00, 0.00, 0.68, 0.46, -0.05, 0.05, 1.10]
    ];
    let portrait = false;
    let portraitFit = 0.5;

    const state = { x: 0, y: -3, rx: 0, ry: 0, rz: 0, s: 0.6, visible: false, progress: 0, mx: 0, my: 0, tmx: 0, tmy: 0 };
    const chapters = $$('.chapter', stage);
    const chapterNum = $('#chapterNum');
    const chapterBar = $('#chapterBar');
    let activeChapter = 0;

    function sample(kfs, p) {
      if (p <= kfs[0][0]) return kfs[0].slice(1);
      for (let i = 0; i < kfs.length - 1; i++) {
        const a = kfs[i], b = kfs[i + 1];
        if (p <= b[0]) {
          const t = smoothstep((p - a[0]) / (b[0] - a[0]));
          return a.slice(1).map((v, k) => lerp(v, b[k + 1], t));
        }
      }
      return kfs[kfs.length - 1].slice(1);
    }

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Larghezza visibile (in unità della scena) alla distanza della camera
      const visibleW = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      portrait = camera.aspect < 1;
      portraitFit = Math.min(visibleW * 0.2, 0.5);
    }
    resize();
    window.addEventListener('resize', resize);

    if (finePointer) {
      window.addEventListener('mousemove', e => {
        state.tmx = (e.clientX / vw - 0.5) * 2;
        state.tmy = (e.clientY / vh - 0.5) * 2;
      }, { passive: true });
    }

    const io = new IntersectionObserver(([en]) => { state.visible = en.isIntersecting; }, { rootMargin: '10% 0px' });
    io.observe(stage);

    const clock = new THREE.Clock();

    function update() {
      if (!state.visible) return;
      const r = stage.getBoundingClientRect();
      const total = r.height - vh;
      const p = clamp(-r.top / total);
      // Entrata: dal fondo dello schermo durante il primo scroll
      const enter = clamp(1 - r.top / vh);
      const exit = clamp((-r.top - total) / (vh * 0.8));

      const kf = sample(portrait ? KF_MOBILE : KF_DESKTOP, p);
      if (portrait) kf[5] *= portraitFit;
      const t = clock.getElapsedTime();
      const enterE = easeInOutCubic(enter);

      const target = {
        x: kf[0],
        y: kf[1] + lerp(-2.6, 0, enterE) + exit * 1.2 + Math.sin(t * 0.6) * 0.04,
        rx: kf[2] + lerp(0.9, 0, enterE),
        ry: kf[3] + lerp(-1.2, 0, enterE) + Math.sin(t * 0.25) * 0.08 + exit * 0.6,
        rz: kf[4],
        s: kf[5] * lerp(0.7, 1, enterE) * (1 - exit * 0.25)
      };
      const k = 0.075;
      state.mx = lerp(state.mx, state.tmx, 0.05);
      state.my = lerp(state.my, state.tmy, 0.05);
      state.x = lerp(state.x, target.x, k);
      state.y = lerp(state.y, target.y, k);
      state.rx = lerp(state.rx, target.rx, k);
      state.ry = lerp(state.ry, target.ry, k);
      state.rz = lerp(state.rz, target.rz, k);
      state.s = lerp(state.s, target.s, k);

      pivot.position.set(state.x + state.mx * 0.08, state.y - state.my * 0.06, 0);
      pivot.rotation.set(state.rx + state.my * 0.12, state.ry + state.mx * 0.18, state.rz);
      pivot.scale.setScalar(state.s);

      // La luce principale "scorre" sulla cassa durante lo scroll
      key.position.x = lerp(-5, 4, p);
      top.position.x = lerp(3, -3, p);

      if (watch.hands) watch.tick();
      renderer.render(scene, camera);

      // Capitoli di testo
      const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
      if (idx !== activeChapter) {
        activeChapter = idx;
        chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
        if (chapterNum) chapterNum.textContent = String(idx + 1).padStart(2, '0');
      }
      if (chapterBar) chapterBar.style.transform = `scaleX(${p.toFixed(4)})`;
    }

    return { update };
  }

  // Fallback senza WebGL: gestisce comunque i capitoli di testo
  function createChaptersOnly(stage) {
    const chapters = $$('.chapter', stage);
    const chapterNum = $('#chapterNum');
    const chapterBar = $('#chapterBar');
    return {
      update() {
        const r = stage.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = clamp(-r.top / (r.height - vh));
        const idx = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
        chapters.forEach((c, i) => c.classList.toggle('is-active', i === idx));
        if (chapterNum) chapterNum.textContent = String(idx + 1).padStart(2, '0');
        if (chapterBar) chapterBar.style.transform = `scaleX(${p.toFixed(4)})`;
      }
    };
  }

  /* Orologio procedurale ispirato a un subacqueo di alta gamma.
     Costruito nel sistema locale con asse Y = normale del quadrante,
     poi ruotato verso la camera. Ore 12 = -Z locale. */
  function buildProceduralWatch(THREE, Q) {
    const group = new THREE.Group();
    const body = new THREE.Group();
    body.rotation.x = Math.PI / 2;
    group.add(body);

    const M = {
      steel: new THREE.MeshPhysicalMaterial({ color: 0xb9b9b5, metalness: 1, roughness: 0.17, clearcoat: 0.4, clearcoatRoughness: 0.1, envMapIntensity: 0.9 }),
      brushed: new THREE.MeshPhysicalMaterial({ color: 0x8e8e8a, metalness: 1, roughness: 0.45, envMapIntensity: 0.6 }),
      gold: new THREE.MeshPhysicalMaterial({ color: 0xd9ae5f, metalness: 1, roughness: 0.18, clearcoat: 0.5 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: 0x0b0b0b, metalness: 0.2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04 }),
      rehaut: new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide }),
      lume: new THREE.MeshStandardMaterial({ color: 0xf1ead8, roughness: 0.5, metalness: 0, emissive: 0x1d1a12 })
    };

    // Parallelepipedo smussato (ExtrudeGeometry): i bordi catturano le luci come un metallo lucidato
    function roundedBox(w, h, d, r) {
      const shape = new THREE.Shape();
      const x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r;
      shape.moveTo(x, y - r);
      shape.lineTo(x + iw, y - r);
      shape.quadraticCurveTo(x + iw + r, y - r, x + iw + r, y);
      shape.lineTo(x + iw + r, y + ih);
      shape.quadraticCurveTo(x + iw + r, y + ih + r, x + iw, y + ih + r);
      shape.lineTo(x, y + ih + r);
      shape.quadraticCurveTo(x - r, y + ih + r, x - r, y + ih);
      shape.lineTo(x - r, y);
      shape.quadraticCurveTo(x - r, y - r, x, y - r);
      const bev = Math.min(r, d / 4);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: d - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.8, bevelSegments: 3, curveSegments: 4 });
      geo.translate(0, 0, -(d - 2 * bev) / 2);
      return geo;
    }

    // Cassa (profilo tornito)
    const casePts = [
      [0, -0.22], [0.84, -0.22], [0.95, -0.18], [1.0, -0.1], [1.01, 0.0], [1.0, 0.08], [0.97, 0.13], [0.81, 0.13], [0.81, 0.1]
    ].map(([x, y]) => new THREE.Vector2(x, y));
    body.add(new THREE.Mesh(new THREE.LatheGeometry(casePts, Q.seg), M.steel));

    // Lunetta girevole in ceramica
    const bezelPts = [[0.81, 0.13], [0.99, 0.13], [1.02, 0.155], [1.0, 0.2], [0.82, 0.205], [0.81, 0.19]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    body.add(new THREE.Mesh(new THREE.LatheGeometry(bezelPts, Q.seg), M.ceramic));

    // Inserto lunetta con scala dei minuti (texture canvas)
    const bezelTex = makeCanvasTexture(THREE, 1024, drawBezel);
    const insert = new THREE.Mesh(
      new THREE.RingGeometry(0.825, 0.985, Q.seg, 1),
      new THREE.MeshPhysicalMaterial({ map: bezelTex, metalness: 0.25, roughness: 0.14, clearcoat: 1, transparent: true })
    );
    insert.rotation.x = -Math.PI / 2;
    insert.position.y = 0.203;
    body.add(insert);

    // Rehaut interno
    const rehaut = new THREE.Mesh(new THREE.CylinderGeometry(0.81, 0.81, 0.1, Q.seg, 1, true), M.rehaut);
    rehaut.position.y = 0.15;
    body.add(rehaut);

    // Quadrante
    const dialTex = makeCanvasTexture(THREE, 1024, drawDial);
    const dial = new THREE.Mesh(
      new THREE.CircleGeometry(0.81, Q.seg),
      new THREE.MeshStandardMaterial({ map: dialTex, metalness: 0.35, roughness: 0.38 })
    );
    dial.rotation.x = -Math.PI / 2;
    dial.position.y = 0.1;
    body.add(dial);

    // Indici applicati in oro con inserto luminescente
    for (let h = 0; h < 12; h++) {
      const a = (h / 12) * Math.PI * 2;
      const r = 0.6;
      const holder = new THREE.Group();
      holder.rotation.y = -a;
      let mesh, lume;
      if (h === 0) {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.022, 0.15), M.gold);
        lume = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.024, 0.12), M.lume);
      } else if (h % 3 === 0) {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.022, 0.17), M.gold);
        lume = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.024, 0.14), M.lume);
      } else {
        mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.022, 32), M.gold);
        lume = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.024, 32), M.lume);
      }
      [mesh, lume].forEach(m => { m.position.set(0, 0.112, -r); holder.add(m); });
      body.add(holder);
    }

    // Lancette
    function hand(len, width, tail, y, mat, withLume) {
      const g = new THREE.Group();
      const blade = new THREE.Mesh(new THREE.BoxGeometry(width, 0.01, len + tail), mat);
      blade.position.set(0, y, -(len - tail) / 2);
      g.add(blade);
      if (withLume) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(width * 0.55, 0.012, len * 0.55), M.lume);
        l.position.set(0, y + 0.002, -len * 0.6);
        g.add(l);
      }
      body.add(g);
      return g;
    }
    const hourHand = hand(0.38, 0.065, 0.06, 0.13, M.gold, true);
    const minuteHand = hand(0.58, 0.045, 0.08, 0.142, M.gold, true);
    const secondHand = hand(0.66, 0.012, 0.16, 0.154, M.gold, false);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.05, 32), M.gold);
    cap.position.y = 0.14;
    body.add(cap);

    // Vetro zaffiro
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.82, 0.82, 0.025, Q.seg),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, transparent: true, opacity: 0.1, clearcoat: 1, envMapIntensity: 2.5 })
    );
    glass.position.y = 0.215;
    body.add(glass);

    // Corona e proteggi-corona (ore 3 = +X)
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 28), M.steel);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(1.08, -0.02, 0);
    body.add(crown);
    [-1, 1].forEach(s => {
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.15, 0.08), M.steel);
      guard.position.set(1.0, -0.02, s * 0.17);
      body.add(guard);
    });

    // Anse
    [-1, 1].forEach(sx => [-1, 1].forEach(sz => {
      const lug = new THREE.Mesh(roundedBox(0.2, 0.2, 0.5, 0.05), M.steel);
      lug.position.set(sx * 0.6, -0.04, sz * 0.92);
      lug.rotation.x = sz * 0.12;
      body.add(lug);
    }));

    // Bracciale tipo Oyster a tre maglie, curvato verso il retro
    const linkLen = 0.24, R = 1.25;
    [-1, 1].forEach(s => {
      const end = new THREE.Mesh(roundedBox(1.0, 0.14, 0.2, 0.03), M.brushed);
      end.position.set(0, -0.06, s * 1.12);
      body.add(end);
      for (let i = 0; i < Q.links; i++) {
        const a = (i * linkLen) / R;
        const row = new THREE.Group();
        row.position.set(0, -0.06 - R * (1 - Math.cos(a)), s * (1.26 + R * Math.sin(a)));
        row.rotation.x = s * a;
        const w = 1.0 - i * 0.012; // leggera rastremazione
        const center = new THREE.Mesh(roundedBox(w * 0.34, 0.13, linkLen * 0.9, 0.035), M.steel);
        const left = new THREE.Mesh(roundedBox(w * 0.31, 0.12, linkLen * 0.9, 0.03), M.brushed);
        const right = left.clone();
        left.position.x = -w * 0.34;
        right.position.x = w * 0.34;
        row.add(center, left, right);
        body.add(row);
      }
    });

    const hands = { hourHand, minuteHand, secondHand };
    function tick() {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      hourHand.rotation.y = -(h / 12) * Math.PI * 2;
      minuteHand.rotation.y = -(m / 60) * Math.PI * 2;
      secondHand.rotation.y = -(s / 60) * Math.PI * 2;
    }
    tick();

    // Ridisegna le texture quando i font web sono pronti
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        drawDial(dialTex.image.getContext('2d'), 1024); dialTex.needsUpdate = true;
        drawBezel(bezelTex.image.getContext('2d'), 1024); bezelTex.needsUpdate = true;
      });
    }

    const api = { group, hands, tick };
    return api;
  }

  function makeCanvasTexture(THREE, size, draw) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 8;
    return tex;
  }

  function drawDial(ctx, S) {
    const c = S / 2;
    ctx.clearRect(0, 0, S, S);
    // Fondo laccato nero con leggero soleil
    const g = ctx.createRadialGradient(c, c * 0.9, 0, c, c, c);
    g.addColorStop(0, '#1d1d1d');
    g.addColorStop(0.7, '#0d0d0d');
    g.addColorStop(1, '#050505');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    ctx.save();
    ctx.translate(c, c);
    for (let i = 0; i < 360; i++) {
      ctx.rotate(Math.PI / 180);
      ctx.strokeStyle = `rgba(255,255,255,${i % 2 ? 0.012 : 0.022})`;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -c); ctx.stroke();
    }
    // Minuteria
    for (let i = 0; i < 60; i++) {
      ctx.save();
      ctx.rotate((i / 60) * Math.PI * 2);
      ctx.fillStyle = 'rgba(243,240,232,.75)';
      const major = i % 5 === 0;
      ctx.fillRect(-(major ? 3 : 1.5), -c * 0.975, major ? 6 : 3, major ? 26 : 16);
      ctx.restore();
    }
    ctx.restore();

    // Scritte
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c9a04a';
    ctx.font = '500 58px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('RC', c, c - 150);
    ctx.font = '500 20px Manrope, Arial, sans-serif';
    ctx.fillStyle = 'rgba(243,240,232,.85)';
    drawSpaced(ctx, 'OROLOGI', c, c - 112, 7);
    ctx.font = 'italic 300 30px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = 'rgba(243,240,232,.75)';
    ctx.fillText('Il tempo, scelto con cura', c, c + 150);
    ctx.font = '500 15px Manrope, Arial, sans-serif';
    ctx.fillStyle = '#c9a04a';
    drawSpaced(ctx, 'MESTRE · VENEZIA', c, c + 188, 4);
  }

  function drawBezel(ctx, S) {
    const c = S / 2;
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.translate(c, c);
    const outer = c * 0.995, inner = c * (0.825 / 0.985);
    const mid = (outer + inner) / 2;
    ctx.fillStyle = '#d9d4c8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 60; i++) {
      ctx.save();
      ctx.rotate((i / 60) * Math.PI * 2);
      if (i === 0) {
        ctx.fillStyle = '#d9ae5f';
        ctx.beginPath();
        ctx.moveTo(0, -inner - 6); ctx.lineTo(-24, -outer + 14); ctx.lineTo(24, -outer + 14); ctx.closePath();
        ctx.fill();
      } else if (i % 10 === 0) {
        ctx.font = '500 46px "Cormorant Garamond", Georgia, serif';
        ctx.fillText(String(i), 0, -mid);
      } else if (i < 15) {
        ctx.fillRect(-2, -outer + 12, 4, 30);
      } else if (i % 5 === 0) {
        ctx.fillRect(-4, -outer + 12, 8, 34);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSpaced(ctx, text, x, y, spacing) {
    const chars = text.split('');
    const widths = chars.map(ch => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let cx = x - total / 2;
    ctx.textAlign = 'left';
    chars.forEach((ch, i) => { ctx.fillText(ch, cx, y); cx += widths[i] + spacing; });
    ctx.textAlign = 'center';
  }

  /* ------------------------------------------------------------------------
     LOOP PRINCIPALE (un solo requestAnimationFrame)
     ------------------------------------------------------------------------ */
  let watchScene = null;

  function frame(time) {
    if (lenis) lenis.raf(time);
    scrollY = window.scrollY;
    if (page === 'home') updateFly(); else updateHeaderSimple();
    updateParallax();
    if (watchScene) watchScene.update();
    updateShowcase();
    if (cur.render) cur.render();
    if (preview.render && preview.on) preview.render();
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------------ */
  function init() {
    initShowcase();
    initCatalog();
    initServices();
    initLotPreview();
    setupReveals();
    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    if (page === 'home') {
      measureFly();
      if (flyLogo) flyLogo.classList.add('is-ready');
      watchScene = createWatchScene();
    }

    window.addEventListener('resize', () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      measureFly();
    });
    // Ricalcolo quando i font sono caricati (le dimensioni possono cambiare)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureFly(); measureShowcase(); });

    if (page === 'home') updateFly();
    requestAnimationFrame(frame);
    setTimeout(() => body.classList.add('is-loaded'), 60);
  }

  init();
})();
