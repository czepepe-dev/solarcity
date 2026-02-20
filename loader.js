<script>
async function nactiProdukty(kategorie) {
  // načteme HTML výpis složky
  const htmlText = await fetch("/data/productos/").then(r => r.text());

  // převedeme HTML na DOM
  const parser = new DOMParser();
  const html = parser.parseFromString(htmlText, "text/html");

  // najdeme všechny odkazy na .json
  const links = [...html.querySelectorAll("a")]
    .map(a => a.getAttribute("href"))
    .filter(h => h.endsWith(".json"));

  const produkty = [];

  // načteme každý JSON soubor
  for (const file of links) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());
    if (data.categoria === kategorie) produkty.push(data);
  }

  // vykreslení
  const cont = document.getElementById("produkty");
  cont.innerHTML = "";

  produkty.forEach(p => {
    cont.innerHTML += `
      <div>
        <img src="${p.imagen}" width="150">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <strong>${p.precio}</strong>
      </div>
    `;
  });
}
</script>
