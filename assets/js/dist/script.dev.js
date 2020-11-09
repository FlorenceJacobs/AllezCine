"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

window.onload = function () {
  function movieCase(id, poster, name, year, genre) {
    var film;
    film = "<div class=\"card moviePlayingCard\" id=\"".concat(id, "\" style=\"width: 11rem\" data-toggle=\"modal\" data-target=\"#testexampleModalCenter\">");
    film += "<img class=\"card-img-top\" src=\"https://image.tmdb.org/t/p/w500".concat(poster, "\" alt=\"No picture available :(\">");
    film += "<h3 class=\"card-title h6\">".concat(name, "</h3>");
    film += "<div class=\"d-flex justify-content-between\"><p class=\"card-text m-0\">".concat(year, "</p>");
    film += "<p class=\"m-0\">".concat(genre, "</p>");
    film += "</div></div>";
    return film;
  }

  var genreList = []; //générer genreList

  fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US').then(function (response) {
    return response.json();
  }).then(function (data) {
    data.genres.forEach(function (x) {
      genreList.push({
        "id": x.id,
        "name": x.name
      });
    });
  }); //nommer les genres avec les ids

  function genreName(object, id) {
    genreList.forEach(function (x) {
      if (id == x.id) {
        object.genre_name = x.name;
      }
    });
  }

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function clickCallback(x) {
    var film = {};
    var modal = document.getElementById("modalCards");
    modal.innerHTML = "";
    fetch("https://api.themoviedb.org/3/movie/".concat(x.id, "?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US")).then(function (response) {
      return response.json();
    }).then(function (data) {
      film.overview = data.overview;
      film.title = data.title;
      film.release_date = data.release_date;
      film.year = data.release_date.substring(0, 4);
      film.month = months[+data.release_date.substring(5, 7) - 1];
      film.day = +data.release_date.substring(8, 10);
      film.genres = [];
      data.genres.forEach(function (x) {
        return film.genres.push({
          "id": x.id
        });
      });
      film.genres.forEach(function (x) {
        return genreName(x, x.id);
      });
      film.genreNames = [];
      film.genres.forEach(function (x) {
        return film.genreNames.push(x.genre_name);
      });
      film.price = "Free";
    });
    fetch("https://api.themoviedb.org/3/movie/".concat(x.id, "/videos?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US")).then(function (response) {
      return response.json();
    }).then(function (data) {
      data.results[0] == undefined ? film.youtube = undefined : film.youtube = data.results[0].key;
    });
    setTimeout(function () {
      console.log(film);
      modal.innerHTML += "<iframe class=\"youtube\" src=\"https://www.youtube.com/embed/".concat(film.youtube, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>");
      modal.innerHTML += "<h4>".concat(film.title, "</h4>");
      modal.innerHTML += "<div class=\"d-flex justify-content-between\"><h5>Story Line :</h5><p>".concat(film.overview, "</p>");
      modal.innerHTML += "<div class=\"d-flex justify-content-between\"><h5>Release On :</h5><p>".concat(film.month, " ").concat(film.day, ", ").concat(film.year, "</p>");
      modal.innerHTML += "<div class=\"d-flex justify-content-between\"><h5>Genres :</h5><p>".concat(film.genreNames.join(" | "), "</p>");
      modal.innerHTML += "<div class=\"d-flex justify-content-between\"><h5>Price :</h5><p>".concat(film.price, "</p>");
    }, 600);
  }

  function addClickOnCards() {
    _toConsumableArray(document.getElementsByClassName("moviePlayingCard")).forEach(function (x) {
      x.addEventListener("click", function () {
        return clickCallback(x);
      });
    });
  }

  function removeClickOnCards() {
    _toConsumableArray(document.getElementsByClassName("moviePlayingCard")).forEach(function (x) {
      x.removeEventListener("click", function () {
        return clickCallback(x);
      });
    });
  }

  var currentFeatured = [];

  function queryFilm(sort, genre, inc, list, idList) {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US&sort_by=".concat(sort, "&include_adult=false&include_video=false&page=1").concat(genre == 0 ? "" : "&with_genres=".concat(genre))).then(function (response) {
      return response.json();
    }).then(function (data) {
      for (var i = inc * 6; i < inc * 6 + 6; i++) {
        if (data.results[i] != undefined) {
          list.push({
            "id": data.results[i].id,
            "poster": data.results[i].poster_path,
            "img": data.results[i].backdrop_path,
            "name": data.results[i].title,
            "year": data.results[i].release_date.substring(0, 4),
            "genre_ids": data.results[i].genre_ids
          });
        } else {
          document.getElementById("more").setAttribute("class", "btn d-none");
        }
      }

      ;
      list.forEach(function (element, i) {
        if (i >= inc * 6) {
          genreName(element, element.genre_ids[0]);
          document.getElementById(idList).innerHTML += "<li>".concat(movieCase(element.id, element.poster, element.name, element.year, element.genre_name), "</li>");
        }
      });
    });
  }

  var exampleCards = []; //afficher exampleCards

  fetch('https://api.themoviedb.org/3/discover/movie?api_key=a05fba96f4d3bad807d07845d4896afb&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_crew=608&with_companies=10342').then(function (response) {
    return response.json();
  }).then(function (data) {
    for (var i = 0; i < 5; i++) {
      exampleCards.push({
        "id": data.results[i].id,
        "poster": data.results[i].poster_path,
        "name": data.results[i].title,
        "year": data.results[i].release_date.substring(0, 4),
        "genre_ids": data.results[i].genre_ids
      });
    }

    exampleCards.forEach(function (x) {
      genreName(x, x.genre_ids[0]);
      document.getElementById("cardList").innerHTML += "<li>".concat(movieCase(x.id, x.poster, x.name, x.year, x.genre_name), "</li>");
    });
  });
  var featuresButtons = [0, 28, 35, 18, 99, 27, 10751, 80, 14];
  var incFilms = 0;
  var currentGenre = 0;
  var currentShop = [];
  queryFilm("popularity.desc", 0, incFilms, currentFeatured, "featuredList");
  queryFilm("vote_count.desc", 0, incFilms, currentShop, "shopList");
  incFilms++;
  queryFilm("popularity.desc", 0, incFilms, currentFeatured, "featuredList");
  queryFilm("vote_count.desc", 0, incFilms, currentShop, "shopList");
  removeClickOnCards();
  setTimeout(addClickOnCards, 500);
  featuresButtons.forEach(function (x, i) {
    document.getElementsByClassName("btn_featuredMovie")[i].addEventListener("click", function () {
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
  });
  document.getElementById("more").addEventListener("click", function () {
    incFilms++;
    queryFilm("popularity.desc", currentGenre, incFilms, currentFeatured, "featuredList");
    document.getElementById("less").setAttribute("class", "btn");
    removeClickOnCards();
    setTimeout(addClickOnCards, 500);
  });
  document.getElementById("less").addEventListener("click", function () {
    currentFeatured = currentFeatured.slice(0, 12);
    incFilms = 1;
    document.getElementById("featuredList").innerHTML = "";
    currentFeatured.forEach(function (x) {
      genreName(x, x.genre_ids[0]);
      document.getElementById("featuredList").innerHTML += "<li>".concat(movieCase(x.id, x.poster, x.name, x.year, x.genre_name), "</li>");
    });
    document.getElementById("less").setAttribute("class", "btn d-none");
    document.getElementById("more").setAttribute("class", "btn");
    removeClickOnCards();
    setTimeout(addClickOnCards, 500);
  }); //footer

  setTimeout(function () {
    currentShop.slice(0, 4).forEach(function (x) {
      document.getElementById("footerList").innerHTML += "<li class=\"d-flex align-items-center justify-content-around\"><img src=\"https://image.tmdb.org/t/p/w500".concat(x.img, "\" class=\"col-6\" alt=\"No picture available :(\"><p class=\"col-6\">").concat(x.name, "</p></li>");
    });
  }, 400);
  setTimeout(function () {
    currentFeatured.slice(0, 6).forEach(function (x) {
      document.getElementById("footerTable").innerHTML += "<img src=\"https://image.tmdb.org/t/p/w500".concat(x.poster, "\" alt=\"No picture available :(\">");
    });
  }, 400); //fenêtre des cookies

  $("#modalCookies").modal("show"); //Canvas

  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.beginPath();
  ctx.moveTo(75, 20);
  ctx.lineTo(125, 75);
  ctx.lineTo(100, 75);
  ctx.lineTo(100, 125);
  ctx.lineTo(50, 125);
  ctx.lineTo(50, 75);
  ctx.lineTo(25, 75);
  ctx.lineTo(75, 20);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}; //<iframe src="https://www.youtube.com/embed/_R1nBwrNf2w" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>