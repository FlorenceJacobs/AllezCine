$('#moviePLaying1').modal('show')

function movieCase(poster, name, year, genre) {
    let film = document.createElement("P")
    [poster, name, year, genre].forEach(x => {
        x == poster ? x = document.createElement("IMG").setAttribute("src", poster) : x = document.createElement("P").setAttribute("value", x);
        film.appendChild(x)
    })
}