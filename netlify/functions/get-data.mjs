
export default async () => {
  try {
    const apiKey = Netlify.env.get("MY_API_KEY");

    if (!apiKey) {
      return Response.json(
        { error: "API key is missing in Netlify" },
        { status: 500 }
      );
    }

    const url = new URL(
      "https://api.themoviedb.org/3/movie/popular"
    );

    url.searchParams.set("api_key", apiKey);

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        { error: "TMDB could not provide movie data" },
        { status: response.status }
      );
    }

    const movies = await response.json();

    return Response.json(movies);
  } catch {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
