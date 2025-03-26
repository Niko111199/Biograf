//_________________________________________________________ Skrevet af Nikolaj Bræmer______________________________________________________________________________________

//script der henter filmene fra sendeplanen der er oprretter i planlægfilm.js og til at hente information ind omkring filmen for at fremvise
//  det på den givende films side
// informationen bliver hentet ind fra json filen og læst ind på siden

//event sørger for koden bliver kørt når alt er læst ind
document.addEventListener("DOMContentLoaded", function () {
    const sendePlan = 'cinemaSchedule'; //nøgle til localstorage
    const params = new URLSearchParams(window.location.search); //henter filmens id ind fra URl
    const movieId = params.get('id');

    //henter oplysninger fra json filen
    fetch('scripts/movies.json')
        .then(response => response.json())
        .then(data => { //sammenligner id med filmen
            const movie = data.movies.find(m => m.id === movieId);
            if (movie) { // når filemen er fundet indlæser vi tingene fra json filen på siden
                displayMovieDetails(movie); 
                loadSchedule(movieId); //og læser den givenden films sende plan ind
                document.title = movie.title; //sætter titlen på film siden til at hedde det samme som den valte film
            } else {
                document.getElementById('movie-details').innerHTML = "<p>Ingen film valgt.</p>";
                //denne besked ville komme op vis nogen går ind på film siden uden at havde klickede ind igennem en film, da den ikke
                // ville havde noget id at sammenligne filmen med.
            }
        });

    function displayMovieDetails(movie) {
        const details = document.getElementById('movie-details'); //finder for oplysninger skal skrives ind på filmsiden
        const embedTrailer = movie.trailer.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/"); //omformatere youtube linkede så det kan embedes
        details.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" id="plakat">
            <h1 id="Titel">${movie.title}</h1>
            <h2 id="katagori">${movie.category}</h2>
            <h2 id="aldersgrænse">${movie.aldersgrænse}</h2>
            <h3 id="længde">${movie.varighed}</h3>
            <iframe id="trailer" src="${embedTrailer}" frameborder="0" allowfullscreen></iframe>
            <p id="beskrivelse">${movie.description}</p>
            <h2 id="medvirkende">Medvirkende</h2>
            <p id="skuspillere">${movie.skuespillere.join(", ")}</p>
            <div id="schedule-container"></div>
        `;//næst sidste linje løser således at skuespillerens navne bliver fremvist med mellemrum imellem dem
          // sidste linje er der hvor sendeplanen bliver læst ind
    }

    //metode til at hende sendeplanen ind baseret på filmens id
    function loadSchedule(movieId) { 
        let schedule = JSON.parse(localStorage.getItem(sendePlan)); //henter sendeplanen ind fra localstorrage, vis brugeren er gået til filmen side,
        //uden om startsiden, vil der ikke vare nogen sende plan da den laves på index siden, og såfremt vil ingen film tidspunkter være hentet
        let filteredSchedule = schedule.filter(s => s.movieId === movieId); //sørger for at finde de realvante tidspunkter for den givneden film
        
        const currentDateTime= new Date()
        

        const scheduleContainer = document.getElementById("schedule-container");//henter placering for hvor listen skal være
        if (filteredSchedule.length === 0) {
            scheduleContainer.innerHTML = "<p>Ingen visninger planlagt.</p>";
            return;
        } //vis der ikke er nogen sendetidspunkter for filmen køres dette, dette burde dog ikke ske

        let scheduleHtml = `<h3>Visninger:</h3><ul>`; //opretter html ellementerne som bruger kan se og interegere med
        filteredSchedule.forEach(s => { //for hvert tidspunkt i sendeplanen oprettes der en knap 
            scheduleHtml += `<li>
                <button onclick="bookTicket('${s.movieId}', '${s.sal}', '${s.date}', '${s.time}')">
                    Køb billet til Sal ${s.sal}, ${s.date} kl. ${s.time}
                </button>
            </li>`;
        });
        scheduleHtml += `</ul>`;
        scheduleContainer.innerHTML = scheduleHtml;
    }
});

//kode for hvad der sker når man tyrkker på knappen
function bookTicket(movieId, sal, date, time) {
    fetch('scripts/movies.json') // Henter filmdata
        .then(response => response.json())
        .then(data => {
            const movie = data.movies.find(m => m.id === movieId); // Finder filmen baseret på id
            if (movie) {
                const movieTitle = movie.title; // Bruger filmens titel i stedet for id for at få det til at se rigtigt ud for brugeren
                const bestilplads = `vælgplads.html?movie=${encodeURIComponent(movieTitle)}&sal=${encodeURIComponent(sal)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`;
                //skriver oplysninger om filmen ind i url således at vi kan hente oplysningerne ned i vores kurv senere
                window.location.href = bestilplads; // Navigerer til siden
            } else {
                alert("Film ikke fundet.");
            }
        });
}

