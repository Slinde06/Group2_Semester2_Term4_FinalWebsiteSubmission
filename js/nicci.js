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

class Library {
    constructor(title,id,genres,image,year,rating) {
        this.title = title;
        this.id = id;
        this.year = year;
        this.image = image;
        this.genres = genres;
        this.rating = rating;

    }
}

class Featured {
    constructor(title,id,backdrop,tagline) {
        this.tagline = tagline;
        this.title = title;
        this.id = id;
        this.backdrop = backdrop;
    }
}

//API functions
!(async function () {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDU3MzgzY2VjNzAxNjA3ZDU2MzNhM2JhNWE2NWIyOCIsIm5iZiI6MTc1ODA0ODgzMy44MzEsInN1YiI6IjY4YzliMjQxNzEzMjEzNTg2NjgwNTA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJove7Zugq6BpkyvUOYrd2JbApgx3K0lzQRKXoTWVU8",
    },
  };
//populate the genres dropdown from the api
  let genres = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?language=en', options
  )
    .then((response) => response.json())
    .then((result) => {return result;})
    .catch((err) => console.error(err));

  genres.forEach(genre => {
    document.getElementById("genreFilter").innerHTML += `
    <option id="${genre.id}">${genre.name}</option>
    `
  });

 //get 3 featured movies for the hero slider as well as info needed for later JS coding
    let featured = await fetch(
    'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options
  )
    .then((response) => response.json())
    .then((result) => {return result;})
    .catch((err) => console.error(err));
    
    let featuredMovies = [];
    
    for (let i = 0; i < 3; i++) {
        let title = featured.results[i].title;
        let id = featured.results[i].id;
        let movieDetails = await fetch(
            'https://api.themoviedb.org/3/movie/'+ id +'?language=en-US', options
        )
        .then((response) => response.json())
        .then((result) => {return result;})
        .catch((err) => console.error(err));
        
        let tagline = movieDetails.tagline;
        let backdrop = "https://image.tmdb.org/t/p/original" + movieDetails.backdrop_path;
        featuredMovies.push((window["movie_" + i]) = new Featured(title,id,backdrop,tagline));
    }
    

//call for popular movies

  let data = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));


    //Temp watchlist code
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
    let image = "https://image.tmdb.org/t/p/w500" + data.results[i].poster_path;
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


  //Library page code
    for (let i = 0; i < library.results.length; i++) 
    {
        let title = library.results[i].title;
        let id = library.results[i].id;
        let image = library.results[i].poster_path;
        let genres = library.results[i].title;
        let year = library.results[i].release_date.slice(0,4);
        let rating = library.results[i].vote_average;
        
        libraryMovies.push((window["movie_" + i]) = new Library(title,id,genres,image,year,rating))
    }
    DisplayLibraryCards(libraryMovies,"placeholderID");


    //Filtering for genres
     function FilterGenre()
    {
        let filter = document.getElementById("genreFilter");
        let selectedID = filter.options[filter.selectedIndex].id;
        let filteredMovies = libraryMovies.filter(movie => {
            return movie.genres.contains(selectedID);
        })
        DisplayLibraryMovies(filteredMovies);
    }

    //filtering for year
    function FilterYear() 
    {
        let filterYear = document.getElementById("yearFilter").value;
        let filteredMovies = libraryMovies.filter(movie => 
        {
            return movie.year == filterYear;
        })
        DisplayLibraryMovies(filteredMovies);
    }

    //filtering for rating
    function FilterRating() 
    {
        let filterRating = parseInt(document.getElementById("ratingFilter").value);
        let filteredMovies = libraryMovies.filter(movie => 
        {
            return parseInt(movie.rating) <= filterRating;
        })
        DisplayLibraryMovies(filteredMovies);
    }
    
    //filtering ascending and descending popularity
    function FilterOrder() 
    {
        let filterOrder = document.getElementById("ratingFilter").value;
        if (filterOrder == "Ascending") 
        {
            libraryMovies.sort((a,b) => a - b);
            DisplayLibraryMovies(libraryMovies);
        }
        else
        {
            libraryMovies.sort((a,b) => b - a);
            DisplayLibraryMovies(libraryMovies);
        }
 
    
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

})();

function DisplayLibraryCards(movieArray, displayContainerID) 
{
    _movies.forEach(movie => {
    $(displayContainerID).html('')
    });
}


function DisplayHomePageCards(movieArray, displayContainerID) 
{
    
}