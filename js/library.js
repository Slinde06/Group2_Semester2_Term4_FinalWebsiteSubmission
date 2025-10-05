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
    
    // api call for main library page as well as filters
    let libraryMovies = [];

    let library = await fetch(
   'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options
  )
    .then((response) => response.json())
    .then((result) => {return result;})
    .catch((err) => console.error(err));
  
    for (let i = 0; i < library.results.length; i++) {
        let title = library.results[i].title;
        let id = library.results[i].id;
        let image = library.results[i].poster_path;
        let genres = library.results[i].title;
        let year = library.results[i].release_date.slice(0,4);
        let rating = library.results[i].vote_average;
        
        libraryMovies.push((window["movie_" + i]) = new Library(title,id,genres,image,year,rating))
    }

    DisplayMovies(libraryMovies);


    //filtering for the genres

    function FilterGenre(){
        let filter = document.getElementById("genreFilter");
        let selectedID = filter.options[filter.selectedIndex].id;
        let filteredMovies = libraryMovies.filter(movie => {
            return movie.genres.contains(selectedID);
        })
        DisplayMovies(filteredMovies);
    }

    //filtering for year
    function FilterYear() {
        let filterYear = document.getElementById("yearFilter").value;
        let filteredMovies = libraryMovies.filter(movie => {
            return movie.year == filterYear;
        })
        DisplayMovies(filteredMovies);
    }

    //filtering for rating
    function FilterRating() {
        let filterRating = parseInt(document.getElementById("ratingFilter").value);
        let filteredMovies = libraryMovies.filter(movie => {
            return parseInt(movie.rating) <= filterRating;
        })
        DisplayMovies(filteredMovies);
    }
    
    //filtering ascending and descending popularity
    function FilterOrder() {
        let filterOrder = document.getElementById("ratingFilter").value;
        if (filterOrder == "Ascending") {
            libraryMovies.sort((a,b) => a - b);
            DisplayMovies(libraryMovies);
        }else{
            libraryMovies.sort((a,b) => b - a);
            DisplayMovies(libraryMovies);
        }
 
        DisplayMovies(filteredMovies);
    }   


})();


//display the movies on the library page
function DisplayMovies(_movies) {
    _movies.forEach(movie => {
        $('#LibraryDisplay').html('')
    });
}
