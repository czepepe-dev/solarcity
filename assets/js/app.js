async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  // SEZNAM VŠECH 7 PRODUKTŮ - Seřazeno od nejnovějšího
  const soubory = [
    'novy-ppp.json',
    'test2.json',
    'test.json',
    'power-bank-solar-portatil-20000-mah.json',
    'power-bank-solar-20000.json',
    'power-bank-solar-portátil-20000-mah.json', // Opravený název s diakritikou dle struktury
    'test.json' // Pokud máš další testovací, přidej sem přesný název souboru
  ];

  // Odstranění duplicit, pokud by se v seznamu opakovaly
  const unikatniSoubory = [...new Set(soubory)];

  try {
    const vsechnyProdukty = await Promise.all(
      unikatniSoubory.map(async (soubor) => {
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

    const platneProdukty = vsechnyProdukty.filter(p => p !== null);

    container.innerHTML = platneProdukty.map(p => `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.slug}'" style="cursor:pointer;">
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.slug}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// Spustit hned
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
