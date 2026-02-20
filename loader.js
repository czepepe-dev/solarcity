async function nactiProdukty(kategorie) {
  const apiUrl = "https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos";
  const files = await fetch(apiUrl).then(r => r.json());

  const jsonFiles = files
    .filter(f => f.name.endsWith(".json"))
    .map(f => f.name);

  const produkty = [];

  for (const file of jsonFiles) {
    const data = await fetch(`/data/productos/${file}`).then(r => r.json());
    if (data.categoria === kategorie) produkty.push(data);
  }

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
