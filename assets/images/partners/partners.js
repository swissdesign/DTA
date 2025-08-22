
export async function renderPartners(selector = '#partners-grid', jsonUrl = 'partners.json') {
  const grid = document.querySelector(selector);
  if (!grid) return;
  try {
    const res = await fetch(jsonUrl, { cache: 'no-store' });
    const partners = await res.json();
    partners.forEach(p => {
      const a = document.createElement('a');
      a.href = p.href || '#';
      a.className = 'group block aspect-[3/2] md:aspect-[4/3] rounded-2xl bg-neutral-900/50 hover:bg-neutral-800/70 border border-neutral-800 hover:border-neutral-700 transition p-4 flex items-center justify-center';
      a.setAttribute('aria-label', p.name);
      a.innerHTML = `<span class="partner-logo block w-full h-full max-w-[180px] md:max-w-[220px] opacity-80 group-hover:opacity-100 transition">${p.svg}</span>`;
      grid.appendChild(a);
    });
  } catch (e) {
    console.error('Error loading partners:', e);
    grid.innerHTML = '<p class="text-red-500">Failed to load partners.</p>';
  }
}
