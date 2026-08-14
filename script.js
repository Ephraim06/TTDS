const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.getElementById('mobileMenu');
const backdrop = document.getElementById('menuBackdrop');
const menuButton = document.getElementById('menuButton');
const menuClose = document.getElementById('menuClose');
let lastFocused = null;

function openMenu() {
  lastFocused = document.activeElement;
  menu.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('modal-open');
  gsap.to(menu, { x: 0, duration: .55, ease: 'power3.out' });
  gsap.to(backdrop, { opacity: 1, pointerEvents: 'auto', duration: .3 });
  menuClose.focus();
}

function closeMenu() {
  menu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('modal-open');
  gsap.to(menu, { x: '100%', duration: .45, ease: 'power3.inOut' });
  gsap.to(backdrop, { opacity: 0, pointerEvents: 'none', duration: .3 });
  if (lastFocused) lastFocused.focus();
}

menuButton.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMenu));

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
  gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: .25 });
  if (isOffcanvas) {
    gsap.fromTo(panel, { x: '100%', opacity: 1 }, { x: 0, opacity: 1, duration: .55, ease: 'power3.out' });
  } else {
    gsap.fromTo(panel, { y: 45, opacity: 0, scale: .98 }, { y: 0, opacity: 1, scale: 1, duration: .45, ease: 'power3.out' });
  }
  modal.querySelector('[data-close]')?.focus();
}

function closeModal(modal) {
  const panel = modal.querySelector('.modal-panel');
  const isOffcanvas = modal.classList.contains('offcanvas-modal');
  if (isOffcanvas) {
    gsap.to(panel, { x: '100%', duration: .4, ease: 'power3.inOut' });
  } else {
    gsap.to(panel, { y: 25, opacity: 0, duration: .2 });
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
  badge.setAttribute('aria-label', 'Verified TTSD graduate');
  badge.title = 'Verified TTSD graduate';
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
  toggle.setAttribute('aria-label', `Expand ${graduateName}'s graduate profile`);
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
  });
});

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
  communityLocations.forEach(([name, latitude, longitude, isHub]) => {
    const position = [latitude, longitude];
    bounds.push(position);
    L.circleMarker(position, {
      radius: isHub ? 7 : 5, color: '#ffffff', weight: 2,
      fillColor: isHub ? '#c9a12a' : '#197eaa', fillOpacity: 1,
      interactive: false
    }).addTo(globalMap);
  });
  globalMap.fitBounds(bounds, { padding: [28, 28], animate: false });
}

if (!reducedMotion && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro.from('.hero-kicker', { y: 20, opacity: 0, duration: .6 })
    .from('.hero-title', { y: 45, opacity: 0, duration: .9 }, '-=.35')
    .from('.hero-copy', { y: 25, opacity: 0, duration: .6 }, '-=.5')
    .from('.hero-actions > *', { y: 18, stagger: .12, duration: .5, clearProps: 'transform' }, '-=.35')
    .from('.hero-stats', { y: 25, opacity: 0, duration: .6 }, '-=.25');

  gsap.to('.hero-mask', { opacity: .82, scrollTrigger: { trigger: 'main section:first-child', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('main section:first-child img', { yPercent: 12, scale: 1.05, ease: 'none', scrollTrigger: { trigger: 'main section:first-child', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.set(element, { visibility: 'visible' });
    gsap.from(element, { y: 42, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
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
