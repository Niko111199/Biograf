//script til startsiden til at fremvise udvalget af film samt til at man kan søge efter en specefik film

//event for at sørge at når man søger eller filtrer så bliver siden opdateret med det samme
document.addEventListener("DOMContentLoaded", function () {
    let moviesData = []; 

   //henter oplysningeren om filmen fra json filne og indsætter det i vores funktioner
    fetch('scripts/movies.json')
        .then(response => response.json())
        .then(data => {
            moviesData = data.movies;
            populateCategoryFilter(moviesData); 
            renderMovies(moviesData); 
        });

     //metode til at fremvise "render" filmene i listen,
    function renderMovies(movies) {
        const movieList = document.getElementById('movie-list'); // finder hvor på siden filmene skal læses ind
        movieList.innerHTML = '';  //sørger for der ikke er noget før filmene bliver læst ind

        movies.forEach(movie => { //går igenem alle film og for hver film så laver vi en div,
            const movieItem = document.createElement('div'); 
            movieItem.classList.add('movie'); //  som vi giver klassen movie
            movieItem.innerHTML = `
                <a href="film.html?id=${movie.id}">
                    <img src="${movie.image}" alt="${movie.title}">
                </a>  
            `; // i diven opretter vi et hyperlink hvor i at filmen id bliver skrevet ind i
            //for at kunn blive læst på film siden, samt henter billedet ind af filmen som fungere som knap
            movieList.appendChild(movieItem);
            // og tilsidst tilføjer vi filmene til listen af film, så vi til sidst har en genrede liste af filmene
        });
    }

    //funktion til dynamisk at hente film katagorier ind fra json filen og tilføje til en dropdown menu
    function populateCategoryFilter(movies) {
        const categoryFilter = document.getElementById('categoryFilter'); //finder hvor filteret skal placeres
        const categories = [...new Set(movies.map(movie => movie.category))]; // laver et array af unikke katagorier, new set sørger for at der ikke er flere af samme katagori

        categoryFilter.innerHTML = `<option value="">Alle kategorier</option>`; //sætter vorres dropdown til som minimum at havde en katakegori der viser alle film

        categories.forEach(category => { //går igenem all katagoriieren
            const option = document.createElement('option'); //oprreter en valgmulighed i dropdown
            option.value = category; //sætter værdigen i dropdown muligheden til at være katagorien
            option.textContent = category; //sætter teksten bruger kan læse til at være katagorien
            categoryFilter.appendChild(option); //tilføjer vores option til catagory filteret
        });
    }

    //metode til at bruger kan søge efter specefille film 
    function filterMovies() {
        const searchmethod = document.getElementById('searchInput').value.toLowerCase(); //henter skreven tekst ind fra bruger, samt søger for at der ikke bliver taget
        //højde for store og små bogstaver
        const selectedCategory = document.getElementById('categoryFilter').value; //henter oplysninger om eventuelt valgt katagori

        const filteredMovies = moviesData.filter(movie =>
            (movie.title.toLowerCase().includes(searchmethod) || //sammenligner og nogen af filmene har samme navn som det der er skrevet i søgefeltet
            movie.skuespillere.some(actor => actor.toLowerCase().includes(searchmethod))) && //sammenligner om der er nogen skuespillere som heder det som søges efter
            (selectedCategory === "" || movie.category === selectedCategory) //sørger for at vis der er sat en katagori den også kun viser film inden for katagorien
            // af hvad der er søgt efter
        );

        renderMovies(filteredMovies); 
    }

    
    document.getElementById('searchInput').addEventListener('input', filterMovies);
    document.getElementById('categoryFilter').addEventListener('change', filterMovies);
});

//metode for at lave en pæn scroll igenem filmene
function scrollMovies(offset) {
    const movieList = document.getElementById('movie-list');
    movieList.scrollBy({ left: offset, behavior: 'smooth' });
}
