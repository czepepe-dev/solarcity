// ---------------------------------------------------------
// NAČTENÍ PRODUKTŮ PRO KONKRÉTNÍ KATEGORII
// ---------------------------------------------------------
async function nactiProdukty(kategorie) {
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  let jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name)
    .reverse();

  const produkty = [];

  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());

    if (!data.slug) {
      data.slug = data.nombre
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    if (data.categoria === kategorie) produkty.push(data);
  }

  const cont = document.getElementById("produkty");
  cont.innerHTML = "";

  produkty.forEach(p => {

    const detailUrl = `/producto.html?slug=${p.slug}`;

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="produkt-img" data-url="${detailUrl}">

        <h2 class="produkt-nazev">${p.nombre}</h2>
        <h1 class="produkt-cena">${p.precio}</h1>
        <div class="produkt-popis">${p.descripcion}</div>

        <button class="produkt-btn" onclick="window.location.href='contacto.html'">
          ORDENAR
        </button>

        <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">
          Más información
        </button>
      </div>
    `;
  });

  // Klik na obrázek -> detail produktu
  document.querySelectorAll(".produkt-img").forEach(img => {
    img.addEventListener("click", function() {
      window.location.href = this.dataset.url;
    });
  });
}


// ---------------------------------------------------------
// NAČTENÍ 3 NEJNOVĚJŠÍCH PRODUKTŮ NA INDEXU
// ---------------------------------------------------------
async function nactiNoveProdukty() {
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  let jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name)
    .reverse();

  const produkty = [];

  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());

    if (!data.slug) {
      data.slug = data.nombre
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    produkty.push(data);
  }

  const nove = produkty.slice(0, 3);

  const cont = document.getElementById("nove-produkty");
  cont.innerHTML = "";

  nove.forEach(p => {

    const detailUrl = `/producto.html?slug=${p.slug}`;

    cont.innerHTML += `
      <div class="produkt-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="produkt-img" data-url="${detailUrl}">

        <h2 class="produkt-nazev">${p.nombre}</h2>
        <div class="produkt-cena">${p.precio}</div>
        <div class="produkt-popis">${p.descripcion}</div>

        <button class="produkt-btn" onclick="window.location.href='contacto.html'">
          ORDENAR
        </button>

        <button class="produkt-info-btn" onclick="window.location.href='${detailUrl}'">
          Más información
        </button>
      </div>
    `;
  });

  // Klik na obrázek -> detail produktu
  document.querySelectorAll(".produkt-img").forEach(img => {
    img.addEventListener("click", function() {
      window.location.href = this.dataset.url;
    });
  });
}
