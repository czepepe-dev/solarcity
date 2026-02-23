const REPO_OWNER = "czepepe-dev";
const REPO_NAME = "solarcity";
const PRODUCT_PATH = "data/productos";

async function ziskejSeznamSouboru() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCT_PATH}?ref=main&t=${Date.now()}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const files = await resp.json();
    return files.filter(f => f.name.endsWith('.json')).map(f => f.name);
  } catch (e) { return []; }
}

async function nactiProdukty(kategorie) {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  const container = document.getElementById("produkty");
  if (container) container.innerHTML = "";

  for (const file of seznam) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
      const data = await resp.json();
      
      // Tahle část musí být přesná, aby fungovalo zařazení do kategorie
      if (data.categoria && data.categoria.toLowerCase().trim() === kategorie.toLowerCase().trim()) {
        data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) {}
  }
  vykresliKarty(produkty, "produkty");
}

async function nactiNoveProdukty() {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  const posledni = seznam.slice(-3).reverse();

  for (const file of posledni) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}`);
      const data = await resp.json();
      data.slug = file.replace(".json", "");
      produkty.push(data);
    } catch (e) {}
  }
  vykresliKarty(produkty, "nove-produkty");
}

function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;
  cont.innerHTML = produkty.length === 0 ? "<p>No hay productos disponibles.</p>" : "";
  
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
        <div class="produkt-buttons">
          <button class="produkt-btn" onclick="window.location.href='contacto.html'">ORDENAR</button>
          <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">DETALLES</button>
        </div>
      </div>`;
  });
}
