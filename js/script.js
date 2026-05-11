// 1. Mapa
const map = L.map('map', { zoomControl: false }).setView([52.23, 21.01], 6);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap' }).addTo(map);

// 2. Grupa dla samolotów (KLUCZOWE!)
let warstwaSamolotow = L.layerGroup().addTo(map);

// 3. Obsługa menu
const buttons = document.querySelectorAll('.filter-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// 4. Pobieranie danych
async function pobierzSamoloty() {
    const staryUrl = 'https://opensky-network.org/api/states/all?lamin=49.0&lomin=14.1&lamax=54.9&lomax=24.1';
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(staryUrl)}`;

    try {
        const odpowiedz = await fetch(url);
        const interfejsProxy = await odpowiedz.json();
        const dane = JSON.parse(interfejsProxy.contents);

        if (dane && dane.states) {
            warstwaSamolotow.clearLayers(); // Czyścimy stare

            dane.states.forEach(samolot => {
                const lat = samolot[6];
                const lon = samolot[5];
                const callsign = samolot[1]?.trim() || "Brak";
                const kurs = samolot[10] || 0;

                if (lat && lon) {
                    const ikonaSamolotu = L.divIcon({
                        className: 'plane-icon',
                        html: `<div style="transform: rotate(${kurs}deg)">
                                <svg width="25" height="25" viewBox="0 0 24 24">
                                    <path d="M21,16L21,14L13,9L13,3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5L10,9L2,14L2,16L10,13.5L10,18L8,19.5L8,21L11.5,20L15,21L15,19.5L13,18L13,13.5L21,16Z" fill="#ffce00"/>
                                </svg>
                               </div>`,
                        iconSize: [25, 25],
                        iconAnchor: [12, 12]
                    });

                    L.marker([lat, lon], { icon: ikonaSamolotu }).addTo(warstwaSamolotow)
                        .bindPopup(`<b>Lot: ${callsign}</b><br>Kurs: ${kurs}°`);
                }
            });
        }
    } catch (blad) {
        console.error("Błąd:", blad);
    }
}

// Start
pobierzSamoloty();
setInterval(pobierzSamoloty, 30000);