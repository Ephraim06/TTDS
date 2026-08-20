const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.getElementById('mobileMenu');
const backdrop = document.getElementById('menuBackdrop');
const menuButton = document.getElementById('menuButton');
const menuClose = document.getElementById('menuClose');
let lastFocused = null;

const loader = document.getElementById('pageLoader');
const loaderCount = document.getElementById('loaderCount');

function removeLoader() {
  loader?.remove();
  document.body.classList.remove('loading');
}

if (!reducedMotion && window.gsap && loader) {
  document.documentElement.classList.add('motion-enhanced');
  const loadingValue = { value: 0 };
  const loaderTimeline = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: removeLoader });
  loaderTimeline
    .to(loadingValue, { value: 100, duration: 1.05, ease: 'power2.out', onUpdate: () => { loaderCount.textContent = `${Math.round(loadingValue.value)}%`; } })
    .to('#loaderBar', { scaleX: 1, duration: 1.05, ease: 'power2.out' }, 0)
    .to('#loaderCurtain', { y: 0, duration: .7 }, '-=.08')
    .to('#loaderContent', { y: -30, opacity: 0, duration: .35 }, '-=.45')
    .to(loader, { yPercent: -100, duration: .8, ease: 'power4.inOut' }, '-=.05');
  window.setTimeout(removeLoader, 3200);
} else {
  removeLoader();
}

function openMenu() {
  lastFocused = document.activeElement;
  menu.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('modal-open');
  gsap.to(menu, { x: 0, duration: .65, ease: 'expo.out' });
  gsap.to(backdrop, { opacity: 1, pointerEvents: 'auto', duration: .3 });
  if (!reducedMotion) {
    gsap.fromTo(menu.querySelectorAll('.mobile-link'), { x: 45, opacity: 0 }, { x: 0, opacity: 1, stagger: .07, delay: .18, duration: .5, ease: 'power3.out' });
    gsap.fromTo(menu.querySelector('p'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, delay: .48, duration: .45 });
  }
  menuClose.focus();
}

function closeMenu() {
  menu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('modal-open');
  gsap.to(menu, { x: '100%', duration: .5, ease: 'expo.inOut' });
  gsap.to(backdrop, { opacity: 0, pointerEvents: 'none', duration: .3 });
  if (lastFocused) lastFocused.focus();
}

menuButton.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));

const siteHeader = document.getElementById('siteHeader');
const updateHeaderState = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 110);
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

const navSectionMap = {
  about: 'about', mission: 'about', faculty: 'about',
  academics: 'academics', experience: 'experience', global: 'global', alumni: 'alumni'
};
const sectionNavLinks = [...document.querySelectorAll('.nav-link[data-section]')];
const observedSections = Object.keys(navSectionMap).map(id => document.getElementById(id)).filter(Boolean);
if ('IntersectionObserver' in window && sectionNavLinks.length) {
  const navObserver = new IntersectionObserver(entries => {
    const current = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    const activeSection = navSectionMap[current.target.id];
    sectionNavLinks.forEach(link => {
      const active = link.dataset.section === activeSection;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .35] });
  observedSections.forEach(section => navObserver.observe(section));
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  if (menu.getAttribute('aria-hidden') === 'false') closeMenu();
  lastFocused = document.activeElement;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('modal-open');
  const panel = modal.querySelector('.modal-panel');
  const isOffcanvas = modal.classList.contains('offcanvas-modal');
  gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: .32 });
  if (isOffcanvas) {
    gsap.fromTo(panel, { x: '100%', opacity: 1 }, { x: 0, opacity: 1, duration: .72, ease: 'expo.out' });
  } else {
    gsap.fromTo(panel, { y: 70, opacity: 0, scale: .92, rotateX: -5 }, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: .65, ease: 'expo.out' });
  }
  if (!reducedMotion) {
    const modalChildren = panel.querySelectorAll('h2, p, blockquote, form, figure, [data-close]');
    gsap.fromTo(modalChildren, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .045, delay: .2, ease: 'power3.out' });
  }
  modal.querySelector('[data-close]')?.focus();
}

document.querySelectorAll('[data-story-name]').forEach(card => {
  card.addEventListener('click', () => {
    const image = document.getElementById('storyImage');
    const title = document.getElementById('storyTitle');
    const role = document.getElementById('storyRole');
    const copy = document.getElementById('storyCopy');
    image.src = card.dataset.storyImage;
    image.alt = card.dataset.storyName;
    title.textContent = card.dataset.storyName;
    role.textContent = card.dataset.storyRole;
    copy.textContent = card.dataset.storyCopy;
    openModal('storyModal');
  });
});

