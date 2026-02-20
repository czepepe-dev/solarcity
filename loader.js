async function nactiProdukty(kategorie) {
  // 1) načteme seznam souborů z GitHub API
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  // 2) vyfiltrujeme jen .json soubory
  let jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name);

  // 3) seřadíme podle nejnovějších
  jsonFiles = jsonFiles.reverse();

  const produkty = [];

  // 4) načteme každý JSON soubor přímo z webu
  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());
    if (data.categoria === kategorie) produkty.push(data);
  }

  // 5) vykreslení
  const cont = document.getElementById("produkty");
  cont.innerHTML = "";

  produkty.forEach(p => {
    const shortDesc = p.descripcion.length > 40
      ? p.descripcion.substring(0, 40) + "... más info"
      : p.descripcion;

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}">
        <div class="produkt-nazev">${p.nombre}</div>
        <div class="produkt-cena">${p.precio}</div>
        <div class="produkt-popis">${shortDesc}</div>

        <button class="produkt-btn" onclick="window.location.href='/contact'">
          ORDENAR
        </button>

        <button class="produkt-info-btn" onclick="zobrazDetail('${p.descripcion.replace(/'/g, "\\'")}')">
          Más información
        </button>
      </div>
    `;
  });
}

// Funkce pro zobrazení celého popisu
function zobrazDetail(text) {
  alert(text);
}
