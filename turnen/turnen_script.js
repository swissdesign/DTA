// DTA Turnen Program - Specific JS
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

    // --- Translations & Constants ---
    const MIN_AGE = 16;
    let translations = {};
    let currentLang = localStorage.getItem('dta_lang') || localStorage.getItem('dta-lang') || 'de';

    async function loadTranslations() {
        try {
            const response = await fetch('turnen_translations.json');
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
            const translationSet = translations[lang] || {};
            if (translationSet && translationSet[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translationSet[key];
                } else {
                    element.textContent = translationSet[key];
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
        {
            start: '2026-01-07T19:30:00',
            end: '2026-01-07T21:00:00',
            summaryKey: 'summary_turnen_01',
            fallbackSummaries: {
                en: 'Gymnastics - Day 01 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 01 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-01-14T19:30:00',
            end: '2026-01-14T21:00:00',
            summaryKey: 'summary_turnen_02',
            fallbackSummaries: {
                en: 'Gymnastics - Day 02 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 02 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-01-21T19:30:00',
            end: '2026-01-21T21:00:00',
            summaryKey: 'summary_turnen_03',
            fallbackSummaries: {
                en: 'Gymnastics - Day 03 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 03 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-01-28T19:30:00',
            end: '2026-01-28T21:00:00',
            summaryKey: 'summary_turnen_04',
            fallbackSummaries: {
                en: 'Gymnastics - Day 04 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 04 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-02-04T19:30:00',
            end: '2026-02-04T21:00:00',
            summaryKey: 'summary_turnen_05',
            fallbackSummaries: {
                en: 'Gymnastics - Day 05 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 05 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-02-11T19:30:00',
            end: '2026-02-11T21:00:00',
            summaryKey: 'summary_turnen_06',
            fallbackSummaries: {
                en: 'Gymnastics - Day 06 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 06 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-02-18T19:30:00',
            end: '2026-02-18T21:00:00',
            summaryKey: 'summary_turnen_07',
            fallbackSummaries: {
                en: 'Gymnastics - Day 07 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 07 (Aula Bodenschulhaus, Andermatt)'
            }
        },
        {
            start: '2026-02-25T19:30:00',
            end: '2026-02-25T21:00:00',
            summaryKey: 'summary_turnen_08',
            fallbackSummaries: {
                en: 'Gymnastics - Day 08 (Aula Bodenschulhaus, Andermatt)',
                de: 'Turnen - Tag 08 (Aula Bodenschulhaus, Andermatt)'
            }
        }
    ];

    const getEventSummary = (event, lang = currentLang) => {
        const translationSet = translations[lang] || {};
        if (translationSet[event.summaryKey]) {
            return translationSet[event.summaryKey];
        }
        if (event.fallbackSummaries) {
            if (event.fallbackSummaries[lang]) {
                return event.fallbackSummaries[lang];
            }
            const fallbackValues = Object.values(event.fallbackSummaries);
            if (fallbackValues.length) {
                return fallbackValues[0];
            }
        }
        return '';
    };


    function populateDates(lang = currentLang) {
        const listEl = document.getElementById('event-dates-list');
        if (!listEl) return;

        const locale = lang === 'de' ? 'de-CH' : 'en-GB';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        listEl.innerHTML = '';
        trainingDates.forEach(date => {
            const startDate = new Date(date.start);
            const summaryText = getEventSummary(date, lang);
            if (!Number.isNaN(startDate.getTime())) {
                const li = document.createElement('li');
                li.textContent = `${startDate.toLocaleDateString(locale, options)} - ${summaryText}`;
                listEl.appendChild(li);
            } else {
                console.warn(`Invalid date in trainingDates, skipping: "${date.start}"`);
            }
        });
    }

    function generateICS(lang = currentLang) {
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//DemoteamAndermatt//DTA Turnen Calendar//EN',
        ];

        trainingDates.forEach(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            const uid = `${startDate.toISOString().replace(/[-:.]/g, '')}@demoteamandermatt.ch`;
            const summaryText = getEventSummary(event, lang) || 'Turnen Training';

            icsContent.push('BEGIN:VEVENT');
            icsContent.push(`UID:${uid}`);
            icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`DTSTART:${startDate.toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`DTEND:${endDate.toISOString().replace(/[-:.]/g, '')}Z`);
            icsContent.push(`SUMMARY:${summaryText}`);
            icsContent.push('LOCATION:Andermatt Ski Area');
            icsContent.push('END:VEVENT');
        });

        icsContent.push('END:VCALENDAR');
        return icsContent.join('\r\n');
    }

    document.getElementById('download-ics')?.addEventListener('click', () => {
        const icsData = generateICS(currentLang);
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "DTA_Turnen_Schedule_25-26.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // --- Application Form ---
    const form = document.getElementById('turnen-application-form');
    if (form) {
        const statusEl = document.getElementById('form-status');
        const submitBtn = form.querySelector('button[type="submit"]');
        const WEB_APP_URL = form.dataset.scriptUrl || "https://script.google.com/macros/s/AKfycbzU0Hi34FEwDmmP-XgBPvqsYuYDkV6Ia2OCEAQ0VBVE9skf-TvAm2FxGzabTpHzDMvm/exec";

        const getTranslation = (key, fallback = '') => {
            const translationSet = translations[currentLang] || {};
            return translationSet[key] || fallback;
        };

        const setStatus = (key, type = 'info', replacements = {}) => {
            let message = getTranslation(key, key);
            Object.entries(replacements).forEach(([placeholder, value]) => {
                message = message.replace(new RegExp(`{${placeholder}}`, 'g'), value);
            });
            statusEl.textContent = message;
            const colorClass = type === 'error' ? 'text-red-500' : type === 'success' ? 'text-green-500' : 'text-gray-400';
            statusEl.className = `text-sm text-center ${colorClass} h-4`;
        };

        // Mirrors server-side age calculation for immediate UX feedback; keep in sync with kids_backend.gs
        const calculateAge = (dobString) => {
            if (!dobString) return null;
            const dobDate = new Date(dobString);
            if (Number.isNaN(dobDate.getTime())) return null;
            const today = new Date();
            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDiff = today.getMonth() - dobDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            return age;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const age = calculateAge(formData.get('participant_dob'));

            if (age === null) {
                setStatus('form_error_invalid_dob', 'error');
                return;
            }

            if (age < MIN_AGE) {
                setStatus('form_error_min_age', 'error');
                return;
            }

            setStatus('form_submitting', 'info');
            submitBtn.disabled = true;

            formData.set('lang', currentLang);

            try {
                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('form_success_submitted', 'success');
                    form.reset();
                } else if (data.error === 'AGE_OUT_OF_RANGE') {
                    setStatus('form_error_min_age', 'error');
                } else if (data.error === 'INVALID_DOB') {
                    setStatus('form_error_invalid_dob', 'error');
                } else {
                    setStatus('form_error_generic', 'error');
                }
            } catch (err) {
                console.error('Form submission error:', err);
                setStatus('form_error_generic', 'error');
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    loadTranslations();
});