document.getElementById('storyApply')?.addEventListener('click', () => {
  const storyModal = document.getElementById('storyModal');
  closeModal(storyModal);
  window.setTimeout(() => openModal('applyModal'), reducedMotion ? 20 : 280);
});

function closeModal(modal) {
  const panel = modal.querySelector('.modal-panel');
  const isOffcanvas = modal.classList.contains('offcanvas-modal');
  if (isOffcanvas) {
    gsap.to(panel, { x: '100%', duration: .48, ease: 'expo.inOut' });
  } else {
    gsap.to(panel, { y: 35, opacity: 0, scale: .96, duration: .28, ease: 'power2.in' });
  }
  gsap.to(modal, { opacity: 0, duration: isOffcanvas ? .4 : .25, onComplete: () => {
    modal.classList.add('hidden'); modal.classList.remove('flex');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }});
}

document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
document.querySelectorAll('.modal').forEach(modal => {
  modal.querySelector('[data-close]').addEventListener('click', () => closeModal(modal));
  modal.addEventListener('mousedown', event => { if (event.target === modal) closeModal(modal); });
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const activeModal = [...document.querySelectorAll('.modal')].find(item => !item.classList.contains('hidden'));
  if (activeModal) closeModal(activeModal);
  else if (menu.getAttribute('aria-hidden') === 'false') closeMenu();
});

