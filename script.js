/**
 * ✦ Handcrafted for Demo Team Andermatt by P. Heiniger Design & Gemini ✦
 * --------------------------------------------------------------
 * This JS file powers the interactive experience for skidemo.ch.
 * It handles multilingual content, dynamic grids, modals, and more,
 * all while being optimized for a static hosting environment like GitHub Pages.
 */

// --- PRELOADER LOGIC ---
// This function runs as soon as the DOM is ready to set up the animation delays.
document.addEventListener('DOMContentLoaded', () => {
    const logoPaths = document.querySelectorAll('#preloader-logo path, #preloader-logo polygon, #preloader-logo rect');
    logoPaths.forEach((path, index) => {
        // Set a custom property on each path for the staggered CSS animation delay
        path.style.setProperty('--index', index);
    });
});

// This function runs after all content (images, videos, etc.) has loaded.
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Add a short delay before starting the fade-out to ensure the animation completes.
        setTimeout(() => { preloader.classList.add('loaded'); }, 1800); // This should be slightly less than the animation duration.

        // Completely remove the preloader from the page after the fade-out transition.
        setTimeout(() => { preloader.style.display = 'none'; }, 2600); // This should be animation duration + transition duration.
    }
});
// --- END PRELOADER LOGIC ---


document.addEventListener('DOMContentLoaded', async function() {

    let translations = {};
    let currentLang = 'de'; // Default language

    const crewData = {
        de: [
            { id: 'heiniger', name: 'Pascal Heiniger', title: 'Der Präsi', bio: 'Unser Steuermann mit einem Masterplan. Pascal führt das Team mit einer Mischung aus Weisheit und der entspannten Lässigkeit eines Mannes, der die Pisten von Andermatt besser kennt als seine Hosentasche.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Pascal+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Pascal+C' },
            { id: 'baumann_m', name: 'Marcel Baumann', title: 'Vizepräsi & Marketing-Guru', bio: 'Mit Skistiefeln fest im Schnee und der Marketingkappe immer griffbereit, hat Marcel unsere Marke so gut positioniert, dass selbst die Murmeltiere aufmerksam zusehen.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Marcel+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Marcel+C' },
            { id: 'wipfli', name: 'Klara Wipfli', title: 'Team-Mum', bio: 'Klara, unsere Team-Psychologin, hält uns mit ihrer Energie zusammen und sorgt dafür, dass wir nicht nur durch die Pisten, sondern auch durch unsere Probleme pflügen.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Klara+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Klara+C' },
            { id: 'baumann_r', name: 'Roger Baumann', title: 'Der Pistenflüsterer', bio: 'Roger, der mit seinen Skiern spricht und Linien in den Schnee zaubert, die Picasso neidisch machen würden. Sein Rennhintergrund bedeutet Geschwindigkeit im Blut.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Roger+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Roger+C' },
            { id: 'zavratnik', name: 'Mathias Zavratnik', title: 'Der Finanz-Zauberer', bio: 'Das menschliche Abakus unserer Truppe. Wenn es um Zahlen geht, ist Mathias so zuverlässig wie frischer Pulverschnee im Januar.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Mathias+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Mathias+C' },
            { id: 'danioth', name: 'Sales Danioth', title: 'Der Taktgeber', bio: 'Mit einem Gehirn, das schneller tickt als seine Skier, bringt Sales physikalische Präzision in jeden Schwung. Er ist der Beweis, dass man beides haben kann.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Sales+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Sales+C' },
            { id: 'risi', name: 'Corsin Risi', title: 'Der Luftakrobat', bio: 'Corsin, unser Freestyle-König, macht die Luft zu seiner Bühne und jeden Sprung zu einer Show. Er bringt uns bei, dass Fliegen nicht nur etwas für Vögel ist.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Corsin+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Corsin+C' },
            { id: 'temperli', name: 'Aline Temperli', title: 'Das Naturkind', bio: 'Wenn Aline nicht auf den Pisten anzutreffen ist, sucht sie wahrscheinlich gerade die nächste Herausforderung im Tiefschnee.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Aline+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Aline+C' },
        ],
        en: [
            { id: 'heiniger', name: 'Pascal Heiniger', title: 'The President', bio: 'Our helmsman with a master plan. Pascal leads the team with a mix of wisdom and the relaxed ease of a man who knows the slopes of Andermatt better than his own pockets.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Pascal+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Pascal+C' },
            { id: 'baumann_m', name: 'Marcel Baumann', title: 'Vice President & Marketing Guru', bio: 'With ski boots firmly in the snow and the marketing cap always ready, Marcel has positioned our brand so well that even the marmots pay attention.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Marcel+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Marcel+C' },
            { id: 'wipfli', name: 'Klara Wipfli', title: 'Team Mum', bio: 'Klara, our team psychologist, keeps us together with her energy and ensures that we plow through not just the slopes but our problems as well.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Klara+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Klara+C' },
            { id: 'baumann_r', name: 'Roger Baumann', title: 'The Trail Whisperer', bio: 'Roger, who talks to his skis and carves lines in the snow that would make Picasso jealous. His racing background means speed in his blood.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Roger+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Roger+C' },
            { id: 'zavratnik', name: 'Mathias Zavratnik', title: 'The Finance Wizard', bio: 'The human abacus of our troupe. When it comes to numbers, Mathias is as reliable as fresh powder snow in January.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Mathias+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Mathias+C' },
            { id: 'danioth', name: 'Sales Danioth', title: 'The Metronome', bio: 'With a brain that ticks faster than his skis, Sales brings physical precision to every turn. He\'s proof that you can have both.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Sales+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Sales+C' },
            { id: 'risi', name: 'Corsin Risi', title: 'The Aerial Acrobat', bio: 'Corsin, our freestyle king, makes the air his stage and every jump a show. He teaches us that flying isn\'t just for birds.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Corsin+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Corsin+C' },
            { id: 'temperli', name: 'Aline Temperli', title: 'The Nature Lover', bio: 'If Aline is not found on the slopes, she\'s probably seeking the next challenge in the backcountry.', img_serious: 'https://placehold.co/400x500/333/FFF?text=Aline+S', img_candid: 'https://placehold.co/400x500/555/FFF?text=Aline+C' },
        ]
    };

    const partnersData = [
        { name: 'Alp Hittä', logo: 'https://placehold.co/200x100/CCCCCC/000000?text=ALP+HITTÄ', url: '#' },
        { name: 'Christen Automobile', logo: 'https://placehold.co/200x100/CCCCCC/000000?text=Christen+AG', url: '#' },
        { name: 'Toko', logo: 'https://placehold.co/200x100/CCCCCC/000000?text=TOKO', url: '#' },
        { name: 'Swix', logo: 'https://placehold.co/200x100/CCCCCC/000000?text=SWIX', url: '#' },
        { name: 'Sport Imholz', logo: 'https://placehold.co/200x100/CCCCCC/000000?text=Sport+Imholz', url: '#' },
    ];

    const journalFiles = ['/journal/post1-saas-fee-recap.html'];
    const mediaManifestUrl = '/assets/media-manifest.json';

    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (!response.ok) {
                console.error('Could not load translations file.');
                return;
            }
            translations = await response.json();
            translatePage(currentLang);
        } catch (error) {
            console.error('Error fetching translations:', error);
        }
    }

    function translatePage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-key-placeholder]').forEach(el => {
            const key = el.dataset.keyPlaceholder;
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        
        initCrewGrid(); 
        updateLangButtons();
    }

    function updateLangButtons() {
        const allLangBtns = document.querySelectorAll('.lang-btn');
        allLangBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('border-gray-600', 'text-gray-400');
        });

        const activeBtns = document.querySelectorAll(`#lang-${currentLang}, #mobile-lang-${currentLang}`);
        activeBtns.forEach(btn => {
            btn.classList.add('active');
            btn.classList.remove('border-gray-600', 'text-gray-400');
        });
    }

    function initHeroVideoScrub() {
        const video = document.getElementById('hero-video');
        if (!video) return;
        video.pause();

        window.addEventListener('scroll', () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = window.scrollY / scrollableHeight;

            if (video.duration) {
                video.currentTime = video.duration * scrollFraction * 2.5;
            }
        });
    }

    function initHeaderScroll() {
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('bg-pitch-black', 'shadow-lg');
            } else {
                header.classList.remove('bg-pitch-black', 'shadow-lg');
            }
        });
    }

    function initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.classList.contains('lang-btn')) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    function initCrewGrid() {
        const grid = document.getElementById('crew-grid');
        if (!grid) return;
        grid.innerHTML = ''; 
        const currentCrewData = crewData[currentLang] || crewData.de;
        currentCrewData.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.className = 'crew-card group cursor-pointer';
            memberEl.innerHTML = `
                <div class="relative overflow-hidden rounded-lg">
                    <img src="${member.img_serious}" alt="${member.name}" class="crew-card-img serious w-full h-auto absolute inset-0 opacity-100">
                    <img src="${member.img_candid}" alt="${member.name}" class="crew-card-img candid w-full h-auto absolute inset-0 opacity-0">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-4">
                        <h3 class="font-bold text-lg">${member.name}</h3>
                        <p class="text-neon-orange text-sm">${member.title}</p>
                    </div>
                </div>
            `;
            memberEl.addEventListener('click', () => openModal(member));
            grid.appendChild(memberEl);
        });
    }

    function openModal(member) {
        const modalContainer = document.getElementById('modal-container');
        const modalBody = document.getElementById('modal-body');
        const modalContent = document.getElementById('modal-content');

        modalBody.innerHTML = `
            <img src="${member.img_candid}" alt="${member.name}" class="w-full h-48 object-cover rounded-t-lg mb-4">
            <h3 class="text-2xl font-bold text-off-white">${member.name}</h3>
            <p class="text-lg text-neon-orange mb-4">${member.title}</p>
            <p class="text-gray-300">${member.bio}</p>
        `;

        modalContainer.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
    }

    function initModal() {
        const modalContainer = document.getElementById('modal-container');
        const modalClose = document.getElementById('modal-close');
        const modalContent = document.getElementById('modal-content');

        const closeModal = () => {
            modalContainer.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95');
        };

        modalClose.addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });
    }

    async function loadJournal() {
        const grid = document.getElementById('journal-grid');
        const headlinesContainer = document.getElementById('journal-headlines');
        if (!grid || !headlinesContainer) return;

        const posts = [];
        for (const file of journalFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) continue;
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const body = doc.body;
                posts.push({
                    url: file,
                    title: body.dataset.title || 'Untitled Post',
                    date: body.dataset.date || '',
                    summary: body.dataset.summary || '',
                    image: body.dataset.image || 'https://placehold.co/600x400/111/FFF?text=DTA'
                });
            } catch (error) {
                console.error('Error fetching journal post:', file, error);
            }
        }

        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        grid.innerHTML = posts.map(post => `
            <a href="${post.url}" class="block group bg-black bg-opacity-30 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <p class="text-sm text-neon-orange">${post.date}</p>
                    <h3 class="text-xl font-bold mt-2">${post.title}</h3>
                    <p class="text-gray-400 mt-2">${post.summary}</p>
                    <span class="inline-block mt-4 font-semibold text-neon-orange group-hover:underline">Read More &rarr;</span>
                </div>
            </a>
        `).join('');

        headlinesContainer.innerHTML = posts.slice(0, 3).map(post => `
            <a href="${post.url}" class="block text-lg md:text-xl font-semibold hover:text-neon-orange transition-colors">${post.title}</a>
        `).join('');
        document.getElementById('latest-journal-preview').style.opacity = 1;
    }

    async function loadMediaHub() {
        const grid = document.getElementById('media-grid');
        if (!grid) return;

        try {
            const response = await fetch(mediaManifestUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const mediaItems = await response.json();

            const renderGrid = (filter) => {
                grid.innerHTML = '';
                const filteredItems = filter === 'all' ? mediaItems : mediaItems.filter(item => item.type === filter);

                filteredItems.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'media-item group cursor-pointer relative overflow-hidden rounded-lg aspect-square';
                    itemEl.dataset.type = item.type;
                    itemEl.dataset.src = item.src;

                    itemEl.innerHTML = `
                        <img src="${item.thumbnail || item.src}" alt="${item.caption || ''}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            ${item.type === 'video' 
                                ? '<svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>' 
                                : '<svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>'
                            }
                        </div>
                    `;
                    itemEl.addEventListener('click', () => openLightbox(item));
                    grid.appendChild(itemEl);
                });
            };

            renderGrid('all');

            document.getElementById('filter-all').addEventListener('click', () => renderGrid('all'));
            document.getElementById('filter-images').addEventListener('click', () => renderGrid('image'));
            document.getElementById('filter-videos').addEventListener('click', () => renderGrid('video'));

        } catch (error) {
            grid.innerHTML = '<p>Could not load media gallery.</p>';
            console.error('Error fetching media manifest:', error);
        }
    }

    function openLightbox(item) {
        const lightboxContainer = document.getElementById('lightbox-container');
        const lightboxContent = document.getElementById('lightbox-content');

        if (item.type === 'image') {
            lightboxContent.innerHTML = `<img src="${item.src}" class="max-w-full max-h-[90vh] rounded-lg">`;
        } else {
            lightboxContent.innerHTML = `<video src="${item.src}" class="max-w-full max-h-[90vh] rounded-lg" controls autoplay></video>`;
        }

        lightboxContainer.classList.remove('opacity-0', 'pointer-events-none');
    }

    function initLightbox() {
        const lightboxContainer = document.getElementById('lightbox-container');
        const lightboxClose = document.getElementById('lightbox-close');

        const closeLightbox = () => {
            document.getElementById('lightbox-content').innerHTML = '';
            lightboxContainer.classList.add('opacity-0', 'pointer-events-none');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxContainer.addEventListener('click', (e) => {
            if (e.target === lightboxContainer) {
                closeLightbox();
            }
        });
    }

    function initSponsorshipForm() {
        const form = document.getElementById('sponsorship-form');
        const statusEl = document.getElementById('form-status');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            statusEl.textContent = 'Sending...';
            statusEl.classList.remove('text-red-500');
            statusEl.classList.add('text-neon-orange');

            setTimeout(() => {
                statusEl.textContent = 'Thank you! We will be in touch soon.';
                statusEl.classList.remove('text-neon-orange');
                statusEl.classList.add('text-green-500');
                form.reset();
            }, 1000);
        });
    }

    function initPartnersGrid() {
        const grid = document.getElementById('partners-grid');
        if (!grid) return;
        grid.innerHTML = partnersData.map(partner => `
            <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="flex justify-center items-center p-4 bg-gray-800 rounded-lg transition-transform duration-300 hover:scale-105">
                <img src="${partner.logo}" alt="${partner.name}" class="max-h-12 w-auto filter grayscale hover:filter-none transition-all duration-300">
            </a>
        `).join('');
    }

    document.getElementById('lang-de').addEventListener('click', () => translatePage('de'));
    document.getElementById('lang-en').addEventListener('click', () => translatePage('en'));
    document.getElementById('mobile-lang-de').addEventListener('click', () => translatePage('de'));
    document.getElementById('mobile-lang-en').addEventListener('click', () => translatePage('en'));

    initHeaderScroll();
    initMobileMenu();
    initHeroVideoScrub();
    initModal();
    loadJournal();
    loadMediaHub();
    initLightbox();
    initSponsorshipForm();
    initPartnersGrid();
    await loadTranslations();
});
