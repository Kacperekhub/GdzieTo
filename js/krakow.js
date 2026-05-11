let warstwaKrakow = L.layerGroup().addTo(map);

async function pobierzKrakow() {
    // Próbujemy przez corsproxy.io, ale z dodatkowym parametrem cache-breaker
    const urlKrakow = 'https://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles';
    const url = `https://corsproxy.io/?${encodeURIComponent(urlKrakow)}&cb=${Date.now()}`;

    try {
        const odpowiedz = await fetch(url);
        
        // ZABEZPIECZENIE: Sprawdzamy czy to na pewno JSON
        const contentType = odpowiedz.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.warn("Serwer Krakowa wysłał HTML zamiast danych. Próba za 10s...");
            return;
        }

        const dane = await odpowiedz.json();

        if (dane && dane.vehicles) {
            warstwaKrakow.clearLayers();
            dane.vehicles.forEach(pojazd => {
                const lat = pojazd.latitude / 3600000;
                const lon = pojazd.longitude / 3600000;
                if (lat && lon && !pojazd.isDeleted) {
                    L.circleMarker([lat, lon], {
                        radius: 6,
                        fillColor: "#0055a7",
                        color: "#fff",
                        weight: 2,
                        fillOpacity: 0.9
                    }).addTo(warstwaKrakow).bindPopup(`Tramwaj: ${pojazd.line}`);
                }
            });
            console.log("Kraków działa na GH Pages!");
        }
    } catch (blad) {
        console.error("Błąd Krakowa:", blad);
    }
}
pobierzKrakow();
setInterval(pobierzKrakow, 15000);
