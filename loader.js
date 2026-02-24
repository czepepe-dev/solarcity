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

  // Řazení podle created (nejnovější nahoře)
  produkty.sort((a, b) => {
    return new Date(b.created || 0) - new Date(a.created || 0);
  });

  return produkty;
}

async function nactiProdukty(kategorie) {
  const container = document.getElementById("produkty");
  if (container) container.innerHTML = "<p>Cargando productos...</p>";

  const vsechny = await nactiVsechnyProdukty();

  const filtrovane = vsechny.filter(p => {
    const katVJsonu = String(p.categoria || "").toLowerCase().trim();
    const katHledana = String(kategorie || "").toLowerCase().trim();
    return katVJsonu === katHledana;
  });

  vykresliKarty(filtrovane, "produkty");
}

async function nactiNoveProdukty() {
  const vsechny = await nactiVsechnyProdukty();

  // maximálně 9 nejnovějších
  const top9 = vsechny.slice(0, 9);

  vykresliKarty(top9, "nove-produkty");
}

function vykresliKarty(produkty, containerId) {
  const cont = document.getElementById(containerId);
  if (!cont) return;

  cont.innerHTML = produkty.length === 0
    ? "<p>No hay productos disponibles.</p>"
    : "";

  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;

    const cistyText = (p.descripcion || "")
      .replace(/[#*`_]/g, "")
      .replace(/<[^>]*>/g, "");

    const shortText = cistyText.substring(0, 120);

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
