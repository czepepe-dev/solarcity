async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam souborů z tvého GitHubu
    const response = await fetch('https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos');
    
    if (!response.ok) {
      throw new Error('Nepodařilo se načíst seznam produktů');
    }

    const files = await response.json();

    // Filtrujeme jen .json soubory
    const jsonSoubory = files.filter(file => file.name.endsWith('.json'));

    // 2. Načteme obsah všech nalezených souborů
    const nacteneProdukty = await Promise.all(
      jsonSoubory.map(async (file) => {
        try {
          const res = await fetch(`/data/productos/${file.name}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          data.slug = file.name.replace('.json', '');
          // Uložíme si cestu k souboru pro případné další zpracování
          data.filePath = file.path;
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Přesně podle logiky v kategoriích
    // Pokud tvá kategorie řadí podle toho, co bylo přidáno naposledy (v abecedním seznamu GitHubu jsou to ty dole),
    // použijeme .reverse(), aby nejnovější byly nahoře.
    const platneProdukty = nacteneProdukty.filter(p => p !== null).reverse();

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
    console.error("Chyba při načítání produktů na indexu:", err);
  }
}

// Spuštění funkce pro index
nactiNoveProdukty();

// Tlačítko pro změnu tématu (Zůstává původní)
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
if (btn && themeLink) {
  btn.addEventListener('click', () => {
    const isDay = themeLink.getAttribute('href').includes('day');
    themeLink.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
    btn.textContent = isDay ? 'Día' : 'Noche';
  });
}
