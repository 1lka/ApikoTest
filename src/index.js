const apiURL = "https://api.themoviedb.org/3";
const apiKey = "?api_key=913a65acf38328965f80c0e88d321731";
const imageURL = "https://image.tmdb.org/t/p/w500";
const tranding = "/movie/top_rated";
const details = "/movie";
const searchURL = "/search/movie";
const recomendations = "/recommendations";

function doGetRequest(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => json.results);
}

function getTranding() {
  return doGetRequest(`${apiURL}${tranding}${apiKey}`);
}

function getRecommendations(id) {
  return doGetRequest(`${apiURL}${details}/${id}${recomendations}${apiKey}`);
}

function doSearch(string) {
  return doGetRequest(`${apiURL}${searchURL}${apiKey}&query=${string}`);
}

function search() {
  const searchFiled = document.getElementById("search-fld");
  const searchValue = searchFiled.value;
  searchFiled.value = "";

  if (!searchValue) {
    showMainList();
    return;
  }

  doSearch(searchValue).then(results => {
    const list = document.getElementById("movieList");
    list.innerHTML = "";

    toggleView("movies");
    results.map(createMovieLink).forEach(li => list.appendChild(li));
  });
}

document.getElementById("search-btn").addEventListener("click", search);

function createMovieLink(movie) {
  const { poster_path, title, original_title, overview: descr, id } = movie;
  const li = document.createElement("li");
  const link = document.createElement("a");

  link.onclick = e => {
    const img = document.getElementById("poster");
    img.setAttribute("src", imageURL + poster_path);

    const header = document.getElementById("header");
    header.innerHTML = title;

    const overview = document.getElementById("overview");
    overview.innerHTML = descr;

    const recs = document.getElementById("recommendations");
    recs.innerHTML = "Loading...";

    toggleView("movieDetail");

    getRecommendations(id).then(results => {
      const ul = document.createElement("ul");

      results
        .slice(0, 3)
        .map(createMovieLink)
        .forEach(li => ul.appendChild(li));

      recs.innerHTML = "";
      recs.appendChild(ul);
    });
  };

  const linkText = document.createTextNode(title);
  link.appendChild(linkText);
  link.title = original_title;
  link.href = "javascript:void(0)";
  li.appendChild(link);

  return li;
}

function showMainList() {
  const list = document.getElementById("movieList");
  list.innerHTML = "";

  getTranding().then(results => {
    toggleView("movies");
    results.map(createMovieLink).forEach(li => list.appendChild(li));
  });
}

function toggleView(view) {
  document
    .getElementById("content")
    .querySelectorAll("#content > div")
    .forEach(div => (div.style.display = "none"));

  document.getElementById(view).style.display = "block";
}

showMainList();
