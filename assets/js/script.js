//$('#moviePLaying1').modal('show')

let film;

function movieCase(poster, name, year, genre) {
    film = document.createElement("DIV");
    let filmData = [poster, name, year, genre];
    filmData.forEach((x, i) => {
        let a;
        x == poster ? a = `<img src="https://image.tmdb.org/t/p/w500${x}">` : a = `<p>${x}</p>`;
        film.innerHTML += a;
        document.getElementById("test1").appendChild(film)
    })
}

fetch('https://api.themoviedb.org/3/movie/550?api_key=a05fba96f4d3bad807d07845d4896afb').then(response => response.json()).then(data => {
    console.log("yay");
    //document.getElementById("test1").innerHTML = 
    movieCase(data.poster_path, data.title, data.release_date, data.genres[0].name)
    console.log(film)
});
