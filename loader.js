// --- KONFIGURACE ---
const REPO_OWNER = "czepepe-dev";
const REPO_NAME = "solarcity";
const PRODUCT_PATH = "data/productos";

// --- AUTOMATICKÉ ZÍSKÁNÍ SEZNAMU SOUBORŮ ---
async function ziskejSeznamSouboru() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCT_PATH}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const files = await resp.json();
    // Vyfiltrujeme jen .json soubory
    return files
      .filter(f => f.name.endsWith('.json'))
      .map(f => f.name);
  } catch (e) {
    console.error("Chyba při načítání seznamu:", e);
    return [];
  }
}

// --- NAČTENÍ PRODUKTŮ PRO KATEGORII ---
async function nactiProdukty(kategorie) {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  
  for (const file of seznam) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      if (data && data.categoria === kategorie) {
        if (!data.slug) data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { }
  }
  vykresliKarty(produkty, "produkty");
}

// --- NAČTENÍ NEJNOVĚJŠÍCH PRODUKTŮ ---
async function nactiNoveProdukty() {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  // Vezmeme poslední 3 soubory ze seznamu (ty nejnovější)
  const posledni = seznam.slice(-3).reverse();

  for (const file of posledni) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
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

// --- VYKRESLENÍ KARET ---
function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = produkty.length === 0 ? "<p>No hay productos.</p>" : "";
  
  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
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
