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


function movieCase(poster, name, year, genre) {
    let film;
    film = `<div class="card moviePlayingCard" style="width: 11rem" data-toggle="modal" data-target="#moviePLayingCard">`;
    film += `<img class="card-img-top" src="https://image.tmdb.org/t/p/w500${poster}" alt="CardImageCap">` 
    film += `<h3 class="card-title h5">${name}</h3>`;
    film += `<div class="d-flex justify-content-between"><p class="card-text m-0">${year}</p>`
    film += `<p class="m-0">${genre}</p>`
    film += `</div></div>`
    return film;
}

let genreList = [];
    
//générer genreList
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US').then(response => response.json()).then(data => {
    data.genres.forEach(x => {
        genreList.push({"id": x.id, "name": x.name})
    });
});

//nommer les genres avec les ids
function genreName(object, id) {
    genreList.forEach(x => {
        if (id == x.id) {
            object.genre_name = x.name;
        }
    })
}

let currentFeatured = [];
function featuredFilms(x, inc) {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1${x == 0 ? "" : `&with_genres=${x}`}`).then(response => response.json()).then(data => {
        console.log(x, inc);
        for (let i = (inc * 6 + 1); i < (inc * 6 + 7); i++) {
            if (data.results[i] != undefined) {
                currentFeatured.push({
                    "id" : data.results[i].id,
                    "poster" : data.results[i].poster_path,
                    "name" : data.results[i].title,
                    "year" : data.results[i].release_date.substring(0, 4),
                    "genre_ids" : data.results[i].genre_ids
                })
            } else {
                document.getElementById("more").setAttribute("class", "btn d-none");
            }
        };
        
        currentFeatured.forEach((element, i) => {
            if (i >= inc * 6) {
                genreName(element, element.genre_ids[0]);
                document.getElementById("featuredList").innerHTML += `<li>${movieCase(element.poster, element.name, element.year, element.genre_name)}</li>`;
            }
        });
    }); 
}
    
    
let exampleCards = [];
//afficher exampleCards
fetch('https://api.themoviedb.org/3/discover/movie?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_crew=608&with_companies=10342').then(response => response.json()).then(data => {
    for (let i = 0; i < 5; i++) {

        exampleCards.push({
            "id" : data.results[i].id,
            "poster" : data.results[i].poster_path,
            "name" : data.results[i].title,
            "year" : data.results[i].release_date.substring(0, 4),
            "genre_ids" : data.results[i].genre_ids
        })
    }
    
    exampleCards.forEach(x => {
        genreName(x, x.genre_ids[0]);
        document.getElementById("cardList").innerHTML += `<li>${movieCase(x.poster, x.name, x.year, x.genre_name)}</li>`;
    });

});

let featuresButtons = [0, 28, 35, 18, 99, 27, 10751, 80, 14]
let incFilms = 0;
let currentGenre = 0;

featuresButtons.forEach((x, i) => {
    document.getElementsByClassName("btn_featuredMovie")[i].addEventListener("click", () => {
        document.getElementById("featuredList").innerHTML = "";
        currentFeatured = [];
        incFilms = 0;
        currentGenre = x;
        featuredFilms(x, incFilms);
        incFilms++;
        featuredFilms(x, incFilms);
    });
})

document.getElementById("more").addEventListener("click", () => {
    incFilms++;
    featuredFilms(currentGenre, incFilms);
    document.getElementById("less").setAttribute("class", "btn");
})

document.getElementById("less").addEventListener("click", () => {
    currentFeatured = currentFeatured.slice(0, 12);
    incFilms = 1;
    document.getElementById("featuredList").innerHTML = "";
    currentFeatured.forEach(x => {
        genreName(x, x.genre_ids[0]);
        document.getElementById("featuredList").innerHTML += `<li>${movieCase(x.poster, x.name, x.year, x.genre_name)}</li>`;
    });
    document.getElementById("less").setAttribute("class", "btn d-none");
    document.getElementById("more").setAttribute("class", "btn");
})