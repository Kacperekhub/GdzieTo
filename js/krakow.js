async function pobierzKrakow() {
    const urlKrakow = 'https://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles';
    // Zmieniamy na inne proxy: cors-anywhere (przez bridge) lub corsproxy.io
    const url = `https://corsproxy.io/?${encodeURIComponent(urlKrakow)}`;

    try {
        console.log("Pobieram Kraków...");
        const odpowiedz = await fetch(url);
        
        // Sprawdzamy czy odpowiedź to na pewno JSON
        const tekst = await odpowiedz.text();
        if (tekst.trim().startsWith("<")) {
            console.warn("Kraków: Odebrano HTML zamiast JSON (Proxy zajęte). Pomijam...");
            return;
        }

        const dane = JSON.parse(tekst);

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
            console.log("Kraków zaktualizowany!");
        }
    } catch (blad) {
        console.error("Błąd Krakowa:", blad);
    }
}
pobierzKrakow();
setInterval(pobierzKrakow, 20000);
