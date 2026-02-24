async function nactiProdukty() {
  // Najde kontejner na indexu i v kategoriích
  const container = document.getElementById('nove-produkty') || 
                    document.getElementById('vypis-nejnovejsich-veci') || 
                    document.getElementById('productos-grid') ||
                    document.querySelector('.produkty-grid');
                    
  if (!container) return;

  try {
    // Načtení seznamu ze složky přes GitHub API
    const response = await fetch(`https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`);
    if (!response.ok) throw new Error('GitHub API nedostupné');
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

    let produkty = nactene.filter(p => p !== null);

    // Automatické filtrování podle kategorie (pokud jsme v souboru kategorie)
    const pagename = window.location.pathname.toLowerCase();
    if (pagename.includes('powerbanks')) produkty = produkty.filter(p => p.categoria === 'Powerbanks');
    else if (pagename.includes('paneles')) produkty = produkty.filter(p => p.categoria === 'Paneles');
    else if (pagename.includes('luces')) produkty = produkty.filter(p => p.categoria === 'Luces');

    // SEŘAZENÍ: Nejnovější (nejvyšší ID) jako první
    produkty.sort((a, b) => b.sort_id - a.sort_id);

    // Vykreslení
    container.innerHTML = produkty.map(p => `
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
    console.error("Chyba při načítání produktů:", err);
  }
}

// Spuštění po načtení stránky
document.addEventListener('DOMContentLoaded', nactiProdukty);
