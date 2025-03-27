//_________________________________________________________ Skrevet af Nikolaj Bræmer_____________________________________________________________________________________


//script til at lave et plads system, hvor bruger dynmasisk kan vælge pladser, samt et kurve system, hvorffra at bruger kan se hvad der er i kurven samt samlet pris

document.addEventListener("DOMContentLoaded", function () {
    // Indlæser kurv-detaljer fra URL 
    const params = new URLSearchParams(window.location.search);
    const movie = params.get("movie");
    const sal = params.get("sal");
    const date = params.get("date");
    const time = params.get("time");

    // Sætter informationerne i kurven
    document.getElementById("selected-movie").textContent = movie;
    document.getElementById("selected-sal").textContent = sal;
    document.getElementById("selected-date").textContent = date;
    document.getElementById("selected-time").textContent = time;

    const seatMapContainer = document.getElementById("seat-map");
    const spefikside = window.location.href; // Unik nøgle baseret på URL, sørger for at pladserne kun bliver gemt for den spefikke film og tid
    let selectedSeats = JSON.parse(localStorage.getItem(spefikside)) || [];

    generateSeatMap();

    // Funktion til at generere et kort af pladser som brugerne kan vælge den blads de vil side på
    function generateSeatMap() {
        seatMapContainer.innerHTML = ""; // sørger for der ikke er noget andet i containeren
        
        for (let i = 1; i <= 64; i++) { // laver pladser fra 1 til 64
            const seat = document.createElement("div");
            seat.classList.add("seat");

            // sørger for at vis pladserne tidlidere er valgt, at man ikke kan bestille dem igen, og havde flere af den samme plads i kurven
            if (selectedSeats.includes(i)) {
                seat.classList.add("selected");
            }

            // Tilføj klik-logik for at vælge sæder
            seat.addEventListener("click", function () {
                if (!seat.classList.contains("selected")) {
                    seat.classList.add("selected");
                    selectedSeats.push(i); //vis pladsen ikke er klikket på, så bliver pladens tilføjet til selected classen, og vil derved lyser grøn
                } else {
                    seat.classList.remove("selected");
                    selectedSeats = selectedSeats.filter(s => s !== i); // vis pladsen allarade er valgt, fjerne vi pladsen fra valgte pladse
                }

                localStorage.setItem(spefikside, JSON.stringify(selectedSeats)); //gemmer de valgte pladser i localstorrage
                updateSelectedSeatsInfo();
            });

            seatMapContainer.appendChild(seat);
        }

        updateSelectedSeatsInfo();
    }

    // Funktion til at opdatere info om valgte pladser i menunen
    function updateSelectedSeatsInfo() {
        const info = document.getElementById("selected-seats");
        selectedSeats.sort((a, b) => a - b); // Sortér sæder i stigende rækkefølge, så det er mere overskuligt for brugeren
        info.textContent = `Valgte sæder: ${selectedSeats.join(", ")}`;
    }
});
