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
      .sort((a, b) => new Date(b.commit?.committer?.date || 0) - new Date(a.commit?.committer?.date || 0))
      .map(f => f.name);

  } catch (e) { return []; }
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
