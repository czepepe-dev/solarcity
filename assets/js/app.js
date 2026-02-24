async function zobrazitVsechnyProdukty() {
  const cilovyDiv = document.getElementById('vypis-nejnovejsich-veci');
  if (!cilovyDiv) return;

  try {
    // 1. Získáme seznam souborů z GitHubu s časovou značkou, aby se obešla cache
    const apiAdresa = `https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`;
    const odpoved = await fetch(apiAdresa);
    
    if (!odpoved.ok) throw new Error('API nedostupné');
    
    const soubory = await odpoved.json();
    const jsonSoubory = soubory.filter(s => s.name.endsWith('.json'));

    // 2. Načteme obsah všech nalezených souborů paralelně
    const nactenaData = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          // Použijeme download_url z GitHubu pro maximální čerstvost
          const res = await fetch(`${soubor.download_url}?t=${Date.now()}`);
          if (!res.ok) return null;
          
          const pData = await res.json();
          
          // Přidáme slug (název souboru bez .json) pro URL
          pData.url_slug = soubor.name.replace('.json', '');
          
          // Určíme klíč pro řazení (priorita je pole "id" v JSONu)
          pData.sortKey = pData.id ? parseInt(pData.id) : 0;
          
          return pData;
        } catch (e) {
          console.error(`Chyba načítání souboru ${soubor.name}:`, e);
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Od nejvyššího ID po nejnižší
    const serazeneProdukty = nactenaData
      .filter(p => p !== null)
      .sort((a, b) => b.sortKey - a.sortKey);

    // 4. VYKRESLENÍ DO HTML
    cilovyDiv.innerHTML = serazeneProdukty.map(p => `
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
    console.error("Chyba při vykreslování produktů:", chyba);
    cilovyDiv.innerHTML = "<p>Error al cargar productos.</p>";
  }
}

// Spuštění hlavní funkce
zobrazitVsechnyProdukty();

// Funkce pro přepínání témat (Day/Night)
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const themeStyle = document.getElementById('theme-style');

    if (themeBtn && themeStyle) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = themeStyle.getAttribute('href');
            if (currentTheme.includes('day')) {
                themeStyle.setAttribute('href', 'assets/css/style-night.css');
                themeBtn.textContent = 'Día';
            } else {
                themeStyle.setAttribute('href', 'assets/css/style-day.css');
                themeBtn.textContent = 'Noche';
            }
        });
    }
});
