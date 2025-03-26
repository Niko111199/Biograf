document.addEventListener("DOMContentLoaded", function () {
    // Indlæser kurv-detaljer fra URL eller localStorage
    const params = new URLSearchParams(window.location.search);
    const movie = params.get("movie");
    const sal = params.get("sal");
    const date = params.get("date");
    const time = params.get("time");

    document.getElementById("selected-movie").textContent = movie;
    document.getElementById("selected-sal").textContent = sal;
    document.getElementById("selected-date").textContent = date;
    document.getElementById("selected-time").textContent = time;

});
