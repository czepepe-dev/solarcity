<script>
async function nactiProdukty(kategorie) {
  const response = await fetch('/data/productos');
  const text = await response.text();

  const parser = new DOMParser();
  const html = parser.parseFromString(text, "text/html");
  const links = [...html.querySelectorAll("a")];

  const jsonFiles = links
    .map(a => a.getAttribute("href"))
    .filter(h => h.endsWith(".json"));

  const produkty = [];

  for (const file of jsonFiles) {
    const res = await fetch(`/data/productos/${file}`);
    const data = await res.json();
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
</script>
