const movieContainer = document.querySelector("#movie-container");
const loadMoviesButton = document.querySelector("#load-movies");
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
let hasLoadedMovies = false;

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
  const score = Number(movie.vote_average);
  rating.textContent = `Rating: ${
    Number.isFinite(score) ? score.toFixed(1) : "N/A"
  }`;

  const overview = document.createElement("p");
  overview.className = "movie-overview";
  overview.textContent = movie.overview || "No overview available.";

  details.append(title, rating, overview);
  card.append(details);
  return card;
}

async function loadMovies() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://zesty-cactus-c400be.netlify.app/.netlify/functions/get-data",
      { signal: controller.signal }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Request failed (${response.status}): ${
          data.error || "Unable to retrieve movie data"
        }`
      );
    }

    if (!Array.isArray(data.results)) {
      throw new Error("The movie service returned an unexpected response.");
    }

    movieContainer.replaceChildren(...data.results.map(createMovieCard));
    return true;
  } catch (error) {
    const message = document.createElement("p");
    message.className = "movie-error";
    const errorMessage =
      error.name === "AbortError"
        ? "The request timed out. Please try again."
        : error.message;
    message.textContent = `Unable to load live movies: ${errorMessage}`;
    movieContainer.replaceChildren(message);
    return false;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

loadMoviesButton.addEventListener("click", async () => {
  loadMoviesButton.disabled = true;
  loadMoviesButton.textContent = "Loading movies...";

  try {
    const loaded = await loadMovies();
    if (loaded) {
      hasLoadedMovies = true;
    }
  } finally {
    loadMoviesButton.disabled = false;
    loadMoviesButton.textContent = hasLoadedMovies
      ? "Refresh movies"
      : "Load popular movies";
  }
});