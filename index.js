const apiKey = "17115410e9f429d953409979781f3a4e";
const imgApi = "https://image.tmdb.org/t/p/w500";
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const form = document.getElementById("search-form");
const query = document.getElementById("search-input");
const result = document.getElementById("result");

let page = 1;
let isSearching = false;

//Getting JSON data
async function  fetchData(url) {
    try{
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return await response.json();
    } catch(error) {
        return null;
    }
}

//Fetch and show results
async function fetchAndShowResults(url) {
    const data = await fetchData(url);
    if (data && data.results) {
        showResults(data.results)
    }
}

//Create movie card
function createMovieCard(movie) {
    const {poster_path, original_title, release_date, overview} = movie;
    const imagePath = poster_path ? imgApi + poster_path : "./img-01.jpg";
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0,15) + '...' : original_title;
    console.log(original_title.length);
    const formattedDate = release_date || "Not available";
    const cardTemplate = 
        `<div class="column">
            <div class="card">
                <a href="./img-01.jpeg" class="card-media">
                    <img src="${imagePath}" alt="${original_title}" width="100%">
                </a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                            <h3 style="font-weight: 600;">${truncatedTitle}</h3>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="card-btn">See Cover</a>
                        </div>
                    </div>
                    <div class="info">
                        ${overview|| "Overview not available..."}
                    </div>
                </div>
            </div>
        </div>`;
    return cardTemplate;
}

//Clear results for new search
function clearResults() {
    result.innerHTML = "";
}

//Show results
function showResults(item) {
    console.log(1, item);
    const newContent = item.map(createMovieCard).join("");
    result.innerHTML += newContent || "<p> Movie not found!</p>";
}

//Load more results
async function  loadMoreResults() {
    if(isSearching) {
        return;
    }
    page++;
    const searchTerm = query.value;
    const url = searchTerm ? `${searchUrl}${searchTerm}&page=${page}` : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    await fetchAndShowResults(url);
}


//Detect end of page
function detectEnd() {
    const { scrollTop, clientHeight, scrollHeight} = document.documentElement;
    if(scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults();
    }
}

//Search
async function handleSearch(Event) {
    Event.preventDefault();
    const searchTerm = query.value.trim();
    if(searchTerm) {
        isSearching = true;
        clearResults();
        const newUrl = `${searchUrl}${searchTerm}&page=${page}`;
        await fetchAndShowResults(newUrl);
        query.value = "";
    }
}

//Event listeners
window.addEventListener('scroll', detectEnd);
window.addEventListener('resize', detectEnd);
form.addEventListener('submit', handleSearch);

//Initialize the page 
async function init() {
    clearResults();
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
    isSearching = false;
    await fetchAndShowResults(url);
}

init();