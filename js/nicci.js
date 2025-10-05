class WatchList {
  constructor(id, name, year, image, genres, lang, rating) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.image = image;
    this.genres = genres;
    this.lang = lang;
    this.rating = rating;
  }
}

!(async function () {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDU3MzgzY2VjNzAxNjA3ZDU2MzNhM2JhNWE2NWIyOCIsIm5iZiI6MTc1ODA0ODgzMy44MzEsInN1YiI6IjY4YzliMjQxNzEzMjEzNTg2NjgwNTA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJove7Zugq6BpkyvUOYrd2JbApgx3K0lzQRKXoTWVU8",
    },
  };

  let data = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let tempWatchList = [];

  for (let i = 0; i < data.results.length; i++) {
    let id = data.results[i].id;
    let details = await fetch(
      "https://api.themoviedb.org/3/movie/" + id + "?language=en-US&page=1",
      options
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err));

    let title = data.results[i].title;
    let image = data.results[i].poster_path;
    let year = data.results[i].release_date.slice(0, 4);
    let genres = details.genres;
    let language = data.results[i].original_language;
    let rating = data.results[i].vote_average;

    tempWatchList.push(
      (window["movie_" + i] = new WatchList(
        id,
        title,
        year,
        image,
        genres,
        language,
        rating
      ))
    );
  }
  console.log(tempWatchList);

  tempWatchList.forEach((movie) => {
    document.getElementById("watchList").innerHTML += `
    <div class="col">
            <div class="card h-100 p-2" style="border:1px solid #ffffff;">
              <div style="height:180px; background:transparent; border:1.5px solid #ffffff;">
                <div width="100%" height="100%">
               
                </div>
              </div>
              <div class="card-body p-2">
                <h5 class="card-title mb-1" style="font-size:1rem;">${movie.name}</h5>
                <p class="card-text mb-2" style="font-size:0.9rem;">${movie.year} R</p>
                <div class="d-flex gap-2">
                  <button class="btn btn-dark btn-sm">Play</button>
                  <button class="btn btn-outline-dark btn-sm">
                    Remove from My List
                  </button>
                </div>
              </div>
            </div>
          </div>
    `;
  });

  $("#genreFilter").on("change", function () {
    filteredMovies = tempWatchList.filter(function (movies) {
      for (let i = 0; i < movies.genres.length; i++) {
        return $(this).val() == movies.genres[i].name;
      }
    });
    filteredMovies.forEach((movie) => {
      document.getElementById("watchList").innerHTML += `
    <div class="col">
            <div class="card h-100 p-2" style="border:1px solid #ffffff;">
              <div style="height:180px; background:transparent; border:1.5px solid #ffffff;">
                <div width="100%" height="100%">
               
                </div>
              </div>
              <div class="card-body p-2">
                <h5 class="card-title mb-1" style="font-size:1rem;">${movie.name}</h5>
                <p class="card-text mb-2" style="font-size:0.9rem;">${movie.year} R</p>
                <div class="d-flex gap-2">
                  <button class="btn btn-dark btn-sm">Play</button>
                  <button class="btn btn-outline-dark btn-sm">
                    Remove from My List
                  </button>
                </div>
              </div>
            </div>
          </div>
    `;
    });
  });
})();
