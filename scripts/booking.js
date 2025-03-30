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

    const snackInput = document.getElementById("snackbilleter"); //henter mængde af snacks fra input fælt
    const snackPris = 65; // Pris per snackbillet

    // Hent tidligere gemt snack-mængde fra localStorage
    let savedSnackAmount = sessionStorage.getItem("snackbilleter");
    snackInput.value = savedSnackAmount !== null ? savedSnackAmount : 0; // Standard 0

       // Funktion til at generere et kort af pladser som brugerne kan vælge den blads de vil side på
    generateSeatMap();

    function generateSeatMap() {
        seatMapContainer.innerHTML = "";  // sørger for der ikke er noget andet i containeren
        
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
        selectedSeats.sort((a, b) => a - b); 
        info.textContent = `Valgte sæder: ${selectedSeats.join(", ")}`;

        Calculateprice(); 
    }

    //funktion til at udregne en pris for biograf turen
    function Calculateprice() {
        let normalprice = 75; //pris per sæde
        let samletprice = selectedSeats.length * normalprice; //samlet pris for alle valgte pladser
        
        // Tjek hvilken rabat der skal anvendes
        let rabat = 0;
        const selectedTicketType = document.querySelector('input[name="titckettype"]:checked');
    
        if (selectedTicketType) { 
            if (selectedTicketType.value === "Student") {
                rabat = 0.10;  // 10% rabat for studerende
            } else if (selectedTicketType.value === "Pasioninst") {
                rabat = 0.15; // 15% rabat for pensionister
            }
        }

        samletprice = samletprice * (1 - rabat);//regner rabaten

        // Hent snackmængde fra inputfeltet
        let snackAmount = parseInt(snackInput.value) || 0;
        let snackTotal = snackAmount * snackPris;

        let totalPris = samletprice + snackTotal; //pris for slik bliver ikke påvirket af rabat, fast pris

        // Opdater prisvisning
        const setprice = document.getElementById("price");
        if (setprice) {
            setprice.textContent = `Samlet pris: ${totalPris.toFixed(2)} kr`; // viser prisen med 2 disimaler
        }
    }
        // Sørg for at prisen opdateres, når billet-type vælges 
    document.querySelectorAll('input[name="titckettype"]').forEach(radio => {
        radio.addEventListener("change", function () {
            localStorage.setItem("selectedTicketType", this.value); //gemmere valgte rabat i localstorage
            Calculateprice();
        });
    });

    //gemmer valget at snackbillter i en session, så vis brugeren lukker siden så er snacks ikke gemt, men
    //billeter er, i tilfælde at andet ønske om snacks, efter længere overvejelse om at se filmen
    snackInput.addEventListener("input", function () {
        sessionStorage.setItem("snackbilleter", snackInput.value);
        Calculateprice();
    });

    //sørger for at valgte bilettype bliver hentet ved genindlæsning af siden
    let savedtickettype = localStorage.getItem("selectedTicketType");

    if (savedtickettype) {
        let savedRadio = document.querySelector(`input[value="${savedtickettype}"]`);
        if (savedRadio) {
            savedRadio.checked = true; // Marker den gemte billet-type
        }
    }

    //metode til at skrive information i en alert ved tryk af bestil
    document.getElementById("order-button").addEventListener("click", function () { // henter alle informationer
        const movie = document.getElementById("selected-movie").textContent;
        const sal = document.getElementById("selected-sal").textContent;
        const date = document.getElementById("selected-date").textContent;
        const time = document.getElementById("selected-time").textContent;
        const seats = selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ingen pladser valgt, vælg venligtst en plads";
        const totalPrice = document.getElementById("price").textContent;
    
        alert(`Du har bestilt:\n\nFilm: ${movie}\nSal: ${sal}\nDato: ${date}\nTid: ${time}\nPladser: ${seats}\n\nSamlet pris: ${totalPrice}`); // skriver tekst i alert
    });

    Calculateprice(); // Opdater pris ved load
});
