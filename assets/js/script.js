window.onload = function() {
    
    function movieCase(id, poster, name, year, genre) {
        let film;
        film = `<div class="card moviePlayingCard" id="${id}" style="width: 11rem" data-toggle="modal" data-target="#testexampleModalCenter">`;
        film += `<img class="card-img-top" src="https://image.tmdb.org/t/p/w500${poster}" alt="No picture available :(">`;
        film += `<h3 class="card-title h6">${name}</h3>`;
        film += `<div class="d-flex justify-content-between"><p class="card-text m-0">${year}</p>`;
        film += `<p class="m-0">${genre}</p>`;
        film += `</div></div>`;
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

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function clickCallback(x) {
        let film = {};
        let modal = document.getElementById("modalCards");
        modal.innerHTML = "";
        fetch(`https://api.themoviedb.org/3/movie/${x.id}?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US`).then(response => response.json()).then(data => {
            film.overview = data.overview;
            film.title = data.title;
            film.release_date = data.release_date;
            film.year = data.release_date.substring(0, 4);
            film.month = months[+data.release_date.substring(5, 7) - 1];
            film.day = +data.release_date.substring(8, 10);
            film.genres = [];
            data.genres.forEach(x => film.genres.push({"id": x.id}));
            film.genres.forEach(x => genreName(x, x.id));
            film.genreNames = [];
            film.genres.forEach(x => film.genreNames.push(x.genre_name));
            film.price = "Free";
        });
        fetch(`https://api.themoviedb.org/3/movie/${x.id}/videos?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US`).then(response => response.json()).then(data => {
            data.results[0] == undefined ? film.youtube = undefined : film.youtube = data.results[0].key;
        });
        setTimeout(() => {
            console.log(film);
            modal.innerHTML += `<iframe class="youtube" src="https://www.youtube.com/embed/${film.youtube}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            modal.innerHTML += `<h4>${film.title}</h4>`;
            modal.innerHTML += `<div class="d-flex justify-content-between"><h5>Story Line :</h5><p>${film.overview}</p>`;
            modal.innerHTML += `<div class="d-flex justify-content-between"><h5>Release On :</h5><p>${film.month} ${film.day}, ${film.year}</p>`;
            modal.innerHTML += `<div class="d-flex justify-content-between"><h5>Genres :</h5><p>${film.genreNames.join(" | ")}</p>`;
            modal.innerHTML += `<div class="d-flex justify-content-between"><h5>Price :</h5><p>${film.price}</p>`;
        }, 600)
    }

    function addClickOnCards() {
        [...document.getElementsByClassName("moviePlayingCard")].forEach(x => {
            x.addEventListener("click", () => clickCallback(x));
        })
    }

    function removeClickOnCards() {
        [...document.getElementsByClassName("moviePlayingCard")].forEach(x => {
            x.removeEventListener("click", () => clickCallback(x));
        })
    }

    


    let currentFeatured = [];
    function queryFilm(sort, genre, inc, list, idList) {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US&sort_by=${sort}&include_adult=false&include_video=false&page=1${genre == 0 ? "" : `&with_genres=${genre}`}`).then(response => response.json()).then(data => {
            for (let i = (inc * 6); i < (inc * 6 + 6); i++) {
                if (data.results[i] != undefined) {
                    list.push({
                        "id" : data.results[i].id,
                        "poster" : data.results[i].poster_path,
                        "img" : data.results[i].backdrop_path,
                        "name" : data.results[i].title,
                        "year" : data.results[i].release_date.substring(0, 4),
                        "genre_ids" : data.results[i].genre_ids
                    })
                } else {
                    document.getElementById("more").setAttribute("class", "btn d-none");
                }
            };
            
            list.forEach((element, i) => {
                if (i >= inc * 6) {
                    genreName(element, element.genre_ids[0]);
                    document.getElementById(idList).innerHTML += `<li>${movieCase(element.id, element.poster, element.name, element.year, element.genre_name)}</li>`;
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
            document.getElementById("cardList").innerHTML += `<li>${movieCase(x.id, x.poster, x.name, x.year, x.genre_name)}</li>`;
        });

    });

    let featuresButtons = [0, 28, 35, 18, 99, 27, 10751, 80, 14]
    let incFilms = 0;
    let currentGenre = 0;
    let currentShop = [];

    queryFilm("popularity.desc", 0, incFilms, currentFeatured, "featuredList");
    queryFilm("vote_count.desc", 0, incFilms, currentShop, "shopList");
    incFilms++;
    queryFilm("popularity.desc", 0, incFilms, currentFeatured, "featuredList");
    queryFilm("vote_count.desc", 0, incFilms, currentShop, "shopList");
    removeClickOnCards();
    setTimeout(addClickOnCards, 500);


    featuresButtons.forEach((x, i) => {
        document.getElementsByClassName("btn_featuredMovie")[i].addEventListener("click", () => {
            document.getElementById("featuredList").innerHTML = "";
            currentFeatured = [];
            incFilms = 0;
            currentGenre = x;
            queryFilm("popularity.desc", x, incFilms, currentFeatured, "featuredList");
            incFilms++;
            queryFilm("popularity.desc", x, incFilms, currentFeatured, "featuredList");
            removeClickOnCards();
            setTimeout(addClickOnCards, 500);
            document.getElementById("less").setAttribute("class", "btn d-none");
        });
    })

    document.getElementById("more").addEventListener("click", () => {
        incFilms++;
        queryFilm("popularity.desc", currentGenre, incFilms, currentFeatured, "featuredList");
        document.getElementById("less").setAttribute("class", "btn");
        removeClickOnCards();
        setTimeout(addClickOnCards, 500);
    })

    document.getElementById("less").addEventListener("click", () => {
        currentFeatured = currentFeatured.slice(0, 12);
        incFilms = 1;
        document.getElementById("featuredList").innerHTML = "";
        currentFeatured.forEach(x => {
            genreName(x, x.genre_ids[0]);
            document.getElementById("featuredList").innerHTML += `<li>${movieCase(x.id, x.poster, x.name, x.year, x.genre_name)}</li>`;
        });
        document.getElementById("less").setAttribute("class", "btn d-none");
        document.getElementById("more").setAttribute("class", "btn");
        removeClickOnCards();
        setTimeout(addClickOnCards, 500);
    })

    //footer
    setTimeout(() => {(currentShop.slice(0,4)).forEach(x => {
            document.getElementById("footerList").innerHTML += `<li class="d-flex align-items-center justify-content-around"><img src="https://image.tmdb.org/t/p/w500${x.img}" class="col-6" alt="No picture available :("><p class="col-6">${x.name}</p></li>`
        });
    }, 400)

    setTimeout(() => {(currentFeatured.slice(0,6)).forEach(x => {
            document.getElementById("footerTable").innerHTML += `<img src="https://image.tmdb.org/t/p/w500${x.poster}" alt="No picture available :(">`
        });
    }, 400);


    //fenêtre des cookies
    $("#modalCookies").modal("show");

    //Canvas

    // arrow.setAttribute("onclick", "topFunction()")
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            arrow.style.display = "block";
        } else {
            arrow.style.display = "none";
        }
    };

    let arrow = document.createElement("A");
    arrow.setAttribute("id", "arrow");
    arrow.setAttribute("href", "#");
    let canvas = document.createElement("CANVAS");
    canvas.setAttribute("width", 150);
    canvas.setAttribute("height", 150);
    canvas.setAttribute("id", "canvas");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(75, 20);
    ctx.lineTo(125, 75);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 125);
    ctx.lineTo(50, 125);
    ctx.lineTo(50, 75);
    ctx.lineTo(25, 75);
    ctx.lineTo(75,20);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    arrow.appendChild(canvas);
    document.body.appendChild(arrow);

    window.onscroll = function() {scrollFunction()};

};

//<iframe src="https://www.youtube.com/embed/_R1nBwrNf2w" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>