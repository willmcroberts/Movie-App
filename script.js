/*fetch(
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