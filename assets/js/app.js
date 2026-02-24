async function nactiProdukty() {
    // Najdeme jakýkoliv kontejner, který na webu používáš
    const container = document.getElementById('nove-produkty') || 
                      document.getElementById('productos-grid') || 
                      document.querySelector('.produkty-grid');

    if (!container) return;

    try {
        // 1. Získání seznamu souborů
        const response = await fetch(`https://api.github.com/repos/czepepe-dev/solarcity/contents/data/productos?t=${Date.now()}`);
        const files = await response.json();
        
        // 2. Načtení dat všech JSONů
        const produktyData = await Promise.all(
            files.filter(f => f.name.endsWith('.json')).map(async (f) => {
                try {
                    const res = await fetch(`/data/productos/${f.name}?t=${Date.now()}`);
                    const json = await res.json();
                    return { ...json, slug: f.name.replace('.json', ''), sortId: parseInt(json.id) || 0 };
                } catch (e) { return null; }
            })
        );

        let produkty = produktyData.filter(p => p !== null);

        // 3. Automatický filtr pro kategorie (podle názvu stránky)
        const path = window.location.pathname.toLowerCase();
        if (path.includes('powerbanks')) produkty = produkty.filter(p => p.categoria === 'Powerbanks');
        if (path.includes('paneles')) produkty = produkty.filter(p => p.categoria === 'Paneles');
        if (path.includes('luces')) produkty = produkty.filter(p => p.categoria === 'Luces');

        // 4. SEŘAZENÍ: Nejnovější (nejvyšší ID) první
        produkty.sort((a, b) => b.sortId - a.sortId);

        // 5. Vykreslení - používám TVOJI původní HTML strukturu
        container.innerHTML = produkty.map(p => `
            <div class="produkt-card">
                <div class="produkt-image-container">
                    <img src="${p.imagen}" alt="${p.nombre}" onclick="window.location.href='producto.html?slug=${p.slug}'" style="cursor:pointer;">
                </div>
                <h3 class="produkt-nazev">${p.nombre}</h3>
                <p class="produkt-cena">${p.precio}</p>
                <div class="produkt-buttons">
                    <a href="producto.html?slug=${p.slug}" class="produkt-info-btn">DETALLE</a>
                    <a href="contacto.html" class="produkt-btn">ORDENAR</a>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error("Chyba při načítání:", err);
    }
}

// Spustit hned po načtení
document.addEventListener('DOMContentLoaded', nactiProdukty);

// Funkce pro přepínání témat
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const themeStyle = document.getElementById('theme-style');
    if (themeBtn && themeStyle) {
        themeBtn.addEventListener('click', () => {
            const isDay = themeStyle.getAttribute('href').includes('day');
            themeStyle.setAttribute('href', isDay ? 'assets/css/style-night.css' : 'assets/css/style-day.css');
            themeBtn.textContent = isDay ? 'Día' : 'Noche';
        });
    }
});
