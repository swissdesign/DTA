/**
 * ✦ Handcrafted for Demo Team Andermatt ✦
 * --------------------------------------------------------------
 * This JS file powers the interactive experience for the site.
 * It handles the preloader, multilingual content, dynamic grids, 
 * modals, and all other interactive elements.
 */

// --- PRELOADER LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const logoPaths = document.querySelectorAll('#preloader-logo path, #preloader-logo polygon, #preloader-logo rect');
    logoPaths.forEach((path, index) => {
        path.style.setProperty('--index', index);
    });
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
        });
    }
});
// --- END PRELOADER LOGIC ---


document.addEventListener('DOMContentLoaded', async function() {

    let translations = {};
    let currentLang = 'de'; // Default language

    // --- HARDCODED CREW DATA (As per original script) ---
    const crewData = {
        de: [
            { id: 'heiniger', name: 'Pascal Heiniger', title: 'Der Präsi', bio: 'Unser Steuermann mit einem Masterplan...', image: 'assets/images/crew/Pascal.webp' },
            { id: 'baumann_m', name: 'Marcel Baumann', title: 'Vizepräsi & Marketing-Guru', bio: 'Mit Skistiefeln fest im Schnee...', image: 'assets/images/crew/Marcel.webp' },
            { id: 'wipfli', name: 'Klara Wipfli', title: 'Team-Mum', bio: 'Klara, unsere Team-Psychologin...', image: 'assets/images/crew/Klara.webp' },
            { id: 'baumann_r', name: 'Roger Baumann', title: 'Der Pistenflüsterer', bio: 'Roger, der mit seinen Skiern spricht...', image: 'assets/images/crew/Roger.webp' },
            { id: 'zavratnik', name: 'Mathias Zavratnik', title: 'Der Finanz-Zauberer', bio: 'Das menschliche Abakus unserer Truppe.', image: 'assets/images/crew/mathias.webp' },
            { id: 'danioth', name: 'Sales Danioth', title: 'Der Taktgeber', bio: 'Mit einem Gehirn, das schneller tickt...', image: 'assets/images/crew/Sales.webp' },
            { id: 'risi', name: 'Corsin Risi', title: 'Der Luftakrobat', bio: 'Corsin, unser Freestyle-König...', image: 'assets/images/crew/Corsin.webp' },
            { id: 'temperli', name: 'Aline Temperli', title: 'Das Naturkind', bio: 'Wenn Aline nicht auf den Pisten anzutreffen ist...', image: 'assets/images/crew/Aline.webp' },
        ],
        en: [
            { id: 'heiniger', name: 'Pascal Heiniger', title: 'The President', bio: 'Our helmsman with a master plan...', image: 'assets/images/crew/Pascal.webp' },
            { id: 'baumann_m', name: 'Marcel Baumann', title: 'Vice President & Marketing Guru', bio: 'With ski boots firmly in the snow...', image: 'assets/images/crew/Marcel.webp' },
            { id: 'wipfli', name: 'Klara Wipfli', title: 'Team Mum', bio: 'Klara, our team psychologist...', image: 'assets/images/crew/Klara.webp' },
            { id: 'baumann_r', name: 'Roger Baumann', title: 'The Trail Whisperer', bio: 'Roger, who talks to his skis...', image: 'assets/images/crew/Roger.webp' },
            { id: 'zavratnik', name: 'Mathias Zavratnik', title: 'The Finance Wizard', bio: 'The human abacus of our troupe.', image: 'assets/images/crew/mathias.webp' },
            { id: 'danioth', name: 'Sales Danioth', title: 'The Metronome', bio: 'With a brain that ticks faster...', image: 'assets/images/crew/Sales.webp' },
            { id: 'risi', name: 'Corsin Risi', title: 'The Aerial Acrobat', bio: 'Corsin, our freestyle king...', image: 'assets/images/crew/Corsin.webp' },
            { id: 'temperli', name: 'Aline Temperli', title: 'The Nature Lover', bio: 'If Aline is not found on the slopes...', image: 'assets/images/crew/Aline.webp' },
        ]
    };

    // --- HEADER SCROLL BEHAVIOR ---
    function initHeaderScroll() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // --- MOBILE MENU ---
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavLinks = mobileNav.querySelectorAll('a');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
            });
        });
    }

    // --- HERO VIDEO SCRUBBING ---
    function initHeroVideoScrub() {
        const video = document.getElementById('hero-video');
        if (!video) return;

        video.pause();
        video.currentTime = 0;

        window.addEventListener('scroll', () => {
            if (window.innerWidth < 768) {
                if (!video.paused) video.pause();
                return;
            };

            const scrollPosition = window.scrollY;
            const heroSection = document.querySelector('.hero-section');
            const heroHeight = heroSection.offsetHeight;

            let scrollFraction = scrollPosition / (heroHeight - window.innerHeight);
            scrollFraction = Math.min(1, Math.max(0, scrollFraction));

            if (video.duration) {
                video.currentTime = video.duration * scrollFraction;
            }
        });
    }

    // --- CREW GRID (using hardcoded data) ---
    function initCrewGrid() {
        const grid = document.getElementById('crew-grid');
        if (!grid) return;
        
        grid.innerHTML = ''; // Clear existing content
        const currentCrew = crewData[currentLang] || crewData.de;

        currentCrew.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'crew-card cursor-pointer group';
            // Use the member's id for the data attribute
            memberCard.setAttribute('data-member-id', member.id);
            memberCard.innerHTML = `
                <div class="relative overflow-hidden rounded-lg aspect-w-1 aspect-h-1">
                    <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                    <div class="absolute bottom-0 left-0 p-4">
                        <h3 class="text-xl font-bold">${member.name}</h3>
                    </div>
                </div>
            `;
            grid.appendChild(memberCard);
        });
    }

    // --- JOURNAL SCROLLER (fetches from JSON) ---
    function initJournalScroller() {
        const journalSection = document.getElementById('journal');
        const container = document.getElementById('journal-scroll-container');
        const scrollLeftBtn = document.getElementById('journal-scroll-left');
        const scrollRightBtn = document.getElementById('journal-scroll-right');

        if (!container) {
            if(journalSection) journalSection.style.display = 'none';
            return;
        }

        fetch('journal/journal_manifest.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(posts => {
                if (!posts || posts.length === 0) {
                    journalSection.style.display = 'none';
                    return;
                }
                
                journalSection.style.display = '';
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                const recentPosts = posts.slice(0, 5);
                container.innerHTML = '';

                recentPosts.forEach(post => {
                    const card = document.createElement('a');
                    card.href = post.url;
                    card.className = 'journal-card';
                    const postDate = new Date(post.date);
                    const formattedDate = new Intl.DateTimeFormat(currentLang, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(postDate);
                    card.innerHTML = `
                        <div class="bg-gray-900 rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg hover:shadow-red-900/20 transition-shadow duration-300">
                            <img src="${post.image}" alt="" class="w-full h-48 object-cover">
                            <div class="p-6 flex-grow flex flex-col text-left">
                                <p class="text-sm text-gray-400 mb-2">${formattedDate}</p>
                                <h3 class="text-xl font-bold mb-4 flex-grow">${post.title[currentLang] || post.title['de']}</h3>
                                <span class="text-red-500 hover:text-red-400 font-semibold self-start" data-key="journal_read_more">Mehr lesen →</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });

                const updateButtons = () => {
                    if (container.scrollWidth <= container.clientWidth) {
                        scrollLeftBtn.style.display = 'none';
                        scrollRightBtn.style.display = 'none';
                    } else {
                        scrollLeftBtn.style.display = 'block';
                        scrollRightBtn.style.display = 'block';
                        const maxScrollLeft = container.scrollWidth - container.clientWidth;
                        scrollLeftBtn.disabled = container.scrollLeft <= 0;
                        scrollRightBtn.disabled = container.scrollLeft >= maxScrollLeft - 1;
                        scrollLeftBtn.style.opacity = scrollLeftBtn.disabled ? 0.5 : 1;
                        scrollRightBtn.style.opacity = scrollRightBtn.disabled ? 0.5 : 1;
                    }
                };

                container.addEventListener('scroll', updateButtons);
                window.addEventListener('resize', updateButtons);

                scrollLeftBtn.addEventListener('click', () => {
                    const cardWidth = container.querySelector('.journal-card').offsetWidth;
                    container.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
                });

                scrollRightBtn.addEventListener('click', () => {
                    const cardWidth = container.querySelector('.journal-card').offsetWidth;
                    container.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
                });
                
                updateButtons();
            })
            .catch(error => {
                console.error('Failed to load journal entries:', error);
                container.innerHTML = `<p class="text-red-500 text-center w-full"><strong>Error:</strong> Journal could not be loaded. Check console for details.</p>`;
            });
    }

    // --- MODAL (works with hardcoded crew data) ---
    function initModal() {
        const modalContainer = document.getElementById('modal-container');
        const modalContent = document.getElementById('modal-content');
        const grid = document.getElementById('crew-grid');

        if (!modalContainer || !modalContent || !grid) return;

        grid.addEventListener('click', (e) => {
            const card = e.target.closest('.crew-card');
            if (card) {
                const memberId = card.getAttribute('data-member-id');
                openModal(memberId);
            }
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });

        function openModal(memberId) {
            const currentCrew = crewData[currentLang] || crewData.de;
            const member = currentCrew.find(m => m.id === memberId);
            
            if (member) {
                modalContent.innerHTML = `
                    <button id="modal-close" class="absolute top-4 right-4 text-gray-400 hover:text-white text-4xl leading-none">&times;</button>
                    <div class="text-center">
                        <img src="${member.image}" alt="${member.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-700">
                        <h2 class="text-2xl font-bold">${member.name}</h2>
                        <p class="text-red-500 font-semibold mt-1">${member.title}</p>
                        <p class="text-gray-300 mt-4">${member.bio}</p>
                    </div>
                `;
                document.getElementById('modal-close').addEventListener('click', closeModal);
                modalContainer.classList.remove('opacity-0', 'pointer-events-none');
                modalContent.classList.remove('scale-95');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal() {
            modalContainer.classList.add('opacity-0', 'pointer-events-none');
            modalContent.classList.add('scale-95');
            document.body.style.overflow = '';
        }
    }

    // --- PARTNERS GRID (fetches from JSON) ---
    function initPartnersGrid() {
        const grid = document.getElementById('partners-grid');
        if (!grid) return;

        fetch('assets/media-manifest.json')
            .then(res => res.json())
            .then(data => {
                const partners = data.partners;
                grid.innerHTML = '';
                partners.forEach(partner => {
                    grid.innerHTML += `
                        <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="flex justify-center items-center grayscale hover:grayscale-0 transition duration-300">
                            <img src="${partner.logo}" alt="${partner.name}" class="max-h-16 w-auto">
                        </a>
                    `;
                });
            })
            .catch(error => console.error('Error loading partners:', error));
    }
    
    // --- TRANSLATIONS ---
    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (!response.ok) throw new Error('Translation file not found');
            translations = await response.json();
            const savedLang = localStorage.getItem('language') || 'de';
            await translatePage(savedLang);
        } catch (error) {
            console.error('Could not load translations:', error);
            await translatePage('de'); // Fallback
        }
    }

    async function translatePage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[id^="lang-"]').forEach(btn => {
            btn.classList.remove('font-bold', 'text-white');
            btn.classList.add('text-gray-400');
        });
        document.getElementById(`lang-${lang}-desktop`).classList.add('font-bold', 'text-white');
        document.getElementById(`lang-${lang}-desktop`).classList.remove('text-gray-400');
        document.getElementById(`lang-${lang}-mobile`).classList.add('font-bold', 'text-white');
        document.getElementById(`lang-${lang}-mobile`).classList.remove('text-gray-400');

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            } else if (translations['de'] && translations['de'][key]) {
                element.innerHTML = translations['de'][key];
            }
        });
        
        // Re-initialize content that depends on language
        initCrewGrid();
        initJournalScroller(); 
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
    initModal();
    initPartnersGrid();
    await loadTranslations(); // This will call initCrewGrid and initJournalScroller

});
