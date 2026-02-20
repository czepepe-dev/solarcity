async function cargarDatos() {
  const res = await fetch('data/productos.json');
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

// Kategorie
if (window.location.pathname.endsWith('categoria.html')) {
  (async () => {
    const cat = getParam('cat');
    const datos = await cargarDatos();
    const lista = datos[cat] || [];
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

// Produkt
if (window.location.pathname.endsWith('producto.html')) {
  (async () => {
    const cat = getParam('cat');
    const id = getParam('id');
    const datos = await cargarDatos();
    const lista = datos[cat] || [];
    const prod = lista.find(p => p.id === id);
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
        ${prod.galeria.map(src => `<img src="${src}" alt="${prod.nombre}">`).join('')}
      </div>
      <a href="categoria.html?cat=${cat}" class="btn-volver">Volver a la categoría</a>
    `;
  })();
}
// Přepínání DEN / NOC (Día / Noche)
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

