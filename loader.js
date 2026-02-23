const REPO_OWNER = "czepepe-dev";
const REPO_NAME = "solarcity";
const PRODUCT_PATH = "data/productos";

// Funkce pro získání seznamu všech JSON souborů ve složce
async function ziskejSeznamSouboru() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCT_PATH}?ref=main&t=${Date.now()}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const files = await resp.json();
    return files.filter(f => f.name.endsWith('.json')).map(f => f.name);
  } catch (e) {
    console.error("Chyba při načítání seznamu souborů:", e);
    return [];
  }
}

// Načtení produktů pro konkrétní kategorii (použito v categoria.html)
async function nactiProdukty(kategorie) {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  const container = document.getElementById("produkty");
  if (container) container.innerHTML = "<p>Cargando productos...</p>";

  for (const file of seznam) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      
      // Oprava: porovnání kategorií bez ohledu na velká/malá písmena
      if (data.categoria && data.categoria.toLowerCase().trim() === kategorie.toLowerCase().trim()) {
        data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { console.error("Chyba u souboru:", file); }
  }
  vykresliKarty(produkty, "produkty");
}

// Načtení 3 nejnovějších produktů (použito v index.html)
async function nactiNoveProdukty() {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  const posledni = seznam.slice(-3).reverse();

  for (const file of posledni) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
      if (!resp.ok) continue;
      const data = await resp.json();
      data.slug = file.replace(".json", "");
      produkty.push(data);
    } catch (e) { }
  }
  vykresliKarty(produkty, "nove-produkty");
}

// Společná funkce pro vykreslení karet produktů
function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  
  if (produkty.length === 0) {
    cont.innerHTML = "<p>No hay productos disponibles en esta sección.</p>";
    return;
  }

  cont.innerHTML = "";
  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
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
        <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
          <button class="produkt-btn" onclick="window.location.href='contacto.html'">ORDENAR</button>
          <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">DETALLES</button>
          <button onclick="history.back()" style="background:#666; color:white; border:none; padding:8px 12px; border-radius:4px; cursor:pointer; font-size: 12px;">VOLVER</button>
        </div>
      </div>
    `;
  });
}
