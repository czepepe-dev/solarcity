// --- 1. SEZNAM SOUBORŮ ---
const SEZNAM_SOUBORU = [
  "power-bank-solar-portatil-20000-mah.json"
];

// --- 2. NAČTENÍ PRO KATEGORIE ---
async function nactiProdukty(kategorie) {
  const produkty = [];
  for (const file of SEZNAM_SOUBORU) {
    try {
      const resp = await fetch(`/data/productos/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data && data.categoria === kategorie) {
        if (!data.slug) data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { console.error("Chyba:", file, e); }
  }
  vykresliKarty(produkty, "produkty");
}

// --- 3. NAČTENÍ PRO INDEX ---
async function nactiNoveProdukty() {
  const produkty = [];
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
    } catch (e) { }
  }
  vykresliKarty(produkty, "nove-produkty");
}

// --- 4. VYKRESLENÍ KARET ---
function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = "";
  produkty.forEach(p => {
    // POUŽÍVÁME .html A PŘIDÁVÁME TIMESTAMP PROTI CACHE
    const detailUrl = `producto.html?slug=${p.slug}&v=${Date.now()}`;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = p.descripcion || "";
    const shortText = (tempDiv.textContent || "").substring(0, 120);

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
      </div>`;
  });
}
