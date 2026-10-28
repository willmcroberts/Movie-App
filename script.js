const movieContainer = document.querySelector("#movie-container");
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

/*
fetch(
  "https://zesty-cactus-c400be.netlify.app/.netlify/functions/get-data"
)
  .then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status}): ${
          data.error || "Unknown error"
        }`
      );
    }

    return data;
  })
  .then((data) => {
    console.log("Popular movies:", data.results);
  })
  .catch((error) => {
    console.error("Failed to fetch movies:", error);
  });
*/

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-cards";

  if (movie.poster_path) {
    const poster = document.createElement("img");
    poster.className = "movie-poster";
    poster.src = `${imageBaseUrl}${movie.poster_path}`;
    poster.alt = `${movie.title} poster`;
    card.append(poster);
  }

  const details = document.createElement("div");
  details.className = "movie-details";

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const rating = document.createElement("p");
  rating.className = "movie-rating";
  rating.textContent = `Rating: ${movie.vote_average}`;

  const overview = document.createElement("p");
  overview.className = "movie-overview";
  overview.textContent = movie.overview || "No overview available.";

  details.append(title, rating, overview);
  card.append(details);
  return card;
}

async function loadMovies() {
  try {
    const response = await fetch("./offline.json");
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();
    movieContainer.replaceChildren(...data.results.map(createMovieCard));
  } catch (error) {
    console.error("Failed to load offline movie data:", error);
    const message = document.createElement("p");
    message.className = "movie-error";
    message.textContent =
      "Unable to load movies. Open this site through a local or hosted web server.";
    movieContainer.replaceChildren(message);
  }
}

loadMovies();