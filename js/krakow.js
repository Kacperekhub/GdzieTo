let warstwaKrakow = L.layerGroup().addTo(map);

async function pobierzKrakow() {
    // UDERZAMY BEZPOŚREDNIO (skoro masz rozszerzenie Allow CORS)
    const url = 'https://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles';

    try {
        console.log("Próba bezpośredniego połączenia z Krakowem...");
        const odpowiedz = await fetch(url);
        
        // Sprawdzamy czy odpowiedź jest OK (status 200)
        if (!odpowiedz.ok) {
            throw new Error(`Błąd serwera: ${odpowiedz.status}`);
        }

        const dane = await odpowiedz.json();

        if (dane && dane.vehicles) {
            warstwaKrakow.clearLayers();

            dane.vehicles.forEach(pojazd => {
                // Konwersja współrzędnych TTSS na standardowe
                const lat = pojazd.latitude / 3600000;
                const lon = pojazd.longitude / 3600000;
                const linia = pojazd.line;

                if (lat && lon && !pojazd.isDeleted) {
                    L.circleMarker([lat, lon], {
                        radius: 6,
                        fillColor: "#0055a7", // Niebieski krakowski
                        color: "#fff",
                        weight: 2,
                        fillOpacity: 0.9
                    }).addTo(warstwaKrakow).bindPopup(`<b>Tramwaj linii: ${linia}</b>`);
                }
            });
            console.log("Kraków działa! Tramwajów: " + dane.vehicles.length);
        }
    } catch (blad) {
        console.error("Błąd Krakowa:", blad.message);
        console.log("Upewnij się, że rozszerzenie Allow CORS w Operze GX jest kolorowe (ON)!");
    }
}

pobierzKrakow();
setInterval(pobierzKrakow, 10000);