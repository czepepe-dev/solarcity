// ---------------------------------------------------------
// RUČNÍ SEZNAM PRODUKTŮ (Zde dopiš název nového .json souboru)
// ---------------------------------------------------------
const SEZNAM_SOUBORU = [
  "power-bank-solar-portatil-20000-mah.json",
  // "dalsi-produkt.json",
  // "treti-produkt.json"
];

// ---------------------------------------------------------
// NAČTENÍ PRODUKTŮ PRO KONKRÉTNÍ KATEGORII
// ---------------------------------------------------------
async function nactiProdukty(kategorie) {
  const produkty = [];

  // Načítáme data přímo z tvého webu
  for (const file of SEZNAM_SOUBORU) {
    try {
      const data = await fetch(`/data/productos/${file}`).then(r => r.ok ? r.json() : null);
      if (data && data.categoria === kategorie) {
        // Automatický slug, pokud v JSONu chybí
        if (!data.slug) {
          data.slug = file.replace(".json", "");
        }
        produkty.push(data);
      }
    } catch (e) { console.error("Chyba načítání souboru:", file); }
  }

  const cont = document.getElementById("produkty");
  if (!cont) return;
  cont.innerHTML = "";

  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
    const shortText = dejCistyText(p.descripcion, 160);

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="produkt-img" onclick="window.location.href='${detailUrl}'">
        <h2 class="produkt-nazev">${p.nombre}</h2>
        <h1 class="produkt-cena">${p.precio}</h1>
        <div class="produkt-popis">${shortText}...</div>
        <button class="produkt-btn" onclick="window.location.href='contacto.html'">ORDENAR</button>
        <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">DETALLES</button>
      </div>`;
  });
}

// ---------------------------------------------------------
// NAČTENÍ NEJNOVĚJŠÍCH PRODUKTŮ (Index)
// ---------------------------------------------------------
async function nactiNejnovejsiProdukty() {
  const produkty = [];
  
  // Vezmeme poslední 3 ze seznamu
  const posledniSoubory = [...SEZNAM_SOUBORU].reverse().slice(0, 3);

  for (const file of posledniSoubory) {
    try {
      const data = await fetch(`/data/productos/${file}`).then(r => r.ok ? r.json() : null);
      if (data) {
        if (!data.slug) data.slug = file.replace(".json", "");
        produkty.push(data);
      }
    } catch (e) { }
  }

  const cont = document.getElementById("nove-produkty");
  if (!cont) return;
  cont.innerHTML = "";

  produkty.forEach(p => {
    const detailUrl = `/producto.html?slug=${p.slug}`;
    const shortText = dejCistyText(p.descripcion, 160);

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="produkt-img" onclick="window.location.href='${detailUrl}'">
        <h2 class="produkt-nazev">${p.nombre}</h2>
        <h1 class="produkt-cena">${p.precio}</h1>
        <div class="produkt-popis">${shortText}...</div>
        <button class="produkt-btn" onclick="window.location.href='contacto.html'">ORDENAR</button>
        <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">DETALLES</button>
      </div>`;
  });
}

// Pomocná funkce pro vyčištění HTML značek z popisu
function dejCistyText(html, delka) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return text.substring(0, delka);
}
