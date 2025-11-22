/**
 * ✦ Handcrafted for Demo Team Andermatt ✦
 * --------------------------------------------------------------
 * This JS file powers the interactive experience for the site.
 * It handles the preloader, multilingual content, dynamic grids, 
 * modals, and all other interactive elements.
 */

// --- PRELOADER LOGIC ---
// This runs as soon as the DOM is ready to set up animation delays.
document.addEventListener('DOMContentLoaded', () => {
    const logoPaths = document.querySelectorAll('#preloader-logo path, #preloader-logo polygon, #preloader-logo rect');
    logoPaths.forEach((path, index) => {
        // Set a custom property for the staggered CSS animation delay
        path.style.setProperty('--index', index);
    });
});

// This runs after all content (images, videos, etc.) has loaded.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a class to trigger the fade-out animation
        preloader.classList.add('loaded');
        // Completely remove the preloader after the transition to free up resources
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    }
});
// --- END PRELOADER LOGIC ---


// Main script execution starts after the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', async function() {

    let translations = {};
    const translationsUrl = new URL('translations.json', window.location.origin);
    // Check localStorage for a saved language, otherwise default to 'de'.
    let currentLang = localStorage.getItem('dta_lang') || 'de';

    // --- DATA OBJECTS ---
    const crewData = [
    { id: 'klara', name: "Klara", role: "Team-Mum", img: "./assets/images/crew/klara.webp", details_key: "klara_details" },
    { id: 'aline', name: "Aline", role: "Das Naturkind", img: "./assets/images/crew/aline.webp", details_key: "aline_details" },
    { id: 'maria', name: "Maria", role: "Die Pisten-Paganini", img: "./assets/images/crew/maria.webp", details_key: "maria_details" },
    { id: 'mathias', name: "Mathias", role: "Der Finanz-Zauberer", img: "./assets/images/crew/matic.webp", details_key: "mathias_details" },
    { id: 'pascal', name: "Pascal", role: "Der Präsi", img: "./assets/images/crew/pascal.webp", details_key: "pascal_details" },
    { id: 'roger', name: "Roger", role: "Der Pistenflüsterer", img: "./assets/images/crew/roger.webp", details_key: "roger_details" },
    { id: 'marcel', name: "Marcel", role: "Vizepräsi", img: "./assets/images/crew/Marcel.webp", details_key: "marcel_details" },
    { id: 'corsin', name: "Corsin", role: "Der Luftakrobat", img: "./assets/images/crew/corsin.webp", details_key: "corsin_details" },
    { id: 'lars', name: "Lars", role: "Der Hauptling", img: "./assets/images/crew/lars.webp", details_key: "lars_details" },
    { id: 'sales', name: "Sales", role: "Der Taktgeber", img: "./assets/images/crew/sales.webp", details_key: "sales_details" },
];
    
    // Placeholder for partners data, assuming it might be loaded elsewhere or from a file.
    const partnersData = [
        // Example: { name: "Partner One", logo: "path/to/logo.svg", url: "#" }
    ];


    // --- TRANSLATION & CONTENT ---
    async function loadTranslations() {
        console.log("Fetching translations...");
        try {
            const response = await fetch(translationsUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            translations = await response.json();
            window.dtaTranslations = translations;
            console.log("Translations loaded successfully.");
            // Set the initial language based on what was found in localStorage or the default.
            setLanguage(currentLang);
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function setLanguage(lang) {
        console.log(`Attempting to set language to: ${lang}`);
        if (!translations[lang]) {
            console.error(`Language "${lang}" not found in translations.`);
            return;
        }
        currentLang = lang;
        document.documentElement.lang = lang;
        // Save the new language choice to localStorage.
        localStorage.setItem('dta_lang', lang);

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            const value = translations[lang]?.[key];
            if (!value) {
                console.warn(`Translation key "${key}" not found for language "${lang}".`);
                return;
            }

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.textContent = value;
            }
        });
        updateLangButtons();
        console.log(`Language successfully set to: ${lang}`);
        window.dtaCurrentLang = currentLang;
        document.dispatchEvent(new CustomEvent('dta:language-changed', { detail: { lang } }));
    }
    
    function updateLangButtons() {
        ['desktop', 'mobile'].forEach(device => {
            const deBtn = document.getElementById(`lang-de-${device}`);
            const enBtn = document.getElementById(`lang-en-${device}`);
            if(deBtn && enBtn) {
                deBtn.classList.toggle('font-bold', currentLang === 'de');
                deBtn.classList.toggle('text-gray-400', currentLang !== 'de');
                enBtn.classList.toggle('font-bold', currentLang === 'en');
                enBtn.classList.toggle('text-gray-400', currentLang !== 'en');
            }
        });
    }

    
