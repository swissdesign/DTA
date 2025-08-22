// DTA Kids Program - Specific JS
document.addEventListener('DOMContentLoaded', async () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 500); // Give a little delay for content to render
        });
    }

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        menuButton.classList.toggle('is-active');
        mobileMenu.classList.toggle('translate-x-full');
        document.body.classList.toggle('overflow-hidden');
    };

    menuButton.addEventListener('click', toggleMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // --- Translations ---
    let translations = {};
    let currentLang = localStorage.getItem('dta-lang') || 'de';

    async function loadTranslations() {
        try {
            const response = await fetch('kids_translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations = await response.json();
            translatePage(currentLang);
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function translatePage(lang) {
        currentLang = lang;
        localStorage.setItem('dta-lang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        updateLangButtons();
        populateDates(); // Repopulate dates after language change
    }

    function updateLangButtons() {
        const langButtons = [
            document.getElementById('lang-de-desktop'),
            document.getElementById('lang-en-desktop'),
            document.getElementById('lang-de-mobile'),
            document.getElementById('lang-en-mobile')
        ];
        langButtons.forEach(btn => {
            if (btn) {
                btn.classList.remove('active-lang');
                if ((btn.id.includes('de') && currentLang === 'de') || (btn.id.includes('en') && currentLang === 'en')) {
                    btn.classList.add('active-lang');
                }
            }
        });
    }

    document.getElementById('lang-de-desktop')?.addEventListener('click', () => translatePage('de'));
    document.getElementById('lang-en-desktop')?.addEventListener('click', () => translatePage('en'));
    document.getElementById('lang-de-mobile')?.addEventListener('click', () => translatePage('de'));
    document.getElementById('lang-en-mobile')?.addEventListener('click', () => translatePage('en'));

    // --- Season Dates & ICS Download ---
    const trainingDates = [
        { start: '2025-12-10T13:00:00', end: '2025-12-10T16:00:00', summary: 'DTA Kids Training' },
        { start: '2025-12-17T13:00:00', end: '2025-12-17T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-01-07T13:00:00', end: '2026-01-07T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-01-14T13:00:00', end: '2026-01-14T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-01-21T13:00:00', end: '2026-01-21T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-01-28T13:00:00', end: '2026-01-28T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-02-04T13:00:00', end: '2026-02-04T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-02-11T13:00:00', end: '2026-02-11T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-02-25T13:00:00', end: '2026-02-25T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-03-04T13:00:00', end: '2026-03-04T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-03-11T13:00:00', end: '2026-03-11T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-03-18T13:00:00', end: '2026-03-18T16:00:00', summary: 'DTA Kids Training' },
        { start: '2026-03-25T09:00:00', end: '2026-03-25T16:00:00', summary: 'DTA Kids - Final Session & Celebration' },
    ];

    function populateDates() {
        const listEl = document.getElementById('event-dates-list');
        if (!listEl) return;
        
        const locale = currentLang === 'de' ? 'de-CH' : 'en-GB';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        listEl.innerHTML = ''; // Clear existing list
        trainingDates.forEach(date => {
            const startDate = new Date(date.start);
            const li = document.createElement('li');
            const summaryText = (translations[currentLang] && translations[currentLang][`summary_${date.summary.replace(/\s/g, '_')}`]) || date.summary;
            li.textContent = `${startDate.toLocaleDateString(locale, options)} - ${summaryText}`;
            listEl.appendChild(li);
        });
    }

    function generateICS() {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//DemoteamAndermatt//DTA Kids Calendar//EN',
        ];

        trainingDates.forEach(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const uid = `${startDate.toISOString().replace(/[-:.]/g, '')}@demoteamandermatt.ch`;

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(`UID:${uid}`);
            icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`DTSTART:${startDate.toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`DTEND:${endDate.toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`SUMMARY:${event.summary}`);
            icsContent.push('LOCATION:Andermatt Ski Area');
            icsContent.push('END:VEVENT');
        });

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
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

    document.getElementById('download-ics')?.addEventListener('click', () => {
        const icsData = generateICS();
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "DTA_Kids_Schedule_25-26.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // --- Application Form ---
    const form = document.getElementById('kids-application-form');
    if (form) {
        const statusEl = document.getElementById('form-status');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const dob = new Date(formData.get('child_dob'));
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }

            if (age < 10 || age > 15) {
                statusEl.textContent = translations[currentLang]?.form_age_error || 'Child must be between 10 and 15 years old.';
                statusEl.className = 'text-sm text-center text-red-500 h-4';
                return;
            }

            statusEl.textContent = translations[currentLang]?.form_submitting || 'Submitting...';
            statusEl.className = 'text-sm text-center text-gray-400 h-4';

            // Fake submission delay
            setTimeout(() => {
                statusEl.textContent = translations[currentLang]?.form_success || 'Thank you for your application! We will be in touch.';
                statusEl.className = 'text-sm text-center text-green-500 h-4';
                form.reset();
            }, 1500);
        });
    }

    // Initial Load
    await loadTranslations();
});
