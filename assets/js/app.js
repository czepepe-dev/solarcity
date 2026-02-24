async function zobrazitVsechnyProdukty() {
  const cilovyDiv = document.getElementById('vypis-nejnovejsich-veci');
  if (!cilovyDiv) return;

  try {
    const apiAdresa = `https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?nocache=${Date.now()}`;
    const odpoved = await fetch(apiAdresa);
    if (!odpoved.ok) throw new Error('API Error');
    const soubory = await odpoved.json();

    const jsonSoubory = soubory.filter(s => s.name.endsWith('.json'));

    const dataProduktu = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor.name}?v=${Date.now()}`);
          if (!res.ok) return null;
          const json = await res.json();
          
          // Čistý slug pro URL (odstraní diakritiku a mezery)
          json.url_slug = soubor.name.replace('.json', '');
          
          return json;
        } catch (e) {
          return null;
        }
      })
    );

    // SEŘAZENÍ: Přesně podle ID (nejvyšší číslo ID = nejnovější produkt)
    const hotoveProdukty = dataProduktu
      .filter(p => p !== null)
      .sort((a, b) => {
        const idA = a.id ? parseInt(a.id) : 0;
        const idB = b.id ? parseInt(b.id) : 0;
        return idB - idA;
      });

    cilovyDiv.innerHTML = hotoveProdukty.map(p => `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.url_slug}'" style="cursor:pointer;">
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

zobrazitVsechnyProdukty();

const prepinac = document.getElementById('theme-toggle');
const styl = document.getElementById('theme-style');
if (prepinac && styl) {
  prepinac.addEventListener('click', () => {
    const jeDen = styl.getAttribute('href').includes('day');
    styl.setAttribute('href', jeDen ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
  });
}
