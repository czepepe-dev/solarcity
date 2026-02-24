const REPO_OWNER = "czepepe-dev";
const REPO_NAME = "solarcity";
const PRODUCT_PATH = "data/productos";

async function ziskejSeznamSouboru() {
  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PRODUCT_PATH}?ref=main&t=${Date.now()}`;
    const resp = await fetch(url);
    if (!resp.ok) return [];
    const files = await resp.json();

    // Seřadíme podle názvu a otočíme (nejnovější nahoře)
    return files
      .filter(f => f.name.endsWith('.json'))
      .map(f => f.name)
      .sort()
      .reverse();

  } catch (e) { return []; }
}

async function nactiProdukty(kategorie) {
  const seznam = await ziskejSeznamSouboru();
  const produkty = [];
  const container = document.getElementById("produkty");
  if (container) container.innerHTML = "<p>Cargando productos...</p>";

  for (const file of seznam) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}?t=${Date.now()}`);
      const data = await resp.json();

      const katVJsonu = String(data.categoria || "").toLowerCase().trim();
      const katHledana = String(kategorie || "").toLowerCase().trim();

      if (katVJsonu === katHledana) {
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

  const posledni = seznam.slice(0, 9);

  for (const file of posledni) {
    try {
      const resp = await fetch(`/${PRODUCT_PATH}/${file}?t=${Date.now()}`);
      const data = await resp.json();
      data.slug = file.replace(".json", "");
      produkty.push(data);
    } catch (e) {}
  }

  vykresliKarty(produkty, "nove-produkty");
}
