/**
 * ✦ Handcrafted for Demo Team Andermatt by P. Heiniger Design ✦
 * --------------------------------------------------------------
 * This JS file was custom-written for the Demo Team Andermatt website.
 * It enables a rich, interactive user experience—featuring crew profiles,
 * media galleries, scroll-synced video, and more. 
 * Every line serves a purpose.
 * Please do not blindly reuse without adapting to your own context.
 */

document.addEventListener('DOMContentLoaded', function() {

    // ✦ Static data: Team members with bios + images
    const crewData = [ /* ...crew profiles for modal and grid */ ];

    // ✦ Static data: Sponsor/partner logos and links
    const partnersData = [ /* ...sponsor display grid */ ];

    // ✦ Static data: Blog post HTML paths
    const journalFiles = ['journal/post1.html', 'journal/post2.html', 'journal/post3.html'];

    // ✦ JSON file with media item metadata (images/videos)
    const mediaManifestUrl = 'assets/media-manifest.json';

    // ✦ Simulates scroll-based video scrubbing for hero video
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

    // ✦ Adds background & shadow to header on scroll
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

    // ✦ Toggles mobile menu open/close
    function initMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // ✦ Dynamically builds grid of team member cards
    function initCrewGrid() {
        const grid = document.getElementById('crew-grid');
        if (!grid) return;
        crewData.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.className = 'crew-card group cursor-pointer';
            memberEl.innerHTML = `
                <div class="relative overflow-hidden rounded-lg">
                    <img src="${member.img_serious}" alt="${member.name}" class="crew-card-img serious w-full h-auto object-cover absolute inset-0 opacity-100">
                    <img src="${member.img_candid}" alt="${member.name}" class="crew-card-img candid w-full h-auto object-cover absolute inset-0 opacity-0">
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

    // ✦ Opens modal with detailed crew info
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

    // ✦ Modal open/close logic for crew details
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

    // ✦ Loads journal posts from HTML snippets and injects into DOM
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

        posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first

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

    // ✦ Loads image & video gallery dynamically from JSON
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
                        <img src="${item.type === 'image' ? item.src : item.thumbnail}" alt="${item.caption || ''}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
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

            renderGrid('all'); // default view

            // Filter buttons
            document.getElementById('filter-all').addEventListener('click', () => renderGrid('all'));
            document.getElementById('filter-images').addEventListener('click', () => renderGrid('image'));
            document.getElementById('filter-videos').addEventListener('click', () => renderGrid('video'));

        } catch (error) {
            grid.innerHTML = '<p>Could not load media gallery.</p>';
            console.error('Error fetching media manifest:', error);
        }
    }

    // ✦ Opens lightbox for fullscreen media
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

    // ✦ Lightbox close logic
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

    // ✦ Fake sponsorship form handler with "sending" effect
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

    // ✦ Displays partner logos in a grid
    function initPartnersGrid() {
        const grid = document.getElementById('partners-grid');
        if (!grid) return;
        grid.innerHTML = partnersData.map(partner => `
            <a href="${partner.url}" target="_blank" rel="noopener noreferrer" class="flex justify-center items-center p-4 bg-gray-800 rounded-lg transition-transform duration-300 hover:scale-105">
                <img src="${partner.logo}" alt="${partner.name}" class="max-h-12 w-auto filter grayscale hover:filter-none transition-all duration-300">
            </a>
        `).join('');
    }

    // ✦ Main initializers
    initHeaderScroll();
    initMobileMenu();
    initHeroVideoScrub();
    initCrewGrid();
    initModal();
    loadJournal();
    loadMediaHub();
    initLightbox();
    initSponsorshipForm();
    initPartnersGrid();
});
