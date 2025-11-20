document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('sponsorship-grid');
  if (!grid) return;

  // New keys added for the new logic (taken status and sponsor label)
  const LABELS = {
    en: {
      price: 'Estimated Price',
      lifespan: 'Approximate Lifespan',
      taken: 'TAKEN',
      sponsored: 'Sponsored by',
      empty: 'No sponsorship items available at the moment.',
      error: 'Unable to load sponsorship opportunities at this time.'
    },
    de: {
      price: 'Geschätzter Preis',
      lifespan: 'Voraussichtliche Lebensdauer',
      taken: 'ÜBERNOMMEN',
      sponsored: 'Gesponsert von',
      empty: 'Aktuell sind keine Sponsoring-Elemente verfügbar.',
      error: 'Sponsoring-Möglichkeiten konnten gerade nicht geladen werden.'
    }
  };

  let items = [];
  let currentLang = localStorage.getItem('dta_lang') || 'de';

  const renderGrid = (lang) => {
    const dictionary = LABELS[lang] || LABELS.en;
    // Attempt to use global translations first, falling back to local LABELS
    const takenStatus = document.querySelector('[data-key="taken_status"]') ? document.querySelector('[data-key="taken_status"]').textContent : dictionary.taken;
    const sponsoredLabel = document.querySelector('[data-key="sponsored_by_label"]') ? document.querySelector('[data-key="sponsored_by_label"]').textContent : dictionary.sponsored;


    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = `<p class="text-gray-400">${dictionary.empty}</p>`;
      return;
    }

    const { price, lifespan } = dictionary;

    grid.innerHTML = items.map(item => {
      const name = item.articleName?.[lang] || item.articleName?.en || '';
      const priceValue = item.estimatedPrice?.[lang] || item.estimatedPrice?.en || '';
      const lifespanValue = item.lifespan?.[lang] || item.lifespan?.en || '';
      const isSponsored = !!item.sponsoredBy;
      
      let contentHtml;
      let articleClass = isSponsored ? 'sponsored-item relative' : '';

      if (isSponsored) {
        contentHtml = `
          <div class="absolute inset-0 bg-red-800/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center sponsored-overlay">
            <p class="text-sm uppercase tracking-widest text-red-100">${takenStatus}</p>
            <h4 class="text-xl font-bold mt-2 text-white">${sponsoredLabel}</h4>
            <p class="text-lg font-semibold text-white">${item.sponsoredBy}</p>
          </div>
        `;
      } else {
        contentHtml = `
          <dl class="space-y-3 text-sm tracking-wide">
            <div class="flex justify-between">
              <dt class="uppercase text-gray-400">${price}</dt>
              <dd class="text-white font-medium">${priceValue}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="uppercase text-gray-400">${lifespan}</dt>
              <dd class="text-white font-medium">${lifespanValue}</dd>
            </div>
          </dl>
        `;
      }


      return `
        <article class="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/30 ${articleClass}">
          <h3 class="text-2xl font-semibold mb-4 orange-first-letter z-10">${name}</h3>
          ${contentHtml}
        </article>
      `;
    }).join('');
  };

  fetch('sponsorship_items.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      items = Array.isArray(data) ? data : [];
      renderGrid(currentLang);
    })
    .catch(error => {
      console.error('Could not load sponsorship items:', error);
      const dictionary = LABELS[currentLang] || LABELS.en;
      grid.innerHTML = `<p class="text-red-400">${dictionary.error}</p>`;
    });

  document.addEventListener('dta:language-changed', (event) => {
    currentLang = event.detail?.lang || 'de';
    renderGrid(currentLang);
  });
});
