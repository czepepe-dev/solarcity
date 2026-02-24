async function zobrazitVsechnyProdukty() {
  const cilovyDiv = document.getElementById('vypis-nejnovejsich-veci');
  if (!cilovyDiv) return;

  try {
    // 1. Načtení seznamu souborů z GitHubu (vždy čerstvé díky timestampu)
    const apiAdresa = `https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`;
    const odpoved = await fetch(apiAdresa);
    if (!odpoved.ok) throw new Error('API Error');
    const soubory = await odpoved.json();

    const jsonSoubory = soubory.filter(s => s.name.endsWith('.json'));

    // 2. Paralelní načtení obsahu všech JSON souborů
    const dataProduktu = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor.name}?v=${Date.now()}`);
          if (!res.ok) return null;
          const json = await res.json();
          
          // Uložíme čistý slug (název souboru) pro URL bez diakritiky
          json.url_slug = soubor.name.replace('.json', '');
          // Převedeme ID na číslo pro přesné řazení
          json.numeric_id = json.id ? parseInt(json.id) : 0;
          
          return json;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Nejvyšší ID (nejnovější) bude první
    const hotoveProdukty = dataProduktu
      .filter(p => p !== null)
      .sort((a, b) => b.numeric_id - a.numeric_id);

    // 4. Vykreslení do gridu
    cilovyDiv.innerHTML = hotoveProdukty.map(p => `
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

  } catch (chyba) {
    console.error("Chyba:", chyba);
  }
}

// Spuštění po načtení
zobrazitVsechnyProdukty();

// Téma přepínač
document.addEventListener('DOMContentLoaded', () => {
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
