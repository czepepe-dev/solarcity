async function nactiProdukty() {
  const container = document.getElementById('nove-produkty') || document.getElementById('vypis-nejnovejsich-veci') || document.getElementById('productos-grid');
  if (!container) return;

  try {
    const response = await fetch(`https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`);
    if (!response.ok) throw new Error('GitHub API error');
    const files = await response.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    const nactene = await Promise.all(jsonFiles.map(async (f) => {
      try {
        const res = await fetch(`/data/productos/${f.name}?t=${Date.now()}`);
        if (!res.ok) return null;
        const data = await res.json();
        data.url_slug = f.name.replace('.json', '');
        data.sort_id = data.id ? parseInt(data.id) : 0;
        return data;
      } catch (e) { return null; }
    }));

    const platneProdukty = nactene.filter(p => p !== null);

    // Detekce kategorie podle názvu souboru (např. powerbanks.html)
    const pagename = window.location.pathname.split("/").pop();
    let filtrovane = platneProdukty;
    
    if (pagename.includes('powerbanks')) filtrovane = platneProdukty.filter(p => p.categoria === 'Powerbanks');
    if (pagename.includes('paneles')) filtrovane = platneProdukty.filter(p => p.categoria === 'Paneles');
    if (pagename.includes('luces')) filtrovane = platneProdukty.filter(p => p.categoria === 'Luces');

    // SEŘAZENÍ: Sestupně podle ID
    filtrovane.sort((a, b) => b.sort_id - a.sort_id);

    container.innerHTML = filtrovane.map(p => `
      <div class="produkt-card">
        <div class="produkt-image-container">
          <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.url_slug}'" style="cursor:pointer;">
        </div>
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.url_slug}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error("Chyba:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  nactiProdukty();
  const btn = document.getElementById('theme-toggle');
  const style = document.getElementById('theme-style');
  if (btn && style) {
    btn.addEventListener('click', () => {
      const isDay = style.getAttribute('href').includes('day');
      style.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
      btn.textContent = isDay ? 'Día' : 'Noche';
    });
  }
});
