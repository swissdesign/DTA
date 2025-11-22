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
      available: 'Available to sponsor',
      ctaAvailable: 'Start the conversation',
      ctaSponsored: 'Contact us for alternatives',
      empty: 'No sponsorship items available at the moment.',
      error: 'Unable to load sponsorship opportunities at this time.'
    },
    de: {
      price: 'Geschätzter Preis',
      lifespan: 'Voraussichtliche Lebensdauer',
      taken: 'ÜBERNOMMEN',
      sponsored: 'Gesponsert von',
      available: 'Verfügbar für Sponsoring',
      ctaAvailable: 'Jetzt Kontakt aufnehmen',
      ctaSponsored: 'Kontakt für Alternativen',
      empty: 'Aktuell sind keine Sponsoring-Elemente verfügbar.',
      error: 'Sponsoring-Möglichkeiten konnten gerade nicht geladen werden.'
    }
  };

  let items = [];
  let partnerLogos = {};
  let currentLang = localStorage.getItem('dta_lang') || 'de';
  const contactFormUrl = document.querySelector('[data-key="sponsoring_cta_button"]')?.href || 'https://forms.gle/5S5oQgm5rS7TNfEM9';

  const modal = document.getElementById('sponsorship-modal');
  const modalTitle = document.getElementById('sponsorship-modal-title');
  const modalDescription = document.getElementById('sponsorship-modal-description');
  const modalPrice = document.getElementById('sponsorship-modal-price');
  const modalSponsor = document.getElementById('sponsorship-modal-sponsor');
  const modalStatus = document.getElementById('sponsorship-modal-status');
  const modalCta = document.getElementById('sponsorship-modal-cta');
  const modalCloseButtons = [
    document.getElementById('sponsorship-modal-close'),
    document.getElementById('sponsorship-modal-secondary')
  ];

  const getDictionary = (lang) => LABELS[lang] || LABELS.en;

  const hideSponsorshipModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.add('opacity-0', 'pointer-events-none');
  };

  const showSponsorshipModal = (item) => {
    if (!modal || !item || !modalTitle || !modalDescription || !modalPrice || !modalSponsor || !modalStatus || !modalCta) return;
    const dictionary = getDictionary(currentLang);
    const name = item.articleName?.[currentLang] || item.articleName?.en || '';
    const priceValue = item.estimatedPrice?.[currentLang] || item.estimatedPrice?.en || '';
    const description = item.fullDescription?.[currentLang] || item.fullDescription?.en || '';

    modalTitle.textContent = name;
    modalDescription.textContent = description;
    modalPrice.textContent = priceValue;

    if (item.sponsoredBy) {
      modalSponsor.parentElement.style.display = 'block';
      modalSponsor.textContent = item.sponsoredBy;
      modalStatus.textContent = dictionary.taken;
      modalCta.textContent = dictionary.ctaSponsored;
    } else {
      modalSponsor.parentElement.style.display = 'none';
      modalStatus.textContent = dictionary.available;
      modalCta.textContent = dictionary.ctaAvailable;
    }

    modalCta.href = contactFormUrl;

    modal.classList.add('active');
    modal.classList.remove('opacity-0', 'pointer-events-none');
  };

  const loadPartnerLogos = () =>
    fetch('../assets/images/partners/partners.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          partnerLogos = data.reduce((acc, partner) => {
            if (partner.id && partner.svg) {
              acc[partner.id] = partner.svg;
            }
            return acc;
          }, {});
        }
      })
      .catch(error => {
        console.error('Could not load partner logos:', error);
        partnerLogos = {};
      });

  const renderGrid = (lang) => {
    const dictionary = LABELS[lang] || LABELS.en;
    // Attempt to use global translations first, falling back to local LABELS
    const takenStatusEl = document.querySelector('[data-key="taken_status"]');
    const sponsoredLabelEl = document.querySelector('[data-key="sponsored_by_label"]');
    const takenStatus = takenStatusEl ? takenStatusEl.textContent : dictionary.taken;
    const sponsoredLabel = sponsoredLabelEl ? sponsoredLabelEl.textContent : dictionary.sponsored;


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
      const sponsorSvg = isSponsored ? (partnerLogos[item.sponsoredBy] || '') : '';
      
      let contentHtml;
      let articleClass = isSponsored ? 'sponsored-item relative' : '';

      if (isSponsored) {
        contentHtml = `
          <div class="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center p-6 text-center sponsored-overlay">
            <div class="relative w-full h-full flex flex-col items-center justify-center p-4">
                <span class="absolute inset-0 w-full h-full p-6 opacity-10 flex items-center justify-center pointer-events-none partner-logo-overlay">
                  ${sponsorSvg}
                </span>
                <p class="text-sm uppercase tracking-widest text-red-300 relative z-10">${takenStatus}</p>
                <h4 class="text-xl font-bold mt-2 text-white relative z-10">${sponsoredLabel}</h4>
                <p class="text-lg font-semibold text-white relative z-10">${item.sponsoredBy}</p>
            </div>
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
        <article class="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/30 ${articleClass}" data-item-id="${item.id}">
          <h3 class="text-2xl font-semibold mb-4 orange-first-letter">${name}</h3>
          ${contentHtml}
        </article>
      `;
    }).join('');

    attachItemClickHandlers();
  };

  const loadItems = () =>
    fetch('sponsorship_items.json')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        items = Array.isArray(data) ? data : [];
      })
      .catch(error => {
        console.error('Could not load sponsorship items:', error);
        const dictionary = LABELS[currentLang] || LABELS.en;
        grid.innerHTML = `<p class="text-red-400">${dictionary.error}</p>`;
        throw error;
      });

  Promise.all([loadPartnerLogos(), loadItems()])
    .then(() => {
      renderGrid(currentLang);
    })
    .catch(error => {
      console.error('Initialization error:', error);
    });

  document.addEventListener('dta:language-changed', (event) => {
    currentLang = event.detail?.lang || 'de';
    renderGrid(currentLang);
  });

  const attachItemClickHandlers = () => {
    const cards = grid.querySelectorAll('[data-item-id]');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.getAttribute('data-item-id');
        const selectedItem = items.find(entry => entry.id === itemId);
        showSponsorshipModal(selectedItem);
      });
    });
  };

  modalCloseButtons.forEach(button => {
    if (button) button.addEventListener('click', hideSponsorshipModal);
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) hideSponsorshipModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideSponsorshipModal();
    });
  }
});
