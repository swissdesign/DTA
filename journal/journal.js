/*!
 * journal.js
 * Logic for the DTA Journal Page
 */
document.addEventListener('DOMContentLoaded', () => {
  const IN_JOURNAL = window.location.pathname.toLowerCase().includes('/journal/');
  const DEBUG = new URLSearchParams(location.search).get('debug') === '1';

  const manifestCandidates = IN_JOURNAL
    ? ['./journal_manifest.json', '../journal_manifest.json']
    : ['./journal/journal_manifest.json', './journal_manifest.json', '../journal/journal_manifest.json'];

  const cleanRelativePath = (value = '') => value.replace(/^(?:\.\/|\.\.\/)+/, '');

  const entryHref = (filePath) => {
    if (!filePath) return '#';
    if (/^(https?:)?\/\//.test(filePath)) return filePath;
    const name = cleanRelativePath(filePath).split('/').pop();
    return IN_JOURNAL ? `./${name}` : `./journal/${name}`;
  };

  const entryImageSrc = (imagePath) => {
    if (!imagePath) return '';
    if (/^(https?:)?\/\//.test(imagePath)) return imagePath;
    const clean = cleanRelativePath(imagePath);
    return IN_JOURNAL ? `../${clean}` : `./${clean}`;
  };

  let manifestPromise;
  const getManifest = async () => {
    if (manifestPromise) return manifestPromise;

    manifestPromise = (async () => {
      for (const candidate of manifestCandidates) {
        const full = candidate + (DEBUG ? `?v=${Date.now()}` : '');
        try {
          const res = await fetch(full, { cache: DEBUG ? 'no-store' : 'default' });
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${full}`);
          const json = await res.json();
          if (!Array.isArray(json)) throw new Error('Manifest is not an array');
          return json;
        } catch (e) {
          console.warn('[journal] manifest try failed:', e.message);
          if (DEBUG) {
            const note = document.createElement('p');
            note.className = 'text-xs text-gray-500';
            note.textContent = `Manifest attempt failed: ${e.message}`;
            document.getElementById('journal-scroll-container')?.before(note);
          }
        }
      }
      throw new Error('No manifest path worked');
    })();

    return manifestPromise;
  };

  // --- Navigation Menu Logic ---
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const body = document.body;

  if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
      body.classList.toggle('menu-open');
      if (body.classList.contains('menu-open')) {
        menuOverlay.style.opacity = '1';
        menuOverlay.style.pointerEvents = 'auto';
      } else {
        menuOverlay.style.opacity = '0';
        menuOverlay.style.pointerEvents = 'none';
      }
    });
  }

  // --- Entry Page Horizontal Scroller ---
  const scrollContainer = document.getElementById('journal-scroll-container');
  if (scrollContainer) {
    const leftBtn = document.getElementById('journal-scroll-left');
    const rightBtn = document.getElementById('journal-scroll-right');

    getManifest()
      .then(entries => {
        const currentFile = window.location.pathname.split('/').pop().toLowerCase();

        scrollContainer.innerHTML = entries.map(entry => {
          const entryFile = cleanRelativePath(entry.file || '').split('/').pop().toLowerCase();
          const isCurrent = entryFile === currentFile;
          return `
            <div class="journal-card flex-shrink-0 snap-start ${isCurrent ? 'active-entry' : ''}"
                 style="flex:0 0 80%;max-width:80%;">
             <a href="${entryHref(entry.file)}" class="block" aria-current="${isCurrent ? 'page' : 'false'}">
                <div class="overflow-hidden">
                  <img src="${entryImageSrc(entry.image)}" alt="${entry.title}"
                       class="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                       onerror="this.onerror=null;this.src='https://placehold.co/800x450/EEE/31343C?text=Image+Not+Found';">
                </div>
                <div class="p-6">
                  <p class="text-xs text-gray-500 uppercase">${entry.date}</p>
                  <h3 class="text-xl font-semibold mt-2 text-gray-900">${entry.title}</h3>
                  <p class="text-gray-600 mt-2 text-sm">${entry.caption}</p>
                </div>
              </a>
            </div>`;
        }).join('');

        function scrollByCard(dir) {
          const card = scrollContainer.querySelector('.journal-card');
          const step = card ? (card.getBoundingClientRect().width + 24) : 320;
          scrollContainer.scrollBy({ left: dir * step, behavior: 'smooth' });
        }
        leftBtn?.addEventListener('click', () => scrollByCard(-1));
        rightBtn?.addEventListener('click', () => scrollByCard(1));
      })
      .catch(err => {
        console.error('[journal] scroller failed:', err);
        scrollContainer.innerHTML =
          `<p class="text-gray-500">${DEBUG ? err.message : 'Could not load more entries.'}</p>`;
      });
  }

  // --- Dynamic Journal Grid Loading (index page) ---
  const journalGrid = document.getElementById('journal-grid');
  async function loadJournalEntries() {
    if (!journalGrid) return;
    try {
      const entries = await getManifest();

      journalGrid.innerHTML = '';
      entries.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'journal-grid-item';
        card.style.animationDelay = `${index * 100}ms`;
        card.innerHTML = `
          <div class="journal-card">
            <a href="${entryHref(entry.file)}" class="block">
              <img src="${entryImageSrc(entry.image)}" alt="${entry.title}" class="journal-card-image"
                   onerror="this.onerror=null;this.src='https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found';">
              <div class="journal-card-content">
                <p class="journal-card-date">${entry.date}</p>
                <h2 class="journal-card-title">${entry.title}</h2>
                <p class="journal-card-caption">${entry.caption}</p>
              </div>
            </a>
          </div>`;
        journalGrid.appendChild(card);
      });
    } catch (error) {
      console.error('Could not load journal entries:', error);
      journalGrid.innerHTML =
        '<p class="text-center col-span-full text-gray-500">Could not load journal entries at this time.</p>';
    }
  }
  loadJournalEntries(); // only does work if #journal-grid exists

  // --- Footer Year ---
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
