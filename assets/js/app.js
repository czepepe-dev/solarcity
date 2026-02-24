async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam souborů z tvého GitHubu
    const response = await fetch('https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos');
    if (!response.ok) throw new Error('Chyba při načítání seznamu');
    const files = await response.json();

    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    // 2. Načteme obsah všech produktů
    const nacteneProdukty = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const res = await fetch(`/data/productos/${file.name}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          // Přidáme slug pro odkaz
          data.slug = file.name.replace('.json', '');
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Přesně podle ID sestupně (od nejvyššího k nejnižšímu)
    // Takhle to dělají tvé kategorie, aby nejnovější byl první.
    const platneProdukty = nacteneProdukty
      .filter(p => p !== null)
      .sort((a, b) => {
        const idA = a.id ? parseInt(a.id) : 0;
        const idB = b.id ? parseInt(b.id) : 0;
        return idB - idA;
      });

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
    console.error("Chyba při řazení:", err);
  }
}

// Spuštění
nactiNoveProdukty();

// Tlačítko pro změnu tématu
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
if (btn && themeLink) {
  btn.addEventListener('click', () => {
    const isDay = themeLink.getAttribute('href').includes('day');
    themeLink.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
    btn.textContent = isDay ? 'Día' : 'Noche';
  });
}
