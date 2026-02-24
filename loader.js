const REPO_OWNER = "czepepe-dev";
const REPO_NAME = "solarcity";
const PRODUCT_PATH = "data/productos";

async function ziskejSeznamSouboru() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCT_PATH}?ref=main&t=${Date.now()}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const files = await resp.json();

    return files
      .filter(f => f.name.endsWith('.json'))
      .map(f => f.name)
      .sort((a, b) => b.localeCompare(a)); // nejnovější nahoře

  } catch (e) {
    return [];
  }
}

async function nactiVsechnyProdukty() {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];

  for (const file of seznam) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}?t=${Date.now()}`);
      const data = await resp.json();
      data.slug = file.replace(".json", "");
      produkty.push(data);
    } catch (e) {}
  }

  return produkty;
}

function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;

  cont.innerHTML = produkty.length === 0
    ? "<p>No hay productos disponibles.</p>"
    : "";

  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
    const shortText = (p.descripcion || "")
      .replace(/[#*`_]/g, "")
      .substring(0, 100);

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='${detailUrl}'">
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

// ==========================
// INDEX
// ==========================
async function nactiNoveProdukty() {
  const vse = await nactiVsechnyProdukty();
  vykresliKarty(vse.slice(0, 9), "nove-produkty");
}

// ==========================
// KATEGORIE
// ==========================
async function nactiProduktyKategorie() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat");

  if (!cat) return;

  const vse = await nactiVsechnyProdukty();

  const filtrovane = vse.filter(p =>
    String(p.categoria || "").toLowerCase().trim() === cat.toLowerCase().trim()
  );

  vykresliKarty(filtrovane, "lista-productos");
}

// Auto-detekce stránky
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    nactiNoveProdukty();
  }

  if (window.location.pathname.endsWith("categoria.html")) {
    nactiProduktyKategorie();
  }
});
