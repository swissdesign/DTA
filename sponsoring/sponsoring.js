document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('sponsorship-grid');
  if (!grid) return;

  const LABELS = {
    en: {
      price: 'Estimated Price',
      lifespan: 'Approximate Lifespan',
      empty: 'No sponsorship items available at the moment.',
      error: 'Unable to load sponsorship opportunities at this time.'
    },
    de: {
      price: 'Geschätzter Preis',
      lifespan: 'Voraussichtliche Lebensdauer',
      empty: 'Aktuell sind keine Sponsoring-Elemente verfügbar.',
      error: 'Sponsoring-Möglichkeiten konnten gerade nicht geladen werden.'
    }
  };

  let items = [];
  let currentLang = localStorage.getItem('dta_lang') || 'de';

  const renderGrid = (lang) => {
    const dictionary = LABELS[lang] || LABELS.en;

    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = `<p class="text-gray-400">${dictionary.empty}</p>`;
      return;
    }

    const { price, lifespan } = dictionary;

    grid.innerHTML = items.map(item => {
      const name = item.articleName?.[lang] || item.articleName?.en || '';
      const priceValue = item.estimatedPrice?.[lang] || item.estimatedPrice?.en || '';
      const lifespanValue = item.lifespan?.[lang] || item.lifespan?.en || '';

      return `
        <article class="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/30">
          <h3 class="text-2xl font-semibold mb-4 orange-first-letter">${name}</h3>
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
