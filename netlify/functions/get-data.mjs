
const allowedOrigins = new Set([
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://willmcroberts.github.io"
]);

export default async (request) => {
  const origin = request.headers.get("origin");
  const headers = {
    "Content-Type": "application/json"
  };

  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }

  // Handle browser preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (request.method !== "GET") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers }
    );
  }

  try {
    const apiKey = process.env.MY_API_KEY;

    if (!apiKey) {
      console.error("MY_API_KEY is missing");
      return Response.json(
        { error: "API key is missing in Netlify" },
        { status: 500, headers }
      );
    }

    const url = new URL(
      "https://api.themoviedb.org/3/movie/popular"
    );

    url.searchParams.set("api_key", apiKey);

    const response = await fetch(url);
    const body = await response.text();

    if (!response.ok) {
      // Log the upstream error, never the API key
      console.error("TMDB error:", response.status, body);

      return Response.json(
        {
          error: "TMDB request failed",
          upstreamStatus: response.status
        },
        { status: 502, headers }
      );
    }

    return new Response(body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Failed to retrieve movie data:", error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500, headers }
    );
  }
};
