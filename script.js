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
    // Check localStorage for a saved language, otherwise default to 'de'.
    let currentLang = localStorage.getItem('dta_lang') || 'de';

    // --- DATA OBJECTS ---
    const crewData = [
    { id: 'Klara', name: "<h5>K</h5>lara", role: "Team-Mum", img: "./assets/images/crew/Klara.webp", details_key: "klara_details" },
    { id: 'Aline', name: "<h5>A</h5>line", role: "Das Naturkind", img: "./assets/images/crew/Aline.webp", details_key: "aline_details" },
    { id: 'Maria', name: "<h5>M</h5>aria", role: "Die Pisten-Paganini", img: "./assets/images/crew/Maria.webp", details_key: "maria_details" },
    { id: 'Mathias', name: "<h5>M</h5>athias", role: "Der Finanz-Zauberer", img: "./assets/images/crew/mathias.webp", details_key: "mathias_details" },
    { id: 'Pascal', name: "<h5>P</h5>ascal", role: "Der Präsi", img: "./assets/images/crew/Pascal.webp", details_key: "pascal_details" },
    { id: 'Roger', name: "<h5>R</h5>oger", role: "Der Pistenflüsterer", img: "./assets/images/crew/Roger.webp", details_key: "roger_details" },
    { id: 'Marcel', name: "<h5>M</h5>arcel", role: "Vizepräsi", img: "./assets/images/crew/Marcel.webp", details_key: "marcel_details" },
    { id: 'Corsin', name: "<h5>C</h5>orsin", role: "Der Luftakrobat", img: "./assets/images/crew/Corsin.webp", details_key: "corsin_details" },
    { id: 'Lars', name: "<h5>L</h5>ars", role: "Der Hauptling", img: "./assets/images/crew/Lars.webp", details_key: "lars_details" },
    { id: 'Sales', name: "<h5>S</h5>ales", role: "Der Taktgeber", img: "./assets/images/crew/Sales.webp", details_key: "sales_details" },
];
    
    // Placeholder for partners data, assuming it might be loaded elsewhere or from a file.
    const partnersData = [
        // Example: { name: "Partner One", logo: "path/to/logo.svg", url: "#" }
    ];


    // --- TRANSLATION & CONTENT ---
    async function loadTranslations() {
        console.log("Fetching translations...");
        try {
            const response = await fetch('translations.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            translations = await response.json();
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
            if (translations[lang]?.[key]) {
                el.innerHTML = translations[lang][key];
            } else {
                 console.warn(`Translation key "${key}" not found for language "${lang}".`);
            }
        });
        updateLangButtons();
        console.log(`Language successfully set to: ${lang}`);
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

    // --- UI INITIALIZATION ---
    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('header-scrolled', window.scrollY > 50);
        });
    }

    function initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!menuButton || !mobileMenu) return;
        
        const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

        const toggleMenu = () => {
            menuButton.classList.toggle('is-active');
            mobileMenu.classList.toggle('translate-x-full');
            document.body.classList.toggle('overflow-hidden');
        };

        menuButton.addEventListener('click', toggleMenu);
        navLinks.forEach(link => link.addEventListener('click', toggleMenu));
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
            <div class="crew-member group cursor-pointer" data-name="${member.name}" data-details-key="${member.details_key}">
                <div class="relative overflow-hidden rounded-lg">
                    <img src="${member.img}" alt="${member.name}" class="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 class="mt-4 text-xl font-bold">${member.name}</h3>
                <p class="text-gray-400" data-key="crew_${member.id.toLowerCase()}_title">${member.role}</p>
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
                const memberName = memberEl.dataset.name;
                const member = crewData.find(m => m.name === memberName);
                if (member) {
                    const detailsText = translations[currentLang]?.[member.details_key] || "Details coming soon.";
                    const roleText = translations[currentLang]?.[`crew_${member.id.toLowerCase()}_title`] || member.role;

                    modalContent.innerHTML = `
                        <button id="modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                        <img src="${member.img}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-neutral-800">
                        <h3 class="text-2xl font-bold text-center">${member.name}</h3>
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Sending...';
            setTimeout(() => {
                statusEl.textContent = 'Thank you! We will be in touch soon.';
                form.reset();
            }, 1000);
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

    function initJournalScroller() {
        const container = document.getElementById('journal-scroll-container');
        const scrollLeftBtn = document.getElementById('journal-scroll-left');
        const scrollRightBtn = document.getElementById('journal-scroll-right');
        const journalSection = document.getElementById('journal');

        if (!container || !journalSection) return;

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
                        <a href="${entry.file}" class="block">
                            <div class="overflow-hidden">
                                <img src="${entry.image}" alt="${entry.title}" class="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300">
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
    document.getElementById('lang-de-desktop').addEventListener('click', () => setLanguage('de'));
    document.getElementById('lang-en-desktop').addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-de-mobile').addEventListener('click', () => setLanguage('de'));
    document.getElementById('lang-en-mobile').addEventListener('click', () => setLanguage('en'));
    
    // --- INITIALIZATION CALLS ---
    initHeaderScroll();
    initMobileMenu();
    initHeroVideoScrub();
    initCrewGrid();
    initJournalScroller();
    initModal();
    initSponsorshipForm();
    initPartnersGrid();
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
