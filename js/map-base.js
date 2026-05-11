// Inicjalizacja mapy - wyśrodkowana na Polskę, żeby było widać i Kraków i Warszawę
const map = L.map('map', { zoomControl: false }).setView([51.9194, 19.1451], 6);

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Ciemna mapa (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    attribution: '© OpenStreetMap' 
}).addTo(map);

// DEKLARACJA WARSTW (Tylko tutaj!)
// Te zmienne są globalne, więc krakow.js i planes.js będą je widzieć
let warstwaSamolotow = L.layerGroup().addTo(map);
let warstwaAutobusow = L.layerGroup().addTo(map);
let warstwaKrakow = L.layerGroup().addTo(map);

// Obsługa przycisków w menu
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const type = btn.getAttribute('data-type');
        console.log("Wybrano filtr:", type);
        // Tutaj w przyszłości dodamy filtrowanie warstw (ukrywanie/pokazywanie)
    });
});
