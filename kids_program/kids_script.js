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

    // --- Translations & Constants ---
    const MIN_AGE = 10;
    const MAX_AGE = 15;
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
        { start: '2025-12-20T09:00:00', end: '2025-12-20T16:00:00', summary: 'Einführungs WE Jr. DTA - Tag 01', summaryKey: 'summary_intro_weekend_day_1' },
        { start: '2025-12-21T09:00:00', end: '2025-12-21T16:00:00', summary: 'Einführungs WE Jr. DTA - Tag 02', summaryKey: 'summary_intro_weekend_day_2' },
        { start: '2026-01-07T13:00:00', end: '2026-01-07T16:00:00', summary: 'Jr. DTA Training - No. 001', summaryKey: 'summary_training_001' },
        { start: '2026-01-14T13:00:00', end: '2026-01-14T16:00:00', summary: 'Jr. DTA Training - No. 002', summaryKey: 'summary_training_002' },
        { start: '2026-01-21T13:00:00', end: '2026-01-21T16:00:00', summary: 'Jr. DTA Training - No. 003', summaryKey: 'summary_training_003' },
        { start: '2026-01-28T13:00:00', end: '2026-01-28T16:00:00', summary: 'Jr. DTA Training - No. 004', summaryKey: 'summary_training_004' },
        { start: '2026-02-04T13:00:00', end: '2026-02-04T16:00:00', summary: 'Jr. DTA Training - No. 005', summaryKey: 'summary_training_005' },
        { start: '2026-02-11T13:00:00', end: '2026-02-11T16:00:00', summary: 'Jr. DTA Training - No. 006', summaryKey: 'summary_training_006' },
        { start: '2026-02-18T13:00:00', end: '2026-02-18T16:00:00', summary: 'Jr. DTA Training - No. 007', summaryKey: 'summary_training_007' },
        { start: '2026-02-25T13:00:00', end: '2026-02-25T16:00:00', summary: 'Jr. DTA Training - No. 008', summaryKey: 'summary_training_008' },
        { start: '2026-03-04T13:00:00', end: '2026-03-04T16:00:00', summary: 'Jr. DTA Training - No. 009', summaryKey: 'summary_training_009' },
        { start: '2026-03-11T13:00:00', end: '2026-03-11T16:00:00', summary: 'Jr. DTA Training - No. 010', summaryKey: 'summary_training_010' },
        { start: '2026-03-18T13:00:00', end: '2026-03-18T16:00:00', summary: 'Jr. DTA Training - No. 011', summaryKey: 'summary_training_011' },
        { start: '2026-03-25T09:00:00', end: '2026-03-25T16:00:00', summary: 'Jr. DTA Training - No. 012', summaryKey: 'summary_training_012' },
        { start: '2026-04-01T13:00:00', end: '2026-04-01T16:00:00', summary: 'Jr. DTA Training - No. 013', summaryKey: 'summary_training_013' },
        { start: '2026-04-08T13:00:00', end: '2026-04-08T16:00:00', summary: 'Jr. DTA Training - No. 014', summaryKey: 'summary_training_014' },
        { start: '2026-04-15T13:00:00', end: '2026-04-15T16:00:00', summary: 'Jr. DTA Training - No. 015', summaryKey: 'summary_training_015' },
        { start: '2026-04-18T07:00:00', end: '2026-04-18T13:00:00', summary: 'Jr. DTA Abschluss Skitour Saison 25/26', summaryKey: 'summary_end_of_season_tour' },
    ];

    function populateDates(lang = currentLang) {
        const listEl = document.getElementById('event-dates-list');
        if (!listEl) return;

        const locale = lang === 'de' ? 'de-CH' : 'en-GB';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        listEl.innerHTML = '';
        trainingDates.forEach(date => {
            const startDate = new Date(date.start);
            const summaryText = (translations[lang] && translations[lang][date.summaryKey]) || date.summary;
            if (!Number.isNaN(startDate.getTime())) {
                const li = document.createElement('li');
                li.textContent = `${startDate.toLocaleDateString(locale, options)} - ${summaryText}`;
                listEl.appendChild(li);
            } else {
                console.warn(`Invalid date in trainingDates, skipping: "${date.start}"`);
            }
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
            const age = calculateAge(formData.get('child_dob'));

            if (age === null) {
                setStatus('form_error_invalid_dob', 'error');
                return;
            }

            if (age < MIN_AGE || age > MAX_AGE) {
                setStatus('form_error_age_out_of_range', 'error', { age, min: MIN_AGE, max: MAX_AGE });
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
                    setStatus('form_error_age_out_of_range', 'error', {
                        age: data.age ?? age,
                        min: data.minAge ?? MIN_AGE,
                        max: data.maxAge ?? MAX_AGE
                    });
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
