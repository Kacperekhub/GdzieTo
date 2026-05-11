const map = L.map('map', { zoomControl: false }).setView([52.23, 21.01], 6);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(map);

// Grupy warstw, żeby inne pliki mogły do nich wrzucać dane
let warstwaSamolotow = L.layerGroup().addTo(map);
let warstwaAutobusow = L.layerGroup().addTo(map);
let warstwaKrakow = L.layerGroup().addTo(map);

// Obsługa menu (też tu pasuje)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

