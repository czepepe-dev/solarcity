async function zobrazitVsechnyProdukty() {
  const cilovyDiv = document.getElementById('vypis-nejnovejsich-veci');
  if (!cilovyDiv) return;

  try {
    // 1. Získáme seznam souborů (vždy čerstvý seznam z API)
    const apiAdresa = `https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`;
    const odpoved = await fetch(apiAdresa);
    const soubory = await odpoved.json();

    const jsonSoubory = soubory.filter(s => s.name.endsWith('.json'));

    // 2. Načteme obsah všech produktů paralelně
    const vsechnyProdukty = await Promise.all(
      jsonSoubory.map(async (soubor) => {
        try {
          const res = await fetch(`/data/productos/${soubor.name}?cache_bust=${Date.now()}`);
          if (!res.ok) return null;
          const data = await res.json();
          // Uložíme si název souboru pro URL slug
          data.slug_name = soubor.name.replace('.json', '');
          // Převedeme ID na číslo pro spolehlivé řazení
          data.numeric_id = data.id ? parseInt(data.id) : 0;
          return data;
        } catch (e) { return null; }
      })
    );

    // 3. SEŘAZENÍ (Tady se to děje): Seřadíme pole v paměti podle ID sestupně
    const serazene = vsechnyProdukty
      .filter(p => p !== null)
      .sort((a, b) => b.numeric_id - a.numeric_id);

    // 4. Vykreslení
    cilovyDiv.innerHTML = serazene.map(p => `
      <div class="produkt-card">
        <div class="produkt-image-container">
            <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.slug_name}'" style="cursor:pointer;">
        </div>
        <h3 class="produkt-nazev">${p.nombre}</h3>
        <p class="produkt-cena">${p.precio}</p>
        <div class="produkt-buttons">
          <a href="producto.html?slug=${p.slug_name}" class="produkt-info-btn">DETALLE</a>
          <a href="contacto.html" class="produkt-btn">ORDENAR</a>
        </div>
      </div>
    `).join('');

    console.log("Produkty seřazeny podle ID:", serazene.map(p => p.id));

  } catch (err) {
    console.error("Chyba při vykreslování:", err);
  }
}

zobrazitVsechnyProdukty();
