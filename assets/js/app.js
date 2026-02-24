async function cargarDatos() {
  const res = await fetch('data/productos.json?t=' + Date.now());
  return await res.json();
}

function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

const nombresCategorias = {
  paneles: 'Paneles Solares',
  powerbanks: 'Powerbanks Solares',
  luces: 'Luces Solares',
  sistemas: 'Sistemas Solares'
};

// 🔹 univerzální řazení od nejnovějšího podle ID
function ordenarPorNuevo(lista) {
  return lista.slice().sort((a, b) => Number(b.id) - Number(a.id));
}


// ==========================
// INDEX – NOVÉ PRODUKTY
// ==========================
async function nactiNoveProdukty() {
  const cont = document.getElementById('nove-produkty');
  if (!cont) return;

  const datos = await cargarDatos();

  let vsechny = [];

  Object.keys(datos).forEach(cat => {
    vsechny = vsechny.concat(
      (datos[cat] || []).map(p => ({ ...p, cat }))
    );
  });

  vsechny = ordenarPorNuevo(vsechny);

  const tri = vsechny.slice(0, 3);

  cont.innerHTML = tri.map(p => `
    <a class="card" href="producto.html?id=${p.id}&cat=${p.cat}">
      <h3>${p.nombre}</h3>
      <p>${p.precio}</p>
    </a>
  `).join('');
}


// ==========================
// KATEGORIE
// ==========================
if (window.location.pathname.endsWith('categoria.html')) {
  (async () => {
    const cat = getParam('cat');
    const datos = await cargarDatos();

    let lista = datos[cat] || [];
    lista = ordenarPorNuevo(lista);

    const titulo = document.getElementById('titulo-categoria');
    const cont = document.getElementById('lista-productos');

    titulo.textContent = nombresCategorias[cat] || 'Productos';

    cont.innerHTML = lista.map(p => `
      <a class="card" href="producto.html?id=${p.id}&cat=${cat}">
        <h3>${p.nombre}</h3>
        <p>${p.precio}</p>
      </a>
    `).join('');
  })();
}


// ==========================
// PRODUKT
// ==========================
if (window.location.pathname.endsWith('producto.html')) {
  (async () => {
    const cat = getParam('cat');
    const id = getParam('id');
    const datos = await cargarDatos();

    const lista = datos[cat] || [];
    const prod = lista.find(p => String(p.id) === String(id));
    const cont = document.getElementById('detalle-producto');

    if (!prod) {
      cont.innerHTML = '<p>Producto no encontrado.</p>';
      return;
    }

    cont.innerHTML = `
      <h1>${prod.nombre}</h1>
      <p class="precio">${prod.precio}</p>
      <img src="${prod.imagen}" alt="${prod.nombre}" class="img-principal">
      <p>${prod.descripcion}</p>
      <div class="galeria">
        ${(prod.galeria || []).map(src => `<img src="${src}" alt="${prod.nombre}">`).join('')}
      </div>
      <a href="categoria.html?cat=${cat}" class="btn-volver">Volver a la categoría</a>
    `;
  })();
}


// ==========================
// DEN / NOC
// ==========================
const btn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');

if (btn) {
  btn.addEventListener('click', () => {
    if (themeLink.getAttribute('href').includes('day')) {
      themeLink.setAttribute('href', 'assets/css/style-night.css');
      btn.textContent = 'Día';
    } else {
      themeLink.setAttribute('href', 'assets/css/style-day.css');
      btn.textContent = 'Noche';
    }
  });
}
