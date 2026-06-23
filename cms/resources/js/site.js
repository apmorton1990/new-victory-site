// Mobile navigation toggle (hamburger). Works on the static site — bundled by
// Vite and loaded on every page.
document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-nav-toggle]');
  if (!toggle) return;

  const menu = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!menu) return;

  const isHidden = menu.classList.toggle('hidden');
  toggle.setAttribute('aria-expanded', String(!isHidden));

  // Swap the hamburger / close icons.
  toggle.querySelector('[data-nav-icon-open]')?.classList.toggle('hidden', !isHidden);
  toggle.querySelector('[data-nav-icon-close]')?.classList.toggle('hidden', isHidden);
});
