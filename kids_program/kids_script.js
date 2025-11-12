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
    let currentLang = localStorage.getItem('dta_lang') || localStorage.getItem('dta-lang') || 'de';

    async function loadTranslations() {
        try {
            const response = await fetch('kids_translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations = await response.json();
            translatePage(currentLang);
            populateDates();
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function translatePage(lang) {
        currentLang = lang;
        localStorage.setItem('dta_lang', lang);
        localStorage.setItem('dta-lang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        updateLangButtons();
        populateDates(lang); // Repopulate dates after language change
        document.dispatchEvent(new CustomEvent('dta:language-changed', { detail: { lang } }));
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
        { start: '2025-12-20T09:00:00', end: '2025-12-20T16:00:00', summary: 'Einführungs WE Jr. DTA - Tag 01' },
        { start: '2025-12-21T09:00:00', end: '2025-12-21T16:00:00', summary: 'Einführungs WE Jr. DTA - Tag 02' },
        { start: '2026-01-07T13:00:00', end: '2026-01-07T16:00:00', summary: 'Jr. DTA Training - No. 001' },
        { start: '2026-01-14T13:00:00', end: '2026-01-14T16:00:00', summary: 'Jr. DTA Training - No. 002' },
        { start: '2026-01-21T13:00:00', end: '2026-01-21T16:00:00', summary: 'Jr. DTA Training - No. 003' },
        { start: '2026-01-28T13:00:00', end: '2026-01-28T16:00:00', summary: 'Jr. DTA Training - No. 004' },
        { start: '2026-02-04T13:00:00', end: '2026-02-04T16:00:00', summary: 'Jr. DTA Training - No. 005' },
        { start: '2026-02-11T13:00:00', end: '2026-02-11T16:00:00', summary: 'Jr. DTA Training - No. 006' },
        { start: '2026-02-18T13:00:00', end: '2026-02-18T16:00:00', summary: 'Jr. DTA Training - No. 007' },
        { start: '2026-02-25T13:00:00', end: '2026-02-25T16:00:00', summary: 'Jr. DTA Training - No. 008' },
        { start: '2026-03-04T13:00:00', end: '2026-03-04T16:00:00', summary: 'Jr. DTA Training - No. 009' },
        { start: '2026-03-11T13:00:00', end: '2026-03-11T16:00:00', summary: 'Jr. DTA Training - No. 010' },
        { start: '2026-03-18T13:00:00', end: '2026-03-18T16:00:00', summary: 'Jr. DTA Training - No. 011' },
        { start: '2026-03-25T09:00:00', end: '2026-03-25T16:00:00', summary: 'Jr. DTA Training - No. 012' },
        { start: '2026-04-01T13:00:00', end: '2026-04-01T16:00:00', summary: 'Jr. DTA Training - No. 013' },
        { start: '2026-04-08T13:00:00', end: '2026-04-08T16:00:00', summary: 'Jr. DTA Training - No. 014' },
        { start: '2026-04-15T13:00:00', end: '2026-04-15T16:00:00', summary: 'Jr. DTA Training - No. 015' },
        { start: '2026-04-18T07:00:00', end: '2026-04-18T13:00:00', summary: 'Jr. DTA Abschluss Skitour Saison 25/26' },
    ];

    function populateDates(lang = currentLang) {
        const listEl = document.getElementById('event-dates-list');
        if (!listEl) return;

        const locale = lang === 'de' ? 'de-CH' : 'en-GB';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        
        listEl.innerHTML = ''; // Clear existing list
        trainingDates.forEach(date => {
            const startDate = new Date(date.start);
            const li = document.createElement('li');
            const summaryText = (translations[lang] && translations[lang][`summary_${date.summary.replace(/\s/g, '_')}`]) || date.summary;
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
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwyVkyk6U9u63vHRE066__Hm_B1jXm-ovxRDOe4yD82eoPyPubXi2C_YzDY0Hdz9ob2Qw/exec"; // <-- PUT THE URL FROM STEP 3 HERE

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

            // Client-side validation (good for user experience)
            if (age < 8 || age > 16) {
                statusEl.textContent = translations[currentLang]?.form_age_error || 'Child must be between 08 and 16 years old.';
                statusEl.className = 'text-sm text-center text-red-500 h-4';
                return;
            }

            statusEl.textContent = translations[currentLang]?.form_submitting || 'Submitting...';
            statusEl.className = 'text-sm text-center text-gray-400 h-4';
            form.querySelector('button[type="submit"]').disabled = true; // Disable button

            // --- Real Submission using fetch ---
            fetch(WEB_APP_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === "success") {
                    // Success!
                    statusEl.textContent = translations[currentLang]?.form_success || 'Thank you for your application! We will be in touch.';
                    statusEl.className = 'text-sm text-center text-green-500 h-4';
                    form.reset();
                } else {
                    // Handle error from Apps Script
                    throw new Error(data.message || 'Unknown error');
                }
            })
            .catch(error => {
                console.error("Form submission error:", error);
                statusEl.textContent = translations[currentLang]?.form_error || 'Submission failed. Please try again.';
                statusEl.className = 'text-sm text-center text-red-500 h-4';
            })
            .finally(() => {
                form.querySelector('button[type="submit"]').disabled = false; // Re-enable button
            });
        });
    }
