<script>
async function nactiProdukty(kategorie) {
  // 1) načteme seznam souborů z GitHub API
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  // 2) vyfiltrujeme jen .json soubory
  const jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name);

  const produkty = [];

  // 3) načteme každý JSON soubor přímo z webu
  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());
    if (data.categoria === kategorie) produkty.push(data);
  }

  // 4) vykreslení
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
