const movieSearchBox = document.querySelector("#movie-search-box");
const searchList = document.querySelector("#search-list");
const resultGrid = document.querySelector("#result-grid");
localStorage.setItem("apiKey", EncryptStringAES("3fb7f549"));

window.addEventListener("load", ()=>{

    resultGrid.innerHTML = `<a href="https://www.imdb.com/title/tt1877830/" target="_blank"><img src="./batman.jpg" alt="The Batman (2022)" id="home-image" style="width:550px"></a>
    `;
    resultGrid.innerHTML += `<a href="https://www.imdb.com/title/tt1160419/" target="_blank"><img src="./dune.jpg" alt="The Dune (2021)" id="home-image" style="width:550px"></a>
    `;
    movieSearchBox.focus();


})


async function loadMovies(searchTerm) {

    let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    const url = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${apiKey}`
    const res = await (await fetch(`${url}`)).json();
    try{
        if(res.Response == "True") displayMovieList(res.Search)
    }
    catch (error){
        alert(error)
    }
    
};


function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove("hide-search-list")
        console.log(searchList.classList);
    }
    else{
        console.log(searchList);
        searchList.classList.add("hide-search-list")
    }
    console.log(searchTerm);
    loadMovies(searchTerm);
};


function displayMovieList(movies) {
    
    searchList.innerHTML ="";

    for(let i=0; i<movies.length; i++){
        let movieListItem = document.createElement("div");
        console.log(movieListItem);
        movieListItem.dataset.id = movies[i].imdbID;
        movieListItem.classList.add("search-list-item");
        if (movies[i].Poster != "N/A") {
            moviesPoster = movies[i].Poster;
        }
        else{
            moviesPoster = "./imagenotfound.svg"
        }
        movieListItem.innerHTML = `<div class="search-item-thumbnail">
        <img src="${moviesPoster}" alt="">
        </div>
        <div class="search-item-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
        </div>
        `;
        console.log(searchList);
        console.log(movieListItem);
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
};
function loadMovieDetails(){

    const searchListMovies = searchList.querySelectorAll(".search-list-item");
    searchListMovies.forEach(movie =>{
        movie.addEventListener("click", async (e)=>{

            searchList.classList.add("hide-search-list")
            movieSearchBox.value = "";
            let apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
            console.log(apiKey);
            const result = await (await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${apiKey}`)).json();
            console.log(result);
            try{
                const {Title, Year, Rated, Genre, Writer, Actors, Plot, Language, Awards, Poster, imdbRating} = result;
                resultGrid.innerHTML = `
                <div class="movie-poster">
                        <img src="${(Poster != 'N/A') ? Poster : './imagenotfound.svg'}" alt="movie-poster">
                    </div>
                    <div class="movie-info">
                        <h3 class=" movie-title">${Title}</h3>
                        <ul class="movie-misc-info">
                            <li class="year"><strong>Year:</strong> ${Year}</li>
                            <li class="rated"><strong>Ratings:</strong> ${Rated}</li>
                            <li><a href="https://www.imdb.com/title/${movie.dataset.id}/" target="_blank"><img src="./imdb.png" alt=""></a></li>
                            <li class="puan"> ${imdbRating}</li>
                        </ul>
                        <p class="genre"> <strong>Genre:</strong> ${Genre}</p>
                        <p class="writer"> <strong>Writer:</strong> ${Writer}</p>
                        <p class="actors"> <strong>Actors:</strong> ${Actors}</p>
                        <p class="plot">${Plot}</p>
                        <p class="lang"> <strong>Language:</strong> ${Language}</p>
                        <p class="award"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f5c518" class="bi bi-award-fill" viewBox="0 0 16 16">
                            <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
                            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                          </svg> ${Awards}</p>
                    </div>
                `;
                movieSearchBox.focus();
            }
            catch (error){
                alert(error)
            }        
        });
    });
};


movieSearchBox.addEventListener("keyup", ()=> {
    findMovies();
});

window.addEventListener("click", (e)=>{
    if(e.target.className != "form-control") {
        searchList.classList.add("hide-search-list")
    }
})