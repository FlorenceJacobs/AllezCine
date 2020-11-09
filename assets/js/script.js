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


    function clickCallback(x) {
        let film = {};
        fetch(`https://api.themoviedb.org/3/movie/${x.id}?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US`).then(response => response.json()).then(data => {
            film.overview = data.overview;
            film.release_date = data.release_date;
            film.genres = [];
            data.genres.forEach(x => film.genres.push(x.id));
            film.price = "Free";
        });
        fetch(`https://api.themoviedb.org/3/movie/${x.id}/videos?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US`).then(response => response.json()).then(data => {
            data.results[0] == undefined ? film.youtube = undefined : film.youtube = data.results[0].id;
        });
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
    setTimeout(removeClickOnCards, 1000)
    setTimeout(addClickOnCards, 2000);


    featuresButtons.forEach((x, i) => {
        document.getElementsByClassName("btn_featuredMovie")[i].addEventListener("click", () => {
            document.getElementById("featuredList").innerHTML = "";
            currentFeatured = [];
            incFilms = 0;
            currentGenre = x;
            queryFilm("popularity.desc", x, incFilms, currentFeatured, "featuredList");
            incFilms++;
            queryFilm("popularity.desc", x, incFilms, currentFeatured, "featuredList");
            setTimeout(removeClickOnCards, 1000)
            setTimeout(addClickOnCards, 2000);
            document.getElementById("less").setAttribute("class", "btn d-none");
        });
    })

    document.getElementById("more").addEventListener("click", () => {
        incFilms++;
        queryFilm("popularity.desc", currentGenre, incFilms, currentFeatured, "featuredList");
        document.getElementById("less").setAttribute("class", "btn");
        setTimeout(removeClickOnCards, 1000)
        setTimeout(addClickOnCards, 2000);
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
        setTimeout(removeClickOnCards, 1000)
        setTimeout(addClickOnCards, 2000);
    })

    //footer
    setTimeout(() => {(currentShop.slice(0,4)).forEach(x => {
            document.getElementById("footerList").innerHTML += `<li class="d-flex align-items-center justify-content-around"><img src="https://image.tmdb.org/t/p/w500${x.img}" alt="No picture available :("><p>${x.name}</p></li>`
        });
    }, 1000)

    setTimeout(() => {(currentFeatured.slice(0,6)).forEach(x => {
            document.getElementById("footerTable").innerHTML += `<img src="https://image.tmdb.org/t/p/w500${x.poster}" alt="No picture available :(">`
        });
    }, 1000);
    

    //fenêtre des cookies
    if (localStorage.getItem("cookies") == null){
        let cookies = document.createElement("DIV");
        cookies.setAttribute("class", "cookies")
        let p = document.createElement("P");
        cookies.appendChild(p);
        p.innerText = "This website needs cookies to keep track of your account settings and preferences and to perform at best. None of them will be sold nor used by other companies. You can access the data of your cookies at any time, and delete them at any time. Cookies aren't needed to visit the website.";
        let q = document.createElement("P");
        q.innerText = "Do you accept that we keep personal info about you in cookies ?";
        cookies.appendChild(q);
        let yes = document.createElement("BUTTON");
        yes.setAttribute("value", "Yes");
        cookies.appendChild(yes);
        yes.addEventListener("click", () => {
            localStorage.setItem("cookies", true);
            cookies.setAttribute("class", "cookies d-none")
        });
        let no = document.createElement("BUTTON");
        yes.setAttribute("value", "No");
        cookies.appendChild(no);
        no.addEventListener("click", () => {
            localStorage.setItem("cookies", false);
            cookies.setAttribute("class", "cookies d-none")
        });
        let worry = document.createElement("P");
        worry.innerText = "(There actually aren't any cookies right now so don't worry)"
        cookies.appendChild(worry);
        document.body.appendChild(cookies);
    }

};