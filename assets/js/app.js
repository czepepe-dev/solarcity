// Funkce pro načtení seznamu všech JSON souborů produktů
async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // Seznam všech tvých produktů (přesně podle tvé struktury složek)
    const soubory = [
      'novy-ppp.json',
      'power-bank-solar-20000.json',
      'power-bank-solar-portatil-20000-mah.json',
      'test.json',
      'test2.json'
    ];

    // Načteme obsah všech souborů paralelně
    const vsechnyProdukty = await Promise.all(
      soubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor}?t=${Date.now()}`);
          const data = await res.json();
          // Přidáme slug (název souboru bez .json) pro odkaz na detail
          data.slug = soubor.replace('.json', '');
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // Odfiltrujeme neúspěšné pokusy
    const platneProdukty = vsechnyProdukty.filter(p => p !== null);

    // SEŘAZENÍ: Od nejnovějšího (v JavaScriptu otočíme pořadí pole, protože nové jsou na konci seznamu)
    const serazene = platneProdukty.reverse();

    // VÝPIS DO HTML
    container.innerHTML = serazene.map(p => `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.slug}'">
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.slug}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error("Chyba při načítání produktů:", error);
  }
}

// Funkce pro přepínání témat (ponechána z původního kódu)
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');

if (btn) {
  btn.addEventListener('click', () => {
    if (themeLink.getAttribute('href').includes('day')) {
      themeLink.setAttribute('href', 'assets/css/style-night.css');
      btn.textContent = 'Día';
    } else {
      themeLink.setAttribute('href', 'assets/css/style-day.css');
      btn.textContent = 'Noche';
    }
  });
}
