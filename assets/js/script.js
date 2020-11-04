/*  <div class="card" style="width: 11rem" data-toggle="modal" data-target="#moviePLayingCard">
<img class="card-img-top" src="assets/images/download.jpeg" alt="CardImageCap">
<div class="card-body">
    <h3 class="card-title">Card title</h3>
    <div class="d-flex justify-content-between">
        <p class="card-text m-0">Year</p>
        <p class="m-0">Genre</p>
    </div>
</div>
</div>
*/
let film;

function movieCase(poster, name, year, genre) {
    film = `<div class="card" style="width: 11rem" data-toggle="modal" data-target="#moviePLayingCard">`;
    let filmData = [poster, name, year, genre];
    filmData.forEach((x, i) => {
        let a;
        switch (x) {
            
        }
        x == poster ? a = `<img class="card-img-top" src="https://image.tmdb.org/t/p/w500${x}" alt="CardImageCap">` : a = `<p>${x}</p>`;
        film.innerHTML += a;
    })
    film += `</div>`
    document.getElementById("test1").innerHTML = film;
}

fetch('https://api.themoviedb.org/3/movie/550?api_key=a05fba96f4d3bad807d07845d4896afb').then(response => response.json()).then(data => {
    console.log("yay");
    //document.getElementById("test1").innerHTML = 
    movieCase(data.poster_path, data.title, data.release_date, data.genres[0].name)
    console.log(film)
});
