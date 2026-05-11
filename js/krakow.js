let warstwaKrakow = L.layerGroup().addTo(map);

async function pobierzKrakow() {
    // Używamy AllOrigins jako HTTPS proxy, żeby GitHub nie blokował zapytania
    const urlKrakow = 'https://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles';
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(urlKrakow)}`;

    try {
        console.log("Łączę z Krakowem przez AllOrigins...");
        const odpowiedz = await fetch(url);
        const interfejsProxy = await odpowiedz.json();
        
        // AllOrigins zwraca dane w polu .contents jako tekst, musimy to sparsować
        const dane = JSON.parse(interfejsProxy.contents);

        if (dane && dane.vehicles) {
            warstwaKrakow.clearLayers();
            dane.vehicles.forEach(pojazd => {
                const lat = pojazd.latitude / 3600000;
                const lon = pojazd.longitude / 3600000;
                const linia = pojazd.line;

                if (lat && lon && !pojazd.isDeleted) {
                    L.circleMarker([lat, lon], {
                        radius: 6,
                        fillColor: "#0055a7",
                        color: "#fff",
                        weight: 2,
                        fillOpacity: 0.9
                    }).addTo(warstwaKrakow).bindPopup(`<b>Tramwaj linii: ${linia}</b>`);
                }
            });
            console.log("Kraków działa! Pojazdów: " + dane.vehicles.length);
        }
    } catch (blad) {
        console.error("Błąd Krakowa:", blad);
    }
}

pobierzKrakow();
setInterval(pobierzKrakow, 20000);
