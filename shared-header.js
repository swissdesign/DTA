// Shared header renderer for Demo Team Andermatt
(function() {
  const script = document.currentScript;
  const base = script?.dataset.base || '.';
  const targetId = script?.dataset.target || 'site-header';
  const target = document.getElementById(targetId);

  if (!target) {
    console.warn(`[header] Target element "${targetId}" not found.`);
    return;
  }

  const normalizedBase = base.replace(/\/$/, '');
  const path = (relative) => {
    const cleanRelative = relative.replace(/^\/+/, '');
    return `${normalizedBase}/${cleanRelative}`.replace(/\/{2,}/g, '/');
  };

  const textColorClass = script?.dataset.textColor || '';

  const headerWrapper = document.createElement('div');
  headerWrapper.innerHTML = `
  <header class="fixed top-0 left-0 w-full z-50 transition-all-300 bg-transparent ${textColorClass}" id="main-header">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <a class="z-50 block" href="${path('index.html')}" aria-label="Back to homepage">
        <span id="header-logo" class="block w-[100px] h-[100px]" aria-hidden="true"></span>
      </a>

      <nav class="hidden md:flex items-center space-x-6">
        <a class="px-2 py-1 hover:text-gray-600 orange-first-letter" data-key="nav_crew" href="${path('index.html#crew')}">Crew</a>
        <a class="px-2 py-1 hover:text-gray-600 orange-first-letter" data-key="nav_journal" href="${path('journal/journal.html')}">The Journal</a>
        <a class="px-2 py-1 hover:text-gray-600 orange-first-letter" data-key="nav_kids" href="${path('kids_program/Kids.html')}">jr.DTA</a>
        <a class="px-2 py-1 hover:text-gray-600 orange-first-letter" data-key="nav_turnen" href="${path('turnen/turnen.html')}">Turnen</a>
        <a class="px-2 py-1 hover:text-gray-600 orange-first-letter" data-key="nav_sponsorship" href="${path('sponsoring/sponsoring.html')}">Sponsoring</a>
        <div class="flex items-center gap-3">
          <button class="uppercase text-sm" id="lang-de-desktop" type="button">DE</button>
          <span class="opacity-50">/</span>
          <button class="uppercase text-sm" id="lang-en-desktop" type="button">EN</button>
        </div>
      </nav>

      <button aria-label="Open menu" class="hamburger md:hidden" id="mobile-menu-button" aria-controls="mobile-menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
    <div class="fixed inset-y-0 right-0 w-72 bg-black/90 backdrop-blur-lg transform translate-x-full transition-transform md:hidden z-40" id="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-heading">
      <h2 id="mobile-menu-heading" class="sr-only">Main Menu</h2>
      <nav class="p-6 space-y-4">
        <a class="block text-lg mobile-nav-link orange-first-letter text-white" data-key="nav_crew" href="${path('index.html#crew')}">Crew</a>
        <a class="block text-lg mobile-nav-link orange-first-letter text-white" data-key="nav_journal" href="${path('journal/journal.html')}">The Journal</a>
        <a class="block text-lg mobile-nav-link orange-first-letter text-white" data-key="nav_kids" href="${path('kids_program/Kids.html')}">jr.DTA</a>
        <a class="block text-lg mobile-nav-link orange-first-letter text-white" data-key="nav_turnen" href="${path('turnen/turnen.html')}">Turnen</a>
        <a class="block text-lg mobile-nav-link orange-first-letter" data-key="nav_sponsorship" href="${path('sponsoring/sponsoring.html')}">Sponsoring</a>
        <div class="pt-4 flex items-center gap-3 text-white">
          <button class="uppercase text-sm" id="lang-de-mobile" type="button">DE</button>
          <span class="opacity-50">/</span>
          <button class="uppercase text-sm" id="lang-en-mobile" type="button">EN</button>
        </div>
      </nav>
    </div>
  </header>`;

  const header = headerWrapper.firstElementChild;
  target.replaceWith(header);

  const logoContainer = document.getElementById('header-logo');
  const logoPath = path('assets/logo.svg');
  if (logoContainer) {
    fetch(logoPath)
      .then(resp => resp.ok ? resp.text() : Promise.reject(new Error(`HTTP ${resp.status}`)))
      .then(svgText => {
        logoContainer.innerHTML = svgText;
        const svgEl = logoContainer.querySelector('svg');
        if (svgEl) {
          svgEl.setAttribute('fill', 'currentColor');
          svgEl.setAttribute('aria-hidden', 'true');
          svgEl.classList.add('w-[100px]', 'h-[100px]');
          svgEl.removeAttribute('width');
          svgEl.removeAttribute('height');
        }
      })
      .catch(err => {
        console.warn(`[header] Failed to load logo from ${logoPath}:`, err);
        logoContainer.textContent = 'DTA'; // Fallback text
        logoContainer.classList.add('flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold');
      });
  }

  const headerElement = document.getElementById('main-header');
  if (headerElement) {
    window.addEventListener('scroll', () => {
      headerElement.classList.toggle('header-scrolled', window.scrollY > 50);
    });
  }

  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.classList.remove('is-active');
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
  };

  if (menuButton && mobileMenu) {
    const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    menuButton.setAttribute('aria-expanded', 'false');

    const toggleMenu = () => {
      const isOpening = mobileMenu.classList.contains('translate-x-full');
      menuButton.classList.toggle('is-active', isOpening);
      menuButton.setAttribute('aria-expanded', String(isOpening));
      mobileMenu.classList.toggle('translate-x-full');
      document.body.classList.toggle('overflow-hidden', isOpening);
    };

    menuButton.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  window.dtaHeaderInitialized = true;
})();
