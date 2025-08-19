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
    let currentLang = 'de'; // Default language

    // --- DATA OBJECTS ---
    const crewData = [
        { name: "Mathias", role: "Der Finanz-Zauberer", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/mathias.webp", details_key: "mathias_details" },
        { name: "Pascal", role: "Der Präsi", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Pascal.webp", details_key: "pascal_details" },
        { name: "Roger", role: "Der Pistenflüsterer", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Roger.webp", details_key: "roger_details" },
        { name: "Marcel", role: "Vizepräsi", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Marcel.webp", details_key: "marcel_details" },
        { name: "Corsin", role: "Der Luftakrobat", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Corsin.webp", details_key: "corsin_details" },
        { name: "Lars", role: "Der Hauptling", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Lars.webp", details_key: "lars_details" },
        { name: "Sales", role: "Der Taktgeber", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Sales.webp", details_key: "sales_details" },
        { name: "Klara", role: "Team-Mum", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Klara.webp", details_key: "klara_details" },
        { name: "Aline", role: "Das Naturkind", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Aline.webp", details_key: "aline_details" },
        { name: "Maria", role: "Die Pisten-Paganini", img: "https://github.com/swissdesign/dta/raw/main/assets/images/crew/Maria.webp", details_key: "maria_details" }
    ];
    
    const partnersData = [
       { name: "Andermatt", logo: "https://github.com/swissdesign/dta/raw/main/assets/images/partners/andermatt.svg", url: "#" },
       { name: "Mammut", logo: "https://github.com/swissdesign/dta/raw/main/assets/images/partners/mammut.svg", url: "#" },
       { name: "Stöckli", logo: "https://github.com/swissdesign/dta/raw/main/assets/images/partners/stockli.svg", url: "#" },
    ];

    // --- TRANSLATION & CONTENT ---
    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            translations = await response.json();
            translatePage(currentLang);
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function translatePage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang]?.[key]) {
                el.innerHTML = translations[lang][key];
            }
        });
        updateLangButtons();
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
        const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

        if (!menuButton || !mobileMenu) return;

        const toggleMenu = () => {
            menuButton.classList.toggle('is-active');
            mobileMenu.classList.toggle('translate-x-full');
            document.body.classList.toggle('overflow-hidden');
        };

        menuButton.addEventListener('click', toggleMenu);
        navLinks.forEach(link => link.addEventListener('click', toggleMenu));
    }

    function initHeroVideoScrub() {
        const video = document.getElementById('hero-video');
        if (!video) return;
        video.pause();
        video.currentTime = 0;
        window.addEventListener('scroll', () => {
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;
            const scrollPosition = window.scrollY;
            const sectionHeight = heroSection.offsetHeight;
            if (scrollPosition < sectionHeight) {
                // Ensure video time doesn't exceed duration
                const newTime = video.duration * (scrollPosition / sectionHeight);
                if (isFinite(newTime)) {
                    video.currentTime = newTime;
                }
            }
        });
    }

    function initCrewGrid() {
        const grid = document.querySelector('#crew .grid');
        if (!grid) return;
        grid.innerHTML = crewData.map(member => `
            <div class="crew-member group cursor-pointer" data-name="${member.name}" data-details-key="${member.details_key}">
                <div class="relative overflow-hidden rounded-lg">
                    <img src="${member.img}" alt="${member.name}" class="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-300">
                    <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <h3 class="mt-4 text-xl font-bold">${member.name}</h3>
                <p class="text-gray-400">${member.role}</p>
            </div>
        `).join('');
    }

    function initModal() {
        const modalContainer = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        const crewGrid = document.querySelector('#crew .grid');

        if (!modalContainer || !modalContent || !crewGrid) return;
        
        crewGrid.addEventListener('click', (e) => {
            const memberEl = e.target.closest('.crew-member');
            if (memberEl) {
                const memberName = memberEl.dataset.name;
                const member = crewData.find(m => m.name === memberName);
                if (member) {
                    const detailsText = translations[currentLang]?.[member.details_key] || "Details coming soon.";
                    modalContent.innerHTML = `
                        <button id="modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                        <img src="${member.img}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-2xl font-bold text-center">${member.name}</h3>
                        <p class="text-gray-400 text-center mb-4">${member.role}</p>
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
        if (!grid) return;
        grid.innerHTML = partnersData.map(partner => `
            <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="flex justify-center items-center p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                <img src="${partner.logo}" alt="${partner.name}" class="max-h-12 w-auto filter grayscale hover:filter-none transition-all duration-300">
            </a>
        `).join('');
    }

    // --- EVENT LISTENERS ---
    document.getElementById('lang-de-desktop').addEventListener('click', () => translatePage('de'));
    document.getElementById('lang-en-desktop').addEventListener('click', () => translatePage('en'));
    document.getElementById('lang-de-mobile').addEventListener('click', () => translatePage('de'));
    document.getElementById('lang-en-mobile').addEventListener('click', () => translatePage('en'));
    
    // --- INITIALIZATION CALLS ---
    initHeaderScroll();
    initMobileMenu();
    initHeroVideoScrub();
    initCrewGrid();
    initModal();
    initSponsorshipForm();
    initPartnersGrid();
    await loadTranslations();
});
