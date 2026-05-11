async function pobierzSamoloty() {
    // VATSIM zazwyczaj nie wymaga proxy, ale AllOrigins pomoże nam ominąć CORS na GitHubie
    const url = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://data.vatsim.net/v3/vatsim-data.json');

    try {
        console.log("Próba pobrania danych VATSIM...");
        const odpowiedz = await fetch(url);
        const json = await odpowiedz.json();
        const dane = JSON.parse(json.contents);

        if (dane && dane.pilots) {
            warstwaSamolotow.clearLayers();
            
            // Filtrujemy samoloty, które są w okolicach Polski
            const polskieLoty = dane.pilots.filter(p => 
                p.latitude > 49 && p.latitude < 55 && 
                p.longitude > 14 && p.longitude < 24
            );

            polskieLoty.forEach(samolot => {
                const ikonaVATSIM = L.divIcon({
                    className: 'plane-icon',
                    html: `<div style="transform: rotate(${samolot.heading || 0}deg)">
                            <svg width="25" height="25" viewBox="0 0 24 24">
                                <path d="M21,16L21,14L13,9L13,3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5L10,9L2,14L2,16L10,13.5L10,18L8,19.5L8,21L11.5,20L15,21L15,19.5L13,18L13,13.5L21,16Z" fill="#00ff00"/>
                            </svg>
                           </div>`,
                    iconSize: [25, 25],
                    iconAnchor: [12, 12]
                });

                L.marker([samolot.latitude, samolot.longitude], { icon: ikonaVATSIM })
                    .addTo(warstwaSamolotow)
                    .bindPopup(`<b>VATSIM: ${samolot.callsign}</b><br>Model: ${samolot.flight_plan?.aircraft || 'Nieznany'}`);
            });
            
            console.log(`Sukces! Znaleziono ${polskieLoty.length} lotów VATSIM.`);
        }
    } catch (e) {
        console.error("Błąd VATSIM:", e);
    }
}

pobierzSamoloty();
setInterval(pobierzSamoloty, 45000); // Odświeżanie co 45 sekund
