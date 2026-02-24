async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Načtení seznamu souborů z GitHubu s náhodným číslem proti mezipaměti
    const response = await fetch(`https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`);
    if (!response.ok) throw new Error('Nelze načíst seznam produktů');
    const files = await response.json();

    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    // 2. Načtení obsahu všech produktů
    const nacteneProdukty = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const res = await fetch(`/data/productos/${file.name}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          data.slug = file.name.replace('.json', '');
          
          // Pokud produkt nemá ID, zkusíme ho vytáhnout z názvu souboru nebo data
          // Toto zajistí, že i nové produkty bez ID se zařadí správně
          data.sortValue = data.id ? parseInt(data.id) : Date.now();
          
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Od nejnovějšího (nejvyšší sortValue/ID)
    const platneProdukty = nacteneProdukty
      .filter(p => p !== null)
      .sort((a, b) => b.sortValue - a.sortValue);

    // 4. Vykreslení do HTML
    container.innerHTML = platneProdukty.map(p => `
      <div class="produkt-card">
        <div class="produkt-image-container">
            <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.slug}'" style="cursor:pointer;">
        </div>
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.slug}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error("Chyba při načítání:", err);
  }
}

// Spuštění funkce
nactiNoveProdukty();

// Tlačítko témat
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
if (btn && themeLink) {
  btn.addEventListener('click', () => {
    const isDay = themeLink.getAttribute('href').includes('day');
    themeLink.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
    btn.textContent = isDay ? 'Día' : 'Noche';
  });
}
