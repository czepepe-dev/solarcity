async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam souborů přímo z tvého GitHubu
    const response = await fetch('https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos');
    
    if (!response.ok) {
      throw new Error('Nepodařilo se načíst seznam produktů z GitHubu');
    }

    const files = await response.json();

    // Filtrujeme jen .json soubory
    const jsonSoubory = files
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name);

    // 2. Načteme obsah všech nalezených souborů
    const nacteneProdukty = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          data.slug = soubor.replace('.json', '');
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. Odstraníme chyby a seřadíme od nejnovějšího (reverse)
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
    console.error("Chyba při automatickém načítání:", err);
    container.innerHTML = `<p>Chyba při načítání produktů. Zkontroluj připojení.</p>`;
  }
}

// Spuštění funkce
nactiNoveProdukty();

// Tlačítko pro změnu tématu (Day/Night)
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
if (btn && themeLink) {
  btn.addEventListener('click', () => {
    const isDay = themeLink.getAttribute('href').includes('day');
    themeLink.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
    btn.textContent = isDay ? 'Día' : 'Noche';
  });
}
