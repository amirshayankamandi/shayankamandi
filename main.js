(function () {
  'use strict';
  const S = window.SITE;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const INK = '#0f0f0f', BG = '#ece7dc';

  gsap.registerPlugin(ScrollTrigger, Draggable);

  /* ---------------------------------------------------------- helpers */
  const starPath = (cx, cy, R, r, n) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (Math.PI / n) * i - Math.PI / 2, rad = i % 2 ? r : R;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(2) + ' ' + (cy + Math.sin(a) * rad).toFixed(2);
    }
    return d + 'Z';
  };

  // split text nodes into word / char spans (keeps nested elements like <em>)
  function split(el, chars = true) {
    const out = { chars: [], words: [] };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            if (chars) [...p].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; w.appendChild(s); out.chars.push(s); });
            else w.textContent = p;
            out.words.push(w); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('pill')) walk(n);
      });
    })(el);
    return out;
  }

  /* ---------------------------------------------------------- render content */
  function render() {
    document.title = `${S.name} — ${S.role}`;
    $$('[data-bind]').forEach(el => { const v = S[el.dataset.bind]; if (v != null) el.textContent = v; });
    $$('[data-bind-href]').forEach(el => { el.href = 'mailto:' + S[el.dataset.bindHref]; });
    $$('[data-bind-resume]').forEach(el => { el.href = S.resume; });
    $$('.year').forEach(el => el.textContent = new Date().getFullYear());

    // logo: "SK" that opens up into "Shayan Kamandi" on hover
    const [first, last = ''] = S.name.split(' ');
    const part = t => `<span class="logo__x"><span>${t}</span></span>`;
    $('.logo').innerHTML = `<span class="logo__name">${first[0]}${part(first.slice(1))}<i class="logo__gap"></i>${last[0] || ''}${part(last.slice(1))}</span><svg class="logo__star" viewBox="0 0 100 100"><use href="#starSym"/></svg>`;

    // star shapes
    $('#starShape').setAttribute('points', Array.from({ length: 24 }, (_, i) => {
      const a = (Math.PI / 12) * i, r = i % 2 ? 40 : 58;
      return (60 + Math.cos(a) * r).toFixed(1) + ',' + (60 + Math.sin(a) * r).toFixed(1);
    }).join(' '));
    $('#starSymPath').setAttribute('d', starPath(50, 50, 48, 18, 8));

    // photo in pill
    if (S.photo) $('.pill').insertAdjacentHTML('afterbegin', `<img src="${S.photo}" alt="">`);

    // ticker
    const star = '<svg viewBox="0 0 100 100"><use href="#starSym"/></svg>';
    const set = S.ticker.map(t => `<span class="ticker__item">${t}${star}</span>`).join('');
    $('#ticker').innerHTML = `<div class="ticker__set" style="display:flex">${set}</div><div class="ticker__set" style="display:flex" aria-hidden="true">${set}</div>`;

    // work
    $('#workCount').textContent = String(S.works.length).padStart(2, '0');
    $('#workList').innerHTML = S.works.map((w, i) => `
      <article class="card" style="--i:${i};--c1:${w.c[0]};--fg:${w.fg}">
        <a class="card__inner" href="${w.url}" data-cursor="View" data-art="${i}">
          <div class="card__text">
            <div class="card__top"><span>${String(i + 1).padStart(2, '0')} / ${String(S.works.length).padStart(2, '0')}</span><span>${w.year}</span></div>
            <div>
              <p class="card__kind">${w.kind}</p>
              <h3 class="card__title">${w.title}</h3>
              <p class="card__desc">${w.text}</p>
              <ul class="tags">${w.tags.map(t => `<li>${t}</li>`).join('')}</ul>
              ${w.result ? `<div class="card__result"><strong>${w.result.value}</strong><span>${w.result.label}</span></div>` : ''}
              <span class="card__go">View project <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>
          </div>
          <div class="card__art">${art(w.art, w.c)}</div>
        </a>
      </article>`).join('');

    // about words
    const at = $('#aboutText');
    at.innerHTML = at.textContent.split(/\s+/).map(w => `<span class="aw">${w}</span>`).join(' ');

    // stats
    $('#stats').innerHTML = S.stats.map(s => `
      <div class="stat"><div class="stat__num"><span data-count="${s.value}">0</span>${s.suffix ? `<sup>${s.suffix}</sup>` : ''}</div><div class="stat__label">${s.label}</div></div>`).join('');

    // services
    const cols = ['var(--lilac)', 'var(--lime)', 'var(--sky)', 'var(--accent)'];
    $('#services').innerHTML = S.services.map((s, i) => `
      <div class="svc" style="--c:${cols[i % 4]}" data-cursor-grow>
        <span class="svc__n">0${i + 1}</span>
        <div><h4>${s.title}</h4><p>${s.text}</p></div>
      </div>`).join('');

    // stack
    $('#stack').innerHTML = S.stack.map(g => `<div class="stack__col"><h4>${g.title}</h4><ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('');

    // experience
    $('#rows').innerHTML = S.experience.map(e => `
      <li class="row" data-cursor-grow>
        <div class="row__main">
          <span class="row__years">${e.years}</span>
          <span class="row__company">${e.company}</span>
          <span class="row__role">${e.role}</span>
          <span class="row__loc">${e.place}</span>
          <svg class="row__arrow" viewBox="0 0 24 24" width="28" height="28"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="row__more"><p>${e.text}</p></div>
      </li>`).join('');
    $('#lists').innerHTML = S.lists.map(l => `<div><h4>${l.title}</h4><ul>${l.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`).join('');

    // socials
    $('#socials').innerHTML = S.socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener" data-magnetic="0.25">${s.label}</a></li>`).join('');
  }

  // abstract project artwork — 5 variants, coloured by project palette
  function art(v, c) {
    const [, a, b] = c;
    const sh = 'class="sh"';
    const V = [
      // 0 — sun / pill
      () => `<svg viewBox="0 0 400 400"><circle ${sh} cx="200" cy="200" r="130" fill="${a}"/><path ${sh} d="M200 70a130 130 0 0 1 0 260z" fill="${b}"/><rect ${sh} x="50" y="318" width="300" height="30" rx="15" fill="${INK}"/><circle ${sh} cx="318" cy="92" r="30" fill="${b}"/><circle ${sh} cx="86" cy="120" r="14" fill="${INK}"/></svg>`,
      // 1 — arches
      () => `<svg viewBox="0 0 400 400"><path ${sh} d="M40 340V190a70 70 0 0 1 140 0v150z" fill="${a}"/><path ${sh} d="M150 340V120a70 70 0 0 1 140 0v220z" fill="${b}"/><path ${sh} d="M260 340V230a70 70 0 0 1 100 0v110z" fill="${INK}"/><circle ${sh} cx="220" cy="82" r="16" fill="${INK}"/><rect ${sh} x="30" y="346" width="340" height="14" rx="7" fill="${INK}"/></svg>`,
      // 2 — star + dots
      () => `<svg viewBox="0 0 400 400">${Array.from({ length: 25 }, (_, i) => `<circle ${sh} cx="${60 + (i % 5) * 70}" cy="${60 + Math.floor(i / 5) * 70}" r="6" fill="${BG}" opacity=".45"/>`).join('')}<path ${sh} d="${starPath(200, 200, 150, 70, 10)}" fill="${a}"/><circle ${sh} cx="200" cy="200" r="52" fill="${b}"/><circle ${sh} cx="200" cy="200" r="20" fill="${INK}"/></svg>`,
      // 3 — waves
      () => `<svg viewBox="0 0 400 400"><path ${sh} d="M20 130q45-50 90 0t90 0 90 0 90 0v70H20z" fill="${a}"/><path ${sh} d="M20 210q45-50 90 0t90 0 90 0 90 0v70H20z" fill="${b}"/><path ${sh} d="M20 290q45-50 90 0t90 0 90 0 90 0v70H20z" fill="${INK}"/><circle ${sh} cx="300" cy="70" r="36" fill="${INK}"/></svg>`,
      // 4 — rings
      () => `<svg viewBox="0 0 400 400"><circle ${sh} cx="200" cy="200" r="150" fill="${a}"/><circle ${sh} cx="200" cy="200" r="104" fill="${b}"/><circle ${sh} cx="200" cy="200" r="58" fill="${INK}"/><rect ${sh} x="296" y="52" width="60" height="60" rx="12" fill="${INK}" transform="rotate(18 326 82)"/><circle ${sh} cx="70" cy="320" r="22" fill="${a}"/></svg>`
    ];
    return V[v % V.length]();
  }

  render();

  /* ---------------------------------------------------------- clock */
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: S.timezone, hour: '2-digit', minute: '2-digit', hour12: false });
  const tick = () => { const t = fmt.format(new Date()); $$('[data-time]').forEach(e => e.textContent = t + ' local'); };
  tick(); setInterval(tick, 20000);

  /* ---------------------------------------------------------- smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = (target) => lenis ? lenis.scrollTo(target, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) }) : $(target)?.scrollIntoView({ behavior: 'smooth' });

  /* ---------------------------------------------------------- menu & anchors */
  const burger = $('.burger');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    $('.menu').setAttribute('aria-hidden', !open);
    lenis && (open ? lenis.stop() : lenis.start());
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2 || !$(id)) return;
    e.preventDefault();
    if (document.body.classList.contains('menu-open')) setMenu(false);
    scrollTo(id === '#top' ? 0 : id);
  }));

  /* ---------------------------------------------------------- cursor */
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    const c = $('.cursor'), label = $('.cursor__label');
    const xTo = gsap.quickTo(c, 'x', { duration: .4, ease: 'power3' }), yTo = gsap.quickTo(c, 'y', { duration: .4, ease: 'power3' });
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor],[data-cursor-grow],a,button,.sticker');
      c.classList.remove('is-label', 'is-grow', 'is-drag');
      if (!t) return;
      if (t.dataset.cursor) { label.textContent = t.dataset.cursor; c.classList.add('is-label'); }
      else if (t.classList.contains('sticker')) c.classList.add('is-drag');
      else c.classList.add('is-grow');
    });
    document.addEventListener('mouseleave', () => c.style.opacity = 0);
    document.addEventListener('mouseenter', () => c.style.opacity = 1);
  }

  /* ---------------------------------------------------------- magnetic */
  if (fine && !reduce) $$('[data-magnetic]').forEach(el => {
    const s = parseFloat(el.dataset.magnetic) || .3;
    const xt = gsap.quickTo(el, 'x', { duration: .7, ease: 'elastic.out(1,.45)' }), yt = gsap.quickTo(el, 'y', { duration: .7, ease: 'elastic.out(1,.45)' });
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * s); yt((e.clientY - r.top - r.height / 2) * s); });
    el.addEventListener('pointerleave', () => { xt(0); yt(0); });
  });

  /* ---------------------------------------------------------- nav theme per section */
  $$('[data-theme]').forEach(sec => {
    if (sec.classList.contains('nav')) return;
    ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', onToggle: s => s.isActive && $('.nav').setAttribute('data-theme', sec.dataset.theme) });
  });

  // hide nav when scrolling down, bring it back when scrolling up
  if (!reduce) {
    const navEl = $('.nav');
    ScrollTrigger.create({
      start: 120,
      onUpdate: s => { if (!document.body.classList.contains('menu-open')) gsap.to(navEl, { yPercent: s.direction > 0 ? -110 : 0, duration: .6, ease: 'power3.out', overwrite: true }); },
      onLeaveBack: () => gsap.to(navEl, { yPercent: 0, duration: .4, overwrite: true })
    });
  }

  /* ---------------------------------------------------------- hero setup */
  const heroTitle = $('.hero__title');
  const heroSplit = split(heroTitle);
  const nav = $$('.nav > *');
  const pre = $('.preloader');

  if (!reduce) {
    gsap.set(heroSplit.chars, { yPercent: 120 });
    gsap.set('.pill', { width: 0 });
    gsap.set('.sticker', { scale: 0, rotation: () => gsap.utils.random(-50, 50) });
    gsap.set([nav, '.hero__foot > *'], { opacity: 0, y: -14 });
  } else pre.remove();

  /* ---------------------------------------------------------- intro */
  function intro() {
    const hello = $('#hello'), count = $('#count');
    const greet = [['Hello', 'en'], ['سلام', 'fa'], ['Hola', 'es'], ['Bonjour', 'fr'], ['Ciao', 'it'], ['Hello', 'en']];
    const o = { v: 0 }; let gi = 0;
    const tl = gsap.timeline({ onComplete: () => pre.remove() });
    tl.to(o, {
      v: 100, duration: 2.4, ease: 'power2.inOut',
      onUpdate() {
        count.textContent = Math.round(o.v);
        const idx = Math.min(greet.length - 1, Math.floor(o.v / (100 / greet.length)));
        if (idx !== gi) { gi = idx; hello.textContent = greet[idx][0]; hello.lang = greet[idx][1]; }
      }
    })
    .to(pre, { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, '+=.15')
    .to('.preloader__curve', { scaleY: 0, transformOrigin: 'top', duration: 1.15, ease: 'expo.inOut' }, '<')
    .add(() => lenis && lenis.start(), '-=.5')
    .to(heroSplit.chars, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .022 }, '-=.7')
    .to('.pill', { width: '1.7em', duration: 1.4, ease: 'expo.out', clearProps: 'width' }, '-=1.1')
    .to('.sticker', { scale: 1, rotation: () => gsap.utils.random(-14, 14), duration: 1.1, ease: 'elastic.out(1,.55)', stagger: .12 }, '-=.9')
    .to([nav, '.hero__foot > *'], { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .05, clearProps: 'transform' }, '-=1.1');
  }

  /* ---------------------------------------------------------- stickers: draggable + mouse parallax */
  $$('.sticker').forEach((st, i) => {
    const inner = $('.sticker__in', st);
    Draggable.create(st, {
      type: 'x,y', bounds: '.hero',
      onPress() { gsap.to(st, { scale: 1.14, duration: .35, ease: 'back.out(3)' }); },
      onRelease() { gsap.to(st, { scale: 1, rotation: gsap.utils.random(-14, 14), duration: .9, ease: 'elastic.out(1,.4)' }); }
    });
    if (reduce) return;
    gsap.to(inner, { rotation: gsap.utils.random(6, 12) * (i % 2 ? -1 : 1), duration: gsap.utils.random(1.8, 3), yoyo: true, repeat: -1, ease: 'sine.inOut' });
    st.addEventListener('click', () => gsap.fromTo(inner, { scale: .7 }, { scale: 1, duration: 1, ease: 'elastic.out(1,.3)' }));
    if (fine) {
      const depth = [28, 40, 20, 34][i] || 24;
      const qx = gsap.quickTo(inner, 'x', { duration: 1.2, ease: 'power3' }), qy = gsap.quickTo(inner, 'y', { duration: 1.2, ease: 'power3' });
      addEventListener('pointermove', e => { qx((e.clientX / innerWidth - .5) * depth); qy((e.clientY / innerHeight - .5) * depth); }, { passive: true });
    }
  });

  /* ---------------------------------------------------------- scroll animations */
  function scrollFX() {
    if (reduce) { $$('[data-count]').forEach(el => el.textContent = el.dataset.count); return; }

    // ticker: infinite loop, speed follows scroll velocity
    const sets = $$('.ticker__set');
    const loop = gsap.to(sets, { xPercent: -100, ease: 'none', duration: 28, repeat: -1 });
    ScrollTrigger.create({
      onUpdate(self) {
        const v = self.getVelocity() / 300;
        gsap.to(loop, { timeScale: gsap.utils.clamp(-6, 6, v) || (self.direction > 0 ? 1 : -1), duration: .3, overwrite: true });
        gsap.to(loop, { timeScale: self.direction > 0 ? 1 : -1, duration: 1.2, delay: .3 });
      }
    });

    // headline reveals
    $$('[data-reveal]').forEach(el => {
      const s = split(el);
      gsap.from(s.chars, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: .02, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('[data-fade]').forEach(el => gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }));

    // contact title
    const ct = split($('#contactTitle'));
    gsap.from(ct.chars, { yPercent: 110, rotate: 6, duration: 1.2, ease: 'expo.out', stagger: .015, scrollTrigger: { trigger: '#contactTitle', start: 'top 85%' } });
    $('#contactTitle').style.overflow = 'hidden';

    // about: words light up with scroll
    gsap.to('.aw', { opacity: 1, ease: 'none', stagger: .12, scrollTrigger: { trigger: '#aboutText', start: 'top 82%', end: 'bottom 55%', scrub: .6 } });

    // counters
    $$('[data-count]').forEach(el => {
      const o = { v: 0 };
      gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v), scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // services + rows stagger
    gsap.from('.stack__col', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.stack__grid', start: 'top 90%' } });
    gsap.from('.svc', { y: 70, opacity: 0, duration: 1, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.services__grid', start: 'top 85%' } });
    $$('.row').forEach(r => gsap.from(r, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 94%' } }));
    gsap.from('.lists > div', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .12, scrollTrigger: { trigger: '.lists', start: 'top 90%' } });

    // work cards: previous card scales back as the next one slides over it
    const cards = $$('.card');
    cards.forEach((card, i) => {
      const inner = $('.card__inner', card);
      const next = cards[i + 1];
      if (next) gsap.to(inner, { scale: .93, filter: 'brightness(.82)', ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 12%', scrub: true } });
      // art drifts up slightly while scrolling
      gsap.fromTo($('.card__art', card), { yPercent: 12 }, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------------------------------------------------------- artwork: float + tilt */
  function artFX() {
    if (reduce) return;
    $$('.card__inner').forEach(card => {
      const svg = $('svg', card); if (!svg) return;
      const shapes = $$('.sh', svg);
      shapes.forEach((s, i) => gsap.to(s, { y: gsap.utils.random(-14, 14), x: gsap.utils.random(-8, 8), rotation: gsap.utils.random(-5, 5), duration: gsap.utils.random(2.4, 4), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * .1 }));
      if (!fine) return;
      const rx = gsap.quickTo(svg, 'rotationX', { duration: .8, ease: 'power3' }), ry = gsap.quickTo(svg, 'rotationY', { duration: .8, ease: 'power3' });
      card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 22); rx(-((e.clientY - r.top) / r.height - .5) * 22); });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
  }

  scrollFX();
  artFX();

  /* ---------------------------------------------------------- go */
  const start = () => { if (reduce) { gsap.set('.sticker', { clearProps: 'all' }); ScrollTrigger.refresh(); } else { intro(); } };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { ScrollTrigger.refresh(); start(); });
  addEventListener('load', () => ScrollTrigger.refresh());

  /* ---------------------------------------------------------- small joys */
  const title = document.title;
  document.addEventListener('visibilitychange', () => { document.title = document.hidden ? 'Come back! 🥺' : title; });
  console.log('%cHey, curious one 👋 — this site is built with GSAP + Lenis. Say hi: ' + S.email, 'font:600 14px system-ui;color:#ff4a1c');
})();
