fetch("https://zesty-cactus-c400be.netlify.app/.netlify/functions/get-data")
  .then(response => response.json())
  .then(data => {
    console.log(data.results);
  });