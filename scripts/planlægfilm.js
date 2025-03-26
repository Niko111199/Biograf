//dynamsisk fremstiller en sendeplan af for filmene, så de ikke manuelt skal indlæses, virker kun til opgaven, da sende tiderne for filmen
//genres tilfældigt for den browser som er inde på den, for at give ilutionen af en faktisk sende plan, lavet sådan for ikke manuelt at skulle
//fordele film, og da vi ikke har kendskab eller kan gøre brug af servere til at havde en sendeplan der er ens for alle.

//event som sørger for at sendeplanen bliver oprettet når start siden bliver læst første gang
document.addEventListener("DOMContentLoaded", function () {
    const sendeplan = 'cinemaSchedule'; //nøgle til localstorage
    const opdateretsendeplan = 'scheduleLastUpdated';

    fetch('scripts/movies.json') //henter oplysninger om filmen ind
        .then(response => response.json())
        .then(data => {
            if (shouldUpdateSchedule()) {
                console.log("Genererer ny tidsplan...");
                let schedule = generateSchedule(data.movies);
                saveSchedule(schedule);
                localStorage.setItem(opdateretsendeplan, Date.now());
            } else {
                console.log("Tidsplanen er stadig gyldig.");
            }
        }); // og køre metoderne, samt gemmer sendeplanen i localstoreage sådan det er de samme tidspunkter en bruger se selv vis han lukker og åbner browseren
            // for at skabe en bedre illusion af at der faktisk er en sendeplan filmene følger

    // metode for at lave ny sendeplan en uge efter at brugeren sidst var på siden, for at siden hele tiden har film i salene
    function shouldUpdateSchedule() {
        const lastUpdated = localStorage.getItem(opdateretsendeplan);
        const enuge = 7 * 24 * 60 * 60 * 1000; //en uge i millisikunder
        return !lastUpdated || (Date.now() - lastUpdated > enuge); // tester for om der er gået enuge fra sideste gang 
    }

    //metode til at lave en dynamsk sendeplan
    function generateSchedule(movies) {
        const sale = [1, 2, 3, 4, 5]; //array med 5 sale
        const startHour = 13; // første film kan først starte kl 13
        const latestStart = 21.5; //sidste film kan senst starte kl 21.30, for at undgå film som går ind i nye, dage og skabe problemeer
        const cleaningTime = 0.5; // for realsime skal der være mindst 30 minutter imellem en film er slut og den næste kan starte
        const maxMoviesPerDay = 4; // hvor mange gange en film maks kan sendes på en dag
        let days = 7;
        let today = new Date();
        let schedule = []; //array til at gemme sendeplanen i
        let movieQueue = [...movies];  //array af alle film som kan tilføjes fra sende planene, som er en spredning/kopi af vores array af film

      
        movieQueue = shuffleArray(movieQueue); //blander arrayet for at give realsime, således at første film ikke altid starter i sal 1 og så videre

        let movieIndex = 0; //holder styr på hvilken film vi er på for at planlægge for

        for (let d = 0; d < days; d++) { //går igenem alle dage i ugen
            let currentDay = new Date(today);
            currentDay.setDate(currentDay.getDate() + d); 

            sale.forEach(hall => { //går igenenme hver sal
                if (movieQueue.length === 0) { //ser om der er nogen film legnet op til at blive sendt
                    movieQueue = shuffleArray([...movies]); //vis ikke er der det fylder vi den op med film som kan sendes
                }

                let movie = movieQueue[movieIndex % movieQueue.length]; 
                movieIndex++; //her vælger vi en film fra listen af film, % sørger for at vi ikke kan overskride listen,
                // så vis vi går over, starter vi forfra, der efter øger vi indexet for at lave sendeplan for
                //næste film

                let durationParts = movie.varighed.match(/\d+/g);//omskriver varigheden fra vores json fra 1 time og 30 min til ["1","30"]
                let duration = parseInt(durationParts[0]) + (parseInt(durationParts[1]) || 0) / 60; //tager den omskrevet varighed og parser
                //om til noget vi kan arbejde med, så det bliver 1,5
                

                let time = startHour; //sætte første visning til kl 13

                for (let i = 0; i < maxMoviesPerDay; i++) { //går igenem 4 gange
                    if (time + duration > latestStart) break; //sørger for at vis filmen ville starter efter kl 21.30, så køres koden ikke

                    let roundedTime = Math.ceil((time + duration + cleaningTime) * 2) / 2; //sørger for at der kun kan være afrunde start tidspunkter, altså hel og halv

                    schedule.push({ //opretter et objekt til sendeplans arrayet
                        movieId: movie.id, //som indholde filmens id
                        sal: hall, //den sal som den vises i
                        date: currentDay.toLocaleDateString('da-DK').split('T')[0], //datoen i et læsbart dansk format(dag før månede)
                        time: `${Math.floor(time)}:${time % 1 ? "30" : "00"}` //sætter et læsbart format af kl filmen starter på
                    }); 

                    time = roundedTime; //sætte starttiden til næste startid
                }
            });
        }

        return schedule;
    }

    //gemmer sendeplanene i en localstorage i et JSON format
    function saveSchedule(schedule) {
        localStorage.setItem(sendeplan, JSON.stringify(schedule));
    }

    //metode for at blande arrayet
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});
