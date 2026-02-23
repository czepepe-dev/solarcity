// --- 1. SEZNAM SOUBORŮ (Zde musí být přesný název tvého JSONu) ---
const SEZNAM_SOUBORU = [
  "power-bank-solar-portatil-20000-mah.json",
  // "dalsi-produkt.json",
  // "treti-produkt.json"
];

// --- 2. NAČTENÍ PRODUKTŮ PRO KATEGORII (categoria.html) ---
async function nactiProdukty(kategorie) {
  const produkty = [];
  
  for (const file of SEZNAM_SOUBORU) {
    try {
      const resp = await fetch(`/data/productos/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      
      // Kontrola kategorie
      if (data && data.categoria === kategorie) {
        if (!data.slug) data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { console.error("Chyba u souboru:", file, e); }
  }
  vykresliKarty(produkty, "produkty");
}

// --- 3. NAČTENÍ NEJNOVĚJŠÍCH PRODUKTŮ (index.html) ---
// Poznámka: v index.html prověř, zda voláš nactiNoveProdukty()
async function nactiNoveProdukty() {
  const produkty = [];
  // Vezmeme poslední přidané soubory
  const posledni = [...SEZNAM_SOUBORU].reverse().slice(0, 3);

  for (const file of posledni) {
    try {
      const resp = await fetch(`/data/productos/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      
      if (data) {
        if (!data.slug) data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { console.error("Chyba u souboru:", file, e); }
  }
  vykresliKarty(produkty, "nove-produkty");
}

// --- 4. FUNKCE PRO VYKRESLENÍ KARET (Sjednocená pro celý web) ---
function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  
  if (produkty.length === 0) {
    cont.innerHTML = "<p>No hay productos disponibles en esta categoría.</p>";
    return;
  }

  cont.innerHTML = "";
  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
    
    // Vyčištění textu pro náhled
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = p.descripcion || "";
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const shortText = plainText.substring(0, 120);

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="produkt-img" onclick="window.location.href='${detailUrl}'">
        <h2 class="produkt-nazev">${p.nombre}</h2>
        <h1 class="produkt-cena">${p.precio}</h1>
        <div class="produkt-popis">${shortText}...</div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <button class="produkt-btn" onclick="window.location.href='contacto.html'">ORDENAR</button>
          <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">DETALLES</button>
        </div>
      </div>
    `;
  });
}

// Pomocná funkce, kterou některé tvé stránky mohou vyžadovat
function dejCistyText(html, delka) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return (tempDiv.textContent || tempDiv.innerText || "").substring(0, delka);
}
