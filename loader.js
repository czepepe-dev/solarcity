<script>
async function nactiProdukty(kategorie) {
  // načteme seznam souborů
  const seznam = await fetch("/data/productos/index.json").then(r => r.json());

  const produkty = [];

  // načteme každý produkt
  for (const file of seznam) {
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
