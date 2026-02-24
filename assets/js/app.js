async function zobrazitVsechnyProdukty() {
  const cilovyDiv = document.getElementById('vypis-nejnovejsich-veci');
  if (!cilovyDiv) return;

  try {
    // 1. Získáme seznam souborů - přidáme unikátní čas pro obejití cache GitHubu
    const apiAdresa = `https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?nocache=${new Date().getTime()}`;
    const odpoved = await fetch(apiAdresa);
    if (!odpoved.ok) throw new Error('API nedostupné');
    const soubory = await odpoved.json();

    const jsonSoubory = soubory.filter(s => s.name.endsWith('.json'));

    // 2. Načteme obsah všech nalezených souborů
    const dataProduktu = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor.name}?v=${new Date().getTime()}`);
          if (!res.ok) return null;
          const json = await res.json();
          json.moje_id = soubor.name.replace('.json', '');
          return json;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Podle ID (pokud existuje) nebo podle abecedy (novější produkty jsou v seznamu GitHubu obvykle níže)
    const hotoveProdukty = dataProduktu
      .filter(p => p !== null)
      .sort((a, b) => {
        const idA = a.id ? parseInt(a.id) : 0;
        const idB = b.id ? parseInt(b.id) : 0;
        // Pokud mají oba ID, řadíme podle ID sestupně
        if (idA !== idB) return idB - idA;
        // Pokud ID nemají, řadíme podle názvu souboru sestupně
        return b.moje_id.localeCompare(a.moje_id);
      });

    // 4. Vykreslení (všech nalezených, neomezujeme počet)
    cilovyDiv.innerHTML = hotoveProdukty.map(p => `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.moje_id}'" style="cursor:pointer;">
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.moje_id}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');

  } catch (chyba) {
    console.error("Chyba při načítání:", chyba);
  }
}

// Spuštění nové funkce
zobrazitVsechnyProdukty();

// Zachování funkčnosti přepínání témat
const prepinac = document.getElementById('theme-toggle');
const styl = document.getElementById('theme-style');
if (prepinac && styl) {
  prepinac.addEventListener('click', () => {
    const jeDen = styl.getAttribute('href').includes('day');
    styl.setAttribute('href', jeDen ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
  });
}
