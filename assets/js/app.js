async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam souborů z GitHubu
    const response = await fetch('https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos');
    if (!response.ok) throw new Error('Chyba při načítání seznamu');
    const files = await response.json();

    // Filtrujeme jen JSON
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    // 2. Načteme obsah produktů
    const nacteneProdukty = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          // Načteme obsah souboru
          const res = await fetch(`/data/productos/${file.name}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          
          data.slug = file.name.replace('.json', '');
          
          // DŮLEŽITÉ: Pokusíme se získat ID z dat pro řazení, pokud tam je
          // Pokud ne, použijeme název souboru
          data.sortId = data.id ? Number(data.id) : file.name;
          
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Pokud mají produkty ID, řadíme podle něj sestupně (od nejvyššího)
    // Pokud ID nemají, použijeme obrácené abecední pořadí názvů souborů
    const platneProdukty = nacteneProdukty.filter(p => p !== null);
    
    platneProdukty.sort((a, b) => {
      if (typeof a.sortId === 'number' && typeof b.sortId === 'number') {
        return b.sortId - a.sortId;
      }
      return String(b.slug).localeCompare(String(a.slug));
    });

    // 4. Vykreslení
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
    console.error("Chyba:", err);
  }
}

nactiNoveProdukty();

const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
if (btn && themeLink) {
  btn.addEventListener('click', () => {
    const isDay = themeLink.getAttribute('href').includes('day');
    themeLink.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
    btn.textContent = isDay ? 'Día' : 'Noche';
  });
}
