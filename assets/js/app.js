async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam všech souborů ze složky data/productos přes GitHub API
    // Používáme tvoji adresu z konfigurace
    const repoOwner = "solar-city-cuba"; // Uprav podle svého jména na GitHubu, pokud je jiné
    const repoName = "solarcity";      // Uprav podle názvu tvého repozitáře
    
    // Prozatím použijeme metodu prohledávání známých cest, dokud nepotvrdíš propojení s API
    // Pokud API není nastaveno, použijeme tuto automatickou metodu načítání:
    const resList = await fetch('https://api.github.com/repos/lucianoneder/solarcity/contents/data/productos');
    const files = await resList.json();

    // Filtrujeme jen JSON soubory a ignorujeme složky
    const soubory = files
      .filter(file => file.name.endsWith('.json'))
      .map(file => file.name);

    // 2. Načteme obsah všech nalezených souborů
    const vsechnyProdukty = await Promise.all(
      soubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          data.slug = soubor.replace('.json', '');
          // Uložíme si čas poslední změny ze souboru pro řazení (pokud existuje)
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. Odstraníme prázdné a SEŘADÍME (nejnovější nahoru - předpokládáme, že nové jsou na konci seznamu z API)
    const platneProdukty = vsechnyProdukty.filter(p => p !== null).reverse();

    // 4. VÝPIS DO HTML
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
    console.error("Automatické načítání selhalo, zkouším záložní seznam:", err);
    // Záložní metoda, pokud API limituje požadavky
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
