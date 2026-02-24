async function nactiNoveProdukty() {
  const container = document.getElementById('nove-produkty');
  if (!container) return;

  try {
    // 1. Získáme seznam souborů i s metadaty (SHA) z tvého GitHubu
    const response = await fetch('https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos');
    if (!response.ok) throw new Error('Chyba při načítání seznamu');
    const files = await response.json();

    const jsonFiles = files.filter(f => f.name.endsWith('.json'));

    // 2. Pro každý soubor zjistíme datum poslední změny přes GitHub Commits API
    const nacteneProdukty = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          // Získáme datum poslední změny souboru
          const commitRes = await fetch(`https://api.github.com/repos/czepepe-dev/solarcity/commits?path=data/productos/${file.name}&page=1&per_page=1`);
          const commitData = await commitRes.json();
          const date = commitData[0] ? new Date(commitData[0].commit.committer.date) : new Date(0);

          // Načteme samotný obsah JSONu
          const res = await fetch(`/data/productos/${file.name}?t=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          
          data.slug = file.name.replace('.json', '');
          data.updatedAt = date.getTime(); // Čas v milisekundách pro přesné řazení
          
          return data;
        } catch (e) {
          return null;
        }
      })
    );

    // 3. SEŘAZENÍ: Od nejnovějšího podle času úpravy na GitHubu
    const platneProdukty = nacteneProdukty
      .filter(p => p !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);

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
    console.error("Chyba řazení:", err);
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
