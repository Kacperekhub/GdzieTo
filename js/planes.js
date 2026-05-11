async function pobierzSamoloty() {
    const apiSamoloty = 'https://opensky-network.org/api/states/all?lamin=49.0&lomin=14.1&lamax=54.9&lomax=24.1';
    const url = `https://corsproxy.io/?${encodeURIComponent(apiSamoloty)}`;

    try {
        console.log("Pobieram dane o lotach...");
        const odpowiedz = await fetch(url);
        const tekst = await odpowiedz.text();

        if (tekst.trim().startsWith("<")) {
            console.warn("Samoloty: Proxy zwróciło HTML zamiast danych.");
            return;
        }

        const dane = JSON.parse(tekst);
        if (dane && dane.states) {
            warstwaSamolotow.clearLayers();
            dane.states.forEach(samolot => {
                const lat = samolot[6];
                const lon = samolot[5];
                const kurs = samolot[10] || 0;
                const lot = samolot[1]?.trim() || "???";

                if (lat && lon) {
                    L.marker([lat, lon], {
                        icon: L.divIcon({
                            className: 'plane-icon',
                            html: `<div style="transform: rotate(${kurs}deg)"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M21,16L21,14L13,9L13,3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5L10,9L2,14L2,16L10,13.5L10,18L8,19.5L8,21L11.5,20L15,21L15,19.5L13,18L13,13.5L21,16Z" fill="#ffce00"/></svg></div>`,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                        })
                    }).addTo(warstwaSamolotow).bindPopup(`Lot: ${lot}`);
                }
            });
            console.log("Samoloty zaktualizowane!");
        }
    } catch (e) {
        console.warn("Samoloty: Brak dostępu do danych (CORS/Proxy).");
    }
}

pobierzSamoloty();
setInterval(pobierzSamoloty, 60000);