document.querySelectorAll('.demo-form').forEach(form => form.addEventListener('submit', event => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  status.textContent = 'Thank you—your enquiry is ready for admissions follow-up.';
  status.classList.remove('hidden');
  form.reset();
}));

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.graduate-card').forEach(card => {
  const name = card.querySelector('h3');
  const content = name?.parentElement;
  if (!name || !content) return;
  const graduateName = name.textContent.trim();

  const badge = document.createElement('span');
  badge.className = 'verified-badge';
  badge.setAttribute('aria-label', 'Verified TTSD alumnus');
  badge.title = 'Verified TTSD alumnus';
  badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 12 3 3 7-7"/></svg>';
  name.appendChild(badge);

  const meta = document.createElement('div');
  meta.className = 'graduate-meta';
  meta.innerHTML = '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 10 10-5 10 5-10 5L2 10Z"/><path d="M6 12.5V17c3 2.2 9 2.2 12 0v-4.5M22 10v6"/></svg>Class ’24</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10v5a5 5 0 0 1-10 0V3Z"/><path d="M5 5H3v2a4 4 0 0 0 4 4M19 5h2v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/></svg>TTSD Alumni</span>';
  content.appendChild(meta);

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'graduate-toggle focus-ring';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', `Expand ${graduateName}'s alumni profile`);
  toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  content.appendChild(toggle);

  toggle.addEventListener('click', () => {
    const willOpen = !card.classList.contains('is-open');
    document.querySelectorAll('.graduate-card.is-open').forEach(openCard => {
      openCard.classList.remove('is-open');
      openCard.querySelector('.graduate-toggle')?.setAttribute('aria-expanded', 'false');
    });
    card.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    if (willOpen && !reducedMotion) {
      gsap.fromTo(card.querySelector('img'), { scale: 1.16, filter: 'saturate(.2)' }, { scale: 1, filter: 'saturate(1)', duration: .65, ease: 'power3.out' });
      gsap.fromTo(card.querySelector('.graduate-meta'), { y: 12, opacity: 0 }, { y: 0, opacity: 1, delay: .08, duration: .45, ease: 'power2.out' });
      gsap.fromTo(card.querySelector('.verified-badge'), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: .55, ease: 'back.out(2)' });
    }
  });
});

const alumniCards = [...document.querySelectorAll('#alumni .graduate-card')];
const alumniSearch = document.getElementById('alumniSearch');
const alumniViewAll = document.getElementById('alumniViewAll');
const alumniResultCount = document.getElementById('alumniResultCount');
const alumniEmpty = document.getElementById('alumniEmpty');
const alumniPreviewLimit = 8;
let alumniExpanded = false;

alumniCards.forEach(card => {
  card.dataset.directorySearch = card.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
});

const updateAlumniDirectory = () => {
  const query = alumniSearch?.value.trim().toLowerCase() || '';
  const matches = alumniCards.filter(card => card.dataset.directorySearch.includes(query));
  const visibleLimit = query || alumniExpanded ? matches.length : alumniPreviewLimit;

  alumniCards.forEach(card => {
    const matchIndex = matches.indexOf(card);
    const visible = matchIndex !== -1 && matchIndex < visibleLimit;
    card.classList.toggle('is-directory-hidden', !visible);
    if (!visible && card.classList.contains('is-open')) {
      card.classList.remove('is-open');
      card.querySelector('.graduate-toggle')?.setAttribute('aria-expanded', 'false');
    }
  });

  const shown = Math.min(matches.length, visibleLimit);
  if (alumniResultCount) alumniResultCount.textContent = query
    ? `${matches.length} ${matches.length === 1 ? 'graduate' : 'graduates'} found`
    : `Showing ${shown} of ${alumniCards.length} graduates`;
  alumniEmpty?.classList.toggle('is-visible', matches.length === 0);

  if (alumniViewAll) {
    alumniViewAll.hidden = Boolean(query) || alumniCards.length <= alumniPreviewLimit;
    alumniViewAll.setAttribute('aria-expanded', String(alumniExpanded));
    alumniViewAll.innerHTML = alumniExpanded
      ? 'Show the curated view <span aria-hidden="true">↑</span>'
      : 'View the full Class of 2024 <span aria-hidden="true">↓</span>';
  }
};

alumniSearch?.addEventListener('input', updateAlumniDirectory);
alumniViewAll?.addEventListener('click', () => {
  const previouslyHidden = alumniCards.filter(card => card.classList.contains('is-directory-hidden'));
  alumniExpanded = !alumniExpanded;
  updateAlumniDirectory();
  if (alumniExpanded && !reducedMotion && window.gsap) {
    const newlyVisible = previouslyHidden.filter(card => !card.classList.contains('is-directory-hidden'));
    gsap.fromTo(newlyVisible, { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .5, ease: 'power3.out', clearProps: 'opacity,transform' });
  }
  if (!alumniExpanded) document.querySelector('#alumni .alumni-directory')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
});
updateAlumniDirectory();

const globalMapElement = document.getElementById('globalMap');
if (globalMapElement && window.L) {
  const communityLocations = [
    ['Canada', 56.13, -106.35, true], ['Zimbabwe', -19.02, 29.15],
    ['Nigeria', 9.08, 8.68], ['Sierra Leone', 8.46, -11.78],
    ['Trinidad & Tobago', 10.69, -61.22], ['Guyana', 4.86, -58.93],
    ['Jamaica', 18.11, -77.30], ['Britain', 55.38, -3.44],
    ['Botswana', -22.33, 24.68], ['Uganda', 1.37, 32.29],
    ['Barbados', 13.19, -59.54], ['Grenada', 12.12, -61.68],
    ['Nepal', 28.39, 84.12], ['Zambia', -13.13, 27.85],
    ['Kenya', -0.02, 37.91], ['South Africa', -30.56, 22.94],
    ['St. Lucia', 13.91, -60.98], ['Italy', 41.87, 12.57],
    ['Czech Republic', 49.82, 15.47], ['Liberia', 6.43, -9.43],
    ['India', 20.59, 78.96], ['Bahamas', 25.03, -77.40],
    ['Namibia', -22.96, 18.49]
  ];

  const globalMap = L.map(globalMapElement, {
    zoomControl: false, attributionControl: true, dragging: false,
    scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false,
    keyboard: false, touchZoom: false, zoomSnap: .1, worldCopyJump: false
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors', maxZoom: 5, noWrap: true
  }).addTo(globalMap);

  const bounds = [];
  communityLocations.forEach(([name, latitude, longitude, isHub], index) => {
    const position = [latitude, longitude];
    bounds.push(position);
    const iconSize = isHub ? 38 : 32;
    const starDuration = (8.8 + (index % 6) * .62).toFixed(2);
    const starDelay = (-(index * 1.17)).toFixed(2);
    const starSize = isHub ? 8 : 4 + (index % 3);
    const icon = L.divIcon({
      className: 'ttsd-star-icon',
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      html: `<span class="map-star${isHub ? ' map-star--hub' : ''}" style="--star-duration:${starDuration}s;--star-delay:${starDelay}s;--star-size:${starSize}px"><i class="map-star-halo"></i><i class="map-star-ray"></i><i class="map-star-core"></i></span>`
    });
    L.marker(position, { icon, interactive: false, keyboard: false }).addTo(globalMap);
  });
  globalMap.fitBounds(bounds, { padding: [28, 28], animate: false });
}

if (!reducedMotion && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#scrollProgress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .15 } });

  const marqueeTween = gsap.to('.marquee-track', { xPercent: -50, duration: 22, repeat: -1, ease: 'none' });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => {
      const boost = Math.min(4, 1 + Math.abs(self.getVelocity()) / 900);
      gsap.to(marqueeTween, { timeScale: boost, duration: .18, overwrite: true, onComplete: () => gsap.to(marqueeTween, { timeScale: 1, duration: .8 }) });
    }
  });

  const intro = gsap.timeline({ delay: 1.2, defaults: { ease: 'power4.out' } });
  intro
    .from('#siteHeader nav > *', { y: -24, stagger: .08, duration: .8 })
    .from('.hero-kicker', { y: 24, scale: .92, duration: .65 }, '-=.45')
    .from('.hero-title', { y: 54, skewY: 4, duration: 1.05 }, '-=.35')
    .from('.hero-copy', { y: 35, duration: .7 }, '-=.62')
    .from('.hero-actions > *', { y: 28, scale: .9, stagger: .12, duration: .6, clearProps: 'transform' }, '-=.5')
    .from('.hero-stats > div', { y: 30, stagger: .1, duration: .55 }, '-=.35')
    .from('a[aria-label="Scroll to discover"]', { x: 30, duration: .5 }, '-=.3');

  const heroSection = document.querySelector('main section:first-child');
  if (heroSection) {
    ['#56A8E6', '#0054AA', '#FFFFFF'].forEach((color, index) => {
      const orb = document.createElement('span');
      orb.className = 'float-orb';
      orb.style.cssText = `width:${28 + index * 18}px;height:${28 + index * 18}px;background:${color};right:${8 + index * 13}%;top:${22 + index * 18}%`;
      heroSection.appendChild(orb);
      gsap.to(orb, { x: index % 2 ? -40 : 34, y: index % 2 ? 30 : -38, rotate: 180, duration: 4.5 + index, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }

  gsap.to('.hero-mask', { opacity: .88, scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('main section:first-child > img', { yPercent: 15, scale: 1.1, ease: 'none', scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-title', { yPercent: 28, opacity: .2, ease: 'none', scrollTrigger: { trigger: heroSection, start: '35% top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-stats', { yPercent: 50, opacity: 0, ease: 'none', scrollTrigger: { trigger: heroSection, start: '55% top', end: 'bottom top', scrub: true } });

  gsap.utils.toArray('section h2').forEach((heading, index) => {
    heading.classList.add('heading-mask');
    gsap.from(heading, { y: 80, opacity: 0, rotateX: -12, transformOrigin: '50% 100%', duration: 1, ease: 'power4.out', scrollTrigger: { trigger: heading, start: 'top 88%', once: true } });
    gsap.to(heading, { xPercent: index % 2 ? -1.5 : 1.5, ease: 'none', scrollTrigger: { trigger: heading, start: 'top bottom', end: 'bottom top', scrub: 1.4 } });
  });

  gsap.from('.purpose-shell', { scale: .94, clipPath: 'inset(7% 5% 7% 5% round 60px)', duration: 1.25, ease: 'power4.out', scrollTrigger: { trigger: '.purpose-shell', start: 'top 88%', once: true } });
  ScrollTrigger.batch('.purpose-card', {
    start: 'top 88%', once: true,
    onEnter: cards => gsap.fromTo(cards, { y: 80, opacity: 0, rotateX: -10, transformOrigin: '50% 100%' }, { y: 0, opacity: 1, rotateX: 0, stagger: .14, duration: .9, ease: 'power4.out' })
  });
  gsap.from('.purpose-proof', { y: 35, opacity: 0, scaleX: .94, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.purpose-proof', start: 'top 92%', once: true } });
  gsap.to('.purpose-orbit', { rotate: 110, xPercent: -6, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });

  ScrollTrigger.batch('.leadership-card', {
    start: 'top 88%', once: true,
    onEnter: cards => gsap.fromTo(cards, { y: 100, opacity: 0, scale: .92, rotateY: -5 }, { y: 0, opacity: 1, scale: 1, rotateY: 0, stagger: .18, duration: 1.05, ease: 'power4.out' })
  });
  gsap.utils.toArray('.leadership-card').forEach((card, index) => {
    gsap.to(card.querySelector('.leadership-photo'), { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.1 } });
    gsap.from(card.querySelectorAll('h3, p, button, a'), { y: 25, stagger: .06, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: card, start: '55% 86%', once: true } });
  });
  gsap.from('.staff-directory', { y: 55, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: '.staff-directory', start: 'top 92%', once: true } });
  ScrollTrigger.batch('.staff-member', {
    start: 'top 92%', once: true,
    onEnter: staff => gsap.fromTo(staff, { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: .09, duration: .6, ease: 'power3.out' })
  });

  gsap.utils.toArray('.mission-word').forEach((word, index) => {
    gsap.fromTo(word,
      { opacity: .08, xPercent: index === 1 ? 20 : -20, skewX: index === 1 ? -7 : 7 },
      { opacity: 1, xPercent: index === 1 ? -2 : 2, skewX: 0, ease: 'none', scrollTrigger: { trigger: word, start: 'top 92%', end: 'top 42%', scrub: 1 } }
    );
  });

  gsap.to('.student-life-image', { scale: 1.14, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.student-life-image', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.student-life-image', { clipPath: 'inset(15% 18% 15% 18% round 48px)', duration: 1.25, ease: 'power3.out', scrollTrigger: { trigger: '.student-life-image', start: 'top 82%', once: true } });

  gsap.utils.toArray('.reveal').forEach((element, index) => {
    gsap.set(element, { visibility: 'visible' });
    if (element.matches('.leadership-card, .staff-directory, .graduate-card, .program-card, .story-card')) return;
    gsap.from(element, { y: 54, x: index % 3 === 0 ? -18 : 0, opacity: 0, filter: 'blur(8px)', duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
  });

  ScrollTrigger.batch('.program-card', {
    start: 'top 90%', once: true,
    onEnter: cards => gsap.fromTo(cards, { y: 90, opacity: 0, rotateY: -8, scale: .94 }, { y: 0, opacity: 1, rotateY: 0, scale: 1, stagger: .12, duration: .9, ease: 'power4.out' })
  });
  ScrollTrigger.batch('.story-card', {
    start: 'top 88%', once: true,
    onEnter: cards => gsap.fromTo(cards, { y: 100, opacity: 0, rotate: 2, scale: .9 }, { y: 0, opacity: 1, rotate: 0, scale: 1, stagger: .16, duration: .95, ease: 'back.out(1.35)' })
  });
  const presidentTimeline = gsap.timeline({ scrollTrigger: { trigger: '.president-note', start: 'top 82%', once: true } });
  presidentTimeline
    .from('.president-monogram', { scale: .4, rotate: -28, opacity: 0, duration: .8, ease: 'back.out(1.8)' })
    .from('.president-kicker', { x: -24, opacity: 0, duration: .5, ease: 'power3.out' }, '-=.42')
    .from('.president-quote', { y: 44, opacity: 0, duration: .9, ease: 'power4.out' }, '-=.38')
    .from('.president-principle', { x: 18, opacity: 0, stagger: .1, duration: .45, ease: 'power2.out' }, '-=.45');
  gsap.utils.toArray('.graduate-card').forEach((card, index) => {
    gsap.set(card, { visibility: 'visible' });
    gsap.from(card, { x: index % 2 ? 60 : -60, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 94%', once: true } });
  });

  gsap.from('.map-shell', { clipPath: 'inset(12% 12% 12% 12% round 60px)', scale: .92, rotate: 1.5, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.map-shell', start: 'top 85%', once: true } });
  gsap.to('#globalMap', { scale: 1.045, ease: 'none', scrollTrigger: { trigger: '.map-shell', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  gsap.from('.global-summary', { x: -60, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: '.global-stage', start: 'top 82%', once: true } });
  gsap.from('.global-stat', { x: -18, opacity: 0, stagger: .1, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: '.global-summary', start: '55% 88%', once: true } });
  gsap.from('.map-star', { scale: 0, opacity: 0, stagger: .035, duration: .55, ease: 'back.out(2)', scrollTrigger: { trigger: '#globalMap', start: 'top 80%', once: true } });
  const countryMarquee = gsap.to('.country-track', { xPercent: -50, duration: 34, repeat: -1, ease: 'none' });
  const countryRibbon = document.querySelector('.country-ribbon');
  countryRibbon?.addEventListener('pointerenter', () => gsap.to(countryMarquee, { timeScale: 0, duration: .45 }));
  countryRibbon?.addEventListener('pointerleave', () => gsap.to(countryMarquee, { timeScale: 1, duration: .45 }));
  gsap.to('.next-orbit', { rotate: 38, yPercent: -16, ease: 'none', scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  const nextChapterTimeline = gsap.timeline({ scrollTrigger: { trigger: '.next-chapter', start: 'top 82%', once: true } });
  nextChapterTimeline
    .from('.next-title', { y: 55, opacity: 0, duration: .9, ease: 'power4.out' })
    .from('.next-step', { x: 42, opacity: 0, stagger: .12, duration: .65, ease: 'power3.out' }, '-=.48');
  gsap.from('footer .footer-link', { y: 14, opacity: 0, stagger: .045, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: 'footer', start: 'top 88%', once: true } });

  const motionMedia = gsap.matchMedia();
  motionMedia.add('(min-width: 768px) and (pointer: fine)', () => {
    const heroX = gsap.quickTo('main section:first-child > img', 'xPercent', { duration: .8, ease: 'power3.out' });
    const heroMaskX = gsap.quickTo('.hero-mask', 'backgroundPositionX', { duration: .8, ease: 'power3.out' });
    heroSection?.addEventListener('pointermove', event => {
      const amount = event.clientX / window.innerWidth - .5;
      heroX(amount * 2.5);
      heroMaskX(`${50 + amount * 8}%`);
    });

    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    const dotX = gsap.quickTo(cursorDot, 'x', { duration: .08 });
    const dotY = gsap.quickTo(cursorDot, 'y', { duration: .08 });
    const ringX = gsap.quickTo(cursorRing, 'x', { duration: .28, ease: 'power3.out' });
    const ringY = gsap.quickTo(cursorRing, 'y', { duration: .28, ease: 'power3.out' });
    window.addEventListener('pointermove', event => {
      dotX(event.clientX - 3.5); dotY(event.clientY - 3.5);
      ringX(event.clientX - 19); ringY(event.clientY - 19);
      gsap.to([cursorDot, cursorRing], { opacity: 1, duration: .2 });
    });

    document.querySelectorAll('a, button, summary').forEach(target => {
      target.addEventListener('pointerenter', () => gsap.to(cursorRing, { scale: 1.75, backgroundColor: 'rgba(255,255,255,.12)', duration: .25 }));
      target.addEventListener('pointerleave', () => gsap.to(cursorRing, { scale: 1, backgroundColor: 'transparent', duration: .25 }));
    });

    document.querySelectorAll('.hero-actions > *, [data-open]').forEach(button => {
      button.addEventListener('pointermove', event => {
        const bounds = button.getBoundingClientRect();
        gsap.to(button, { x: (event.clientX - bounds.left - bounds.width / 2) * .13, y: (event.clientY - bounds.top - bounds.height / 2) * .18, duration: .3, ease: 'power2.out' });
      });
      button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1, .35)' }));
    });

    document.querySelectorAll('.purpose-card, .leadership-card, .program-card, .story-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const bounds = card.getBoundingClientRect();
        const rx = ((event.clientY - bounds.top) / bounds.height - .5) * -5;
        const ry = ((event.clientX - bounds.left) / bounds.width - .5) * 7;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, transformOrigin: 'center', duration: .35, ease: 'power2.out' });
      });
      card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .65, ease: 'elastic.out(1, .45)' }));
    });
  });
} else {
  document.querySelectorAll('.reveal').forEach(element => element.style.visibility = 'visible');
}

const counted = new WeakSet();
const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting || counted.has(entry.target)) return;
  counted.add(entry.target);
  const target = Number(entry.target.dataset.count);
  if (reducedMotion) { entry.target.textContent = target + '+'; return; }
  const value = { n: 0 };
  gsap.to(value, { n: target, duration: 1.7, ease: 'power2.out', onUpdate: () => entry.target.textContent = Math.round(value.n) + '+', onComplete: () => entry.target.textContent = target + '+' });
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(element => counterObserver.observe(element));
