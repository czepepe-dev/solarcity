async function nactiProdukty(kategorie) {
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  let jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name)
    .reverse(); // nejnovější nahoře

  const produkty = [];

  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());
    if (data.categoria === kategorie) produkty.push(data);
  }

  const cont = document.getElementById("produkty");
  cont.innerHTML = "";

  produkty.forEach(p => {
    const shortDesc = p.descripcion.length > 40
      ? p.descripcion.substring(0, 40) + "... más info"
      : p.descripcion;

    const detailUrl = `/producto.html?id=${p.id}`;

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='${detailUrl}'">

        <div class="produkt-nazev">${p.nombre}</div>
        <div class="produkt-cena">${p.precio}</div>
        <div class="produkt-popis">${shortDesc}</div>

        <button class="produkt-btn" onclick="window.location.href='/contact'">
          ORDENAR
        </button>

        <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">
          Más información
        </button>
      </div>
    `;
  });
}
