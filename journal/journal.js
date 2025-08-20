/*!
 * journal.js
 * Logic for the DTA Journal Page
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            body.classList.toggle('menu-open');
            if (body.classList.contains('menu-open')) {
                // Menu is open
                menuOverlay.style.opacity = '1';
                menuOverlay.style.pointerEvents = 'auto';
            } else {
                // Menu is closed
                menuOverlay.style.opacity = '0';
                menuOverlay.style.pointerEvents = 'none';
            }
        });
    }

    // --- Dynamic Journal Grid Loading ---
    const journalGrid = document.getElementById('journal-grid');
    const manifestURL = 'journal-manifest.json';

    async function loadJournalEntries() {
        if (!journalGrid) return;

        try {
            const response = await fetch(manifestURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const entries = await response.json();

            journalGrid.innerHTML = ''; // Clear any potential placeholders

            entries.forEach((entry, index) => {
                const card = document.createElement('div');
                card.className = 'journal-grid-item'; // For staggered animation
                // Apply stagger delay
                card.style.animationDelay = `${index * 100}ms`;

                card.innerHTML = `
                    <div class="journal-card">
                        <a href="${entry.file}" class="block">
                            <img src="${entry.image}" alt="${entry.title}" class="journal-card-image" onerror="this.onerror=null;this.src='https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found';">
                            <div class="journal-card-content">
                                <p class="journal-card-date">${entry.date}</p>
                                <h2 class="journal-card-title">${entry.title}</h2>
                                <p class="journal-card-caption">${entry.caption}</p>
                            </div>
                        </a>
                    </div>
                `;
                journalGrid.appendChild(card);
            });

        } catch (error) {
            console.error("Could not load journal entries:", error);
            journalGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Could not load journal entries at this time.</p>';
        }
    }
    
    loadJournalEntries();

    // --- Footer Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
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

});