function initHeroVideoScrub() {
    const section = document.getElementById('hero');
    const video = document.getElementById('hero-video');
    if (!section || !video) return;

    const primeVideo = () => {
        const p = video.play();
        if (p && typeof p.then === 'function') {
            p.then(() => setTimeout(() => video.pause(), 60)).catch(() => {});
        } else {
            setTimeout(() => video.pause(), 60);
        }
    };

    const onReady = () => {
        let ticking = false;
        const getProgress = () => {
            const total = section.offsetHeight - window.innerHeight;
            const scrolled = Math.min(Math.max(window.scrollY - section.offsetTop, 0), total);
            return total > 0 ? (scrolled / total) : 0;
        };
        const update = () => {
            ticking = false;
            const progress = Math.min(Math.max(getProgress(), 0), 1);
            const t = (isFinite(video.duration) && video.duration > 0) ? progress * video.duration : 0;
            if (!isNaN(t)) {
                try { video.currentTime = t; } catch (e) {}
            }
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };
        video.pause();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        onScroll();
    };

    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('preload', 'auto');
    video.setAttribute('autoplay', '');

    if (video.readyState >= 1 && isFinite(video.duration)) {
        primeVideo();
        onReady();
    } else {
        video.addEventListener('loadedmetadata', () => { primeVideo(); onReady(); }, { once: true });
        setTimeout(() => { primeVideo(); onReady(); }, 2000);
    }
}

    function initCrewGrid() {
        const grid = document.querySelector('#crew .grid'); // Reverted to original selector
        if (!grid) return;
        grid.innerHTML = crewData.map(member => `
            <div class="crew-member group cursor-pointer" data-member-id="${member.id}" data-details-key="${member.details_key}">
                <div class="relative overflow-hidden rounded-lg">
                    <img src="${member.img}" alt="${member.name}" class="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 class="mt-4 text-xl font-bold orange-first-letter">${member.name}</h3>
                <p class="text-gray-400 orange-first-letter" data-key="crew_${member.id}_title">${member.role}</p>
            </div>
        `).join('');
    }

    function initModal() {
        const modalContainer = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        const crewGrid = document.querySelector('#crew .grid'); // Reverted to original selector

        if (!modalContainer || !modalContent || !crewGrid) return;
        
        crewGrid.addEventListener('click', (e) => {
            const memberEl = e.target.closest('.crew-member');
            if (memberEl) {
                const memberId = memberEl.dataset.memberId;
                const member = crewData.find(m => m.id === memberId);
                if (member) {
                    const detailsText = translations[currentLang]?.[member.details_key] || "Details coming soon.";
                    const roleText = translations[currentLang]?.[`crew_${member.id}_title`] || member.role;

                    modalContent.innerHTML = `
                        <button id="modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                        <img src="${member.img}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-neutral-800">
                        <h3 class="text-2xl font-bold text-center orange-first-letter">${member.name}</h3>
                        <p class="text-red-400 text-center mb-4">${roleText}</p>
                        <p class="text-gray-300">${detailsText}</p>
                    `;
                    modalContainer.classList.add('active');
                    modalContent.classList.add('active');
                }
            }
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer || e.target.closest('#modal-close')) {
                modalContainer.classList.remove('active');
                modalContent.classList.remove('active');
            }
        });
    }
    
  function initSponsorshipForm() {
    const form = document.getElementById('sponsorship-form');
    if (!form) return;

    // IMPORTANT: Ensure this SCRIPT_URL is correct for your deployed web app
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOTQxqrInGeyZVcL9Zr_6oPYJ2PlAoY-zvERsUtVMUddlT-MddeRqF1bNT99mq5Eg8/exec';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const statusEl = document.getElementById('form-status');
        const btn = form.querySelector('button[type="submit"]');

        // 1. Basic UI Loading State
        const originalBtnText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        statusEl.textContent = '';
        statusEl.className = 'text-sm text-gray-400 mt-2';

        // 2. Prepare Data (Fix Applied Here)
        const formData = new FormData(form);
        // Append current language 
        formData.append('lang', window.dtaCurrentLang || 'de');
        
        // Convert FormData to URLSearchParams for robust GAS compatibility
        const urlEncodedData = new URLSearchParams(formData);

        // 3. Send to Google Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            // Set the Content-Type header explicitly for URLSearchParams
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlEncodedData // Use URL-encoded data as the body
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                statusEl.textContent = (window.dtaCurrentLang === 'en') 
                    ? 'Thank you! We have received your message.' 
                    : 'Danke! Wir haben deine Nachricht erhalten.';
                statusEl.className = 'text-sm text-green-400 mt-2';
                form.reset();
            } else {
                throw new Error('Server responded with error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusEl.textContent = (window.dtaCurrentLang === 'en')
                ? 'Something went wrong. Please try again or email us directly.'
                : 'Etwas ist schief gelaufen. Bitte versuche es erneut oder schreibe uns direkt.';
            statusEl.className = 'text-sm text-red-400 mt-2';
        })
        .finally(() => {
            btn.textContent = originalBtnText;
            btn.disabled = false;
        });
    });
}

    function initPartnersGrid() {
        const grid = document.getElementById('partners-grid');
        if (!grid || !partnersData) return;
        grid.innerHTML = partnersData.map(partner => `
            <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="flex justify-center items-center p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                <img src="${partner.logo}" alt="${partner.name}" class="max-h-12 w-auto filter grayscale hover:filter-none transition-all duration-300">
            </a>
        `).join('');
    }

    function resolveLegalHref() {
        try {
            return new URL('../legal.html', window.location.href).href;
        } catch (err) {
            console.warn('Falling back to relative legal link due to URL parsing issue:', err);
            return 'legal.html';
        }
    }

    function buildCookieToast(legalHref) {
        const toast = document.createElement('div');
        toast.id = 'dta-cookie-toast';
        toast.className = 'cookie-toast';
        toast.setAttribute('aria-hidden', 'true');
        toast.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-icon" aria-hidden="true">🍪</div>
                <div class="cookie-text">
                    <h4 class="text-white font-bold" data-key="cookie_heading">We prefer fresh Powder.</h4>
                    <p class="text-gray-400 text-sm mt-1">
                        <span data-key="cookie_body">We don't use tracking cookies—just a few technical crumbs to keep the site running. No spying, just skiing.</span>
                        <a class="underline hover:text-white transition-colors" data-cookie-legal-link data-key="cookie_link_text" href="${legalHref}">Read the legal stuff.</a>
                    </p>
                </div>
            </div>
            <button id="cookie-accept-btn" class="cookie-btn" type="button" data-key="cookie_button">Shred On</button>
        `;
        return toast;
    }

    function initCookieToast() {
        if (!document.body) return;

        const legalHref = resolveLegalHref();
        let cookieToast = document.getElementById('dta-cookie-toast');

        if (!cookieToast) {
            cookieToast = buildCookieToast(legalHref);
            document.body.appendChild(cookieToast);
        } else {
            const existingLink = cookieToast.querySelector('[data-cookie-legal-link]');
            if (existingLink) existingLink.href = legalHref;
        }

        const acceptBtn = cookieToast.querySelector('#cookie-accept-btn');
        if (!cookieToast || !acceptBtn) return;

        const storageKey = 'dta_cookie_consent';
        const safeGet = () => {
            try {
                return window.localStorage.getItem(storageKey);
            } catch (err) {
                console.warn('Cookie consent storage unavailable:', err);
                return null;
            }
        };

        const safeSet = () => {
            try {
                window.localStorage.setItem(storageKey, 'true');
            } catch (err) {
                console.warn('Cookie consent storage unavailable:', err);
            }
        };

        const showToast = () => {
            cookieToast.classList.add('is-visible');
            cookieToast.setAttribute('aria-hidden', 'false');
        };

        const hideToast = () => {
            cookieToast.classList.remove('is-visible');
            cookieToast.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                cookieToast.style.display = 'none';
            }, 600);
        };

        if (!safeGet()) {
            setTimeout(() => {
                if (!safeGet()) {
                    showToast();
                }
            }, 1500);
        }

        acceptBtn.addEventListener('click', () => {
            safeSet();
            hideToast();
        });
    }

    function initJournalScroller() {
        const container = document.getElementById('journal-scroll-container');
        const scrollLeftBtn = document.getElementById('journal-scroll-left');
        const scrollRightBtn = document.getElementById('journal-scroll-right');
        const journalSection = document.getElementById('journal');

        if (!container || !journalSection) return;

        const resolveEntryLink = (filePath) => {
            if (!filePath) return '#';
            if (/^(https?:)?\/\//.test(filePath)) return filePath;
            const clean = filePath.replace(/^(\.\/|\.\.\/)+/, '');
            const fileName = clean.split('/').pop();
            return `./journal/${fileName}`;
        };

        const resolveImageSrc = (imagePath) => {
            if (!imagePath) return '';
            if (/^(https?:)?\/\//.test(imagePath)) return imagePath;
            const clean = imagePath.replace(/^(\.\/|\.\.\/)+/, '');
            return `./${clean}`;
        };

        fetch('./journal/journal_manifest.json')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(entries => {
                if (entries.length === 0) {
                    journalSection.style.display = 'none';
                    return;
                }

                container.innerHTML = entries.map(entry => `
                    <div class="journal-card bg-gray-800 rounded-lg overflow-hidden flex flex-col group">
                        <a href="${resolveEntryLink(entry.file)}" class="block">
                            <div class="overflow-hidden">
                                <img src="${resolveImageSrc(entry.image)}" alt="${entry.title}" class="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300">
                            </div>
                            <div class="p-6">
                                <p class="text-xs text-gray-400 uppercase">${entry.date}</p>
                                <h3 class="text-xl font-bold mt-2 text-white">${entry.title}</h3>
                                <p class="text-gray-300 mt-2 text-sm">${entry.caption}</p>
                            </div>
                        </a>
                    </div>
                `).join('');

                const updateButtons = () => {
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    scrollLeftBtn.disabled = container.scrollLeft < 10;
                    scrollRightBtn.disabled = container.scrollLeft > maxScroll - 10;
                };

                container.addEventListener('scroll', updateButtons, { passive: true });
                
                scrollLeftBtn.addEventListener('click', () => {
                    const cardWidth = container.querySelector('.journal-card').offsetWidth;
                    container.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' }); // 24px is the gap
                });

                scrollRightBtn.addEventListener('click', () => {
                    const cardWidth = container.querySelector('.journal-card').offsetWidth;
                    container.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
                });
                
                updateButtons(); // Initial check
            })
            .catch(error => {
                console.error('Failed to load journal entries:', error);
                journalSection.style.display = 'none'; // Hide section on error
            });
    }

    // --- EVENT LISTENERS for Language Buttons ---
    [
        ['lang-de-desktop', 'de'],
        ['lang-en-desktop', 'en'],
        ['lang-de-mobile', 'de'],
        ['lang-en-mobile', 'en'],
    ].forEach(([id, lang]) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => setLanguage(lang));
    });

    // --- INITIALIZATION CALLS ---
    initHeroVideoScrub();
    initCrewGrid();
    initJournalScroller();
    initModal();
    initSponsorshipForm();
    initPartnersGrid();
    initCookieToast();
    await loadTranslations();

});


function ensurePlaceholdersFromAria() {
  document.querySelectorAll('input[data-key], textarea[data-key]').forEach(el => {
    const ph = el.getAttribute('placeholder');
    if (!ph || ph.trim().length === 0) {
      const fallback = el.getAttribute('aria-label') || el.getAttribute('data-key') || '';
      if (fallback) el.setAttribute('placeholder', fallback);
    }
  });
}

document.addEventListener('DOMContentLoaded', ensurePlaceholdersFromAria);


document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Partner logos (white background friendly) ---------- */
  const partnerGrid = document.querySelector('.partner-grid');
  if (partnerGrid) {
    fetch('./assets/images/partners/partners.json')
      .then(r => r.json())
      .then(data => {
        partnerGrid.innerHTML = '';
        (data.partners || []).forEach(p => {
          const a = document.createElement('a');
          a.href = p.url; a.target = '_blank'; a.rel = 'noopener noreferrer';

          const img = document.createElement('img');
          img.src = p.logo_path;          // light/white background version
          img.alt = p.name;
          img.classList.add('partner-logo');

          a.appendChild(img);
          partnerGrid.appendChild(a);
        });
      })
      .catch(err => console.error('Error loading partners:', err));
  }

  /* ---------- Nav: active link, shadow on scroll, active language ---------- */
  const links = document.querySelectorAll('.nav-links a');
  const path  = location.pathname.replace(/\/+$/, '');
  links.forEach(a => {
    const href = a.getAttribute('href');
    const normalized = href ? href.replace(/^\.\//, '').split('#')[0] : '';
    const isActive = normalized && path.endsWith(normalized);
    if (isActive || (href === 'legal.html' && path.endsWith('legal.html'))) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 4) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const currentLang = (new URLSearchParams(location.search)).get('lang') || window.currentLang || 'de';
  const langBtn = document.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
  if (langBtn) langBtn.classList.add('is-active');
});
