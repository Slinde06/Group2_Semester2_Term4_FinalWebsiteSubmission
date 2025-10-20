class HomepageMovies {
  constructor(ID, poster) {
    this.ID = ID;
    this.poster = poster;
  }
}

class actor {
  constructor(image, name) {
    this.image = image;
    this.name = name;
  }
}

class WatchList {
  constructor(id, name, year, image, genres, lang, rating) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.poster = image;
    this.genres = genres;
    this.lang = lang;
    this.rating = rating;
  }
}

class Library {
  constructor(title, id, genres, image, year, rating) {
    this.title = title;
    this.id = id;
    this.year = year;
    this.poster = image;
    this.genres = genres;
    this.rating = rating;
  }
}

class Featured {
  constructor(title, id, backdrop, tagline) {
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
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
    console.log(genres.genres);
    let genreList = genres.genres;

    try {

    genreList.forEach((genre) => {
      let out ="<option id='"+genre.id+"'>"+genre.name+"</option>";
     $("#genreDropdown").append(out);
    });
  } catch (error) {
    console.log(error);
  }

  //get 3 featured movies for the hero slider as well as info needed for later JS coding
  let featured = await fetch(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let featuredMovies = [];

  for (let i = 0; i < 3; i++) {
    let title = featured.results[i].title;
    let id = featured.results[i].id;
    let movieDetails = await fetch(
      "https://api.themoviedb.org/3/movie/" + id + "?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err));

    let tagline = movieDetails.tagline;
    let backdrop =
      "https://image.tmdb.org/t/p/original" + movieDetails.backdrop_path;
    featuredMovies.push(
      (window["movie_" + i] = new Featured(title, id, backdrop, tagline))
    );
  }
  featuredMovies.forEach(DisplayFeaturedMovies);

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
  DisplayHomePageCards(tempWatchList,"#continueWatchingContainer");


  //Library page code
  let library = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let libraryMovies = [];
  for (let i = 0; i < library.results.length; i++) {
    let title = library.results[i].title;
    let id = library.results[i].id;
    let image = "https://image.tmdb.org/t/p/w500"+library.results[i].poster_path;
    let genres = library.results[i].genre_ids;  
    let year = library.results[i].release_date.slice(0, 4);
    let rating = library.results[i].vote_average;

    libraryMovies.push(
      (window["movie_" + i] = new Library(
        title,
        id,
        genres,
        image,
        year,
        rating
      ))
    );
  }
  DisplayLibraryCards(libraryMovies, "#librarycards");

  //recommendations

  let recommendations = await fetch(
    "https://api.themoviedb.org/3/movie/12/recommendations?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let recommended = [];

  for (let i = 0; i < recommendations.results.length; i++) {
    let ID = recommendations.results[i].id;
    let poster =
      "https://image.tmdb.org/t/p/original" +
      recommendations.results[i].poster_path;
    recommended.push(new HomepageMovies(ID, poster));
  }

  //toppicks

  let toppicks = await fetch(
    "https://api.themoviedb.org/3/movie/12/recommendations?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let top = [];
  for (let i = 0; i < toppicks.results.length; i++) {
    let ID = toppicks.results[i].id;
    let poster =
      "https://image.tmdb.org/t/p/original" + toppicks.results[i].poster_path;
    top.push(new HomepageMovies(ID, poster));
  }
  DisplayHomePageCards(top,"#topPicksContainer");
  

  //trending

  let trending = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let trend = [];
  for (let i = 0; i < trending.results.length; i++) {
    let ID = trending.results[i].id;
    let poster =
      "https://image.tmdb.org/t/p/original" + trending.results[i].poster_path;
    trend.push(new HomepageMovies(ID, poster));
  }
  DisplayHomePageCards(trend,"#trendingContainer");
  //comedy

  let comedy = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let genre = [];

  for (let i = 0; i < comedy.results.length; i++) {
    let ID = comedy.results[i].id;
    if (comedy.results[i].genre_ids.includes(35) ) {
      let poster =
        "https://image.tmdb.org/t/p/original" + comedy.results[i].poster_path;
      genre.push(new HomepageMovies(ID, poster));
    }
  }
    DisplayHomePageCards(genre,"#genreContainer");


  //Individual movie pages

  let individual = await fetch(
    "https://api.themoviedb.org/3/movie/" + 12 + "?language=en-US",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let title = individual.title;
  let ID = individual.id;
  let backdrop_path = "https://image.tmdb.org/t/p/original"+individual.backdrop_path;
  let rating = individual.rating;
  let overview = individual.overview;

  let credits = await fetch(
    "https://api.themoviedb.org/3/movie/12/credits?language=en-US",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let actors = [];
let i=0;
while (i <credits.cast.length && actors.length<=4) {
   if (credits.cast[i].known_for_department=="Acting") {
    let name=credits.cast[i].name;
    let image="https://image.tmdb.org/t/p/original" +(credits.cast[i].profile_path);
    actors.push(new actor(image,name));
    console.log(actors);
    
   }
   i++;
}

let directors=[];
for (let i = 0; i < credits.cast.length; i++) {
    if(credits.cast[i].known_for_department=="Directing") {
        let name=credits.cast[i].name;
        directors.push(name);
    }
  }
  $("#individualHero").css("background-image","url("+backdrop_path+")",);
  $("#movieTitle").html(title);
  let out="";
  directors.forEach(director =>{out+=director+" "})
  $("#director").html(out);
  $("#Synopsis").html(overview);
  actors.forEach(cast =>{ $("#circleContainer").append("<img src="+cast.image+">")})

  //Filtering for genres
  try {
    $("#genreDropdown").on('change', function() {
 let filter = document.getElementById("genreDropdown");
    let selectedID = filter.options[filter.selectedIndex].id;
    let filteredMovies = libraryMovies.filter((movie) => { 
      return movie.genres.includes(parseInt(selectedID));
    });
    console.log(filteredMovies)
    DisplayFilterLibrary(filteredMovies,"#librarycards");
    });
  } catch (error) {
    console.log(error);
  }


  //filtering for year
  function FilterYear() {
    let filterYear = document.getElementById("yearFilter").value;
    let filteredMovies = libraryMovies.filter((movie) => {
      return movie.year == filterYear;
    });
    DisplayLibraryMovies(filteredMovies);
  }

  //filtering for rating
  function FilterRating() {
    let filterRating = parseInt(document.getElementById("ratingFilter").value);
    let filteredMovies = libraryMovies.filter((movie) => {
      return parseInt(movie.rating) <= filterRating;
    });
    DisplayLibraryMovies(filteredMovies);
  }

  //filtering ascending and descending popularity
  function FilterOrder() {
    let filterOrder = document.getElementById("ratingFilter").value;
    if (filterOrder == "Ascending") {
      libraryMovies.sort((a, b) => a - b);
      DisplayLibraryMovies(libraryMovies);
    } else {
      libraryMovies.sort((a, b) => b - a);
      DisplayLibraryMovies(libraryMovies);
    }
  }

  // try {
  //   tempWatchList.forEach((movie) => {
  //     document.getElementById("watchList").innerHTML += `
  //   <div class="col">
  //           <div class="card h-100 p-2" style="border:1px solid #ffffff;">
  //             <div style="height:180px; background:transparent; border:1.5px solid #ffffff;">
  //               <div width="100%" height="100%">
               
  //               </div>
  //             </div>
  //             <div class="card-body p-2">
  //               <h5 class="card-title mb-1" style="font-size:1rem;">${movie.name}</h5>
  //               <p class="card-text mb-2" style="font-size:0.9rem;">${movie.year} R</p>
  //               <div class="d-flex gap-2">
  //                 <button class="btn btn-dark btn-sm">Play</button>
  //                 <button class="btn btn-outline-dark btn-sm">
  //                   Remove from My List
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //   `;
  //   });
  // } catch (error) {}

  //slider home page code

try {
  const wrapper = document.querySelector(".wrapper");
  const carousel = document.querySelector(".movieCarousel");
  const firstCardWidth = carousel.querySelector(".MovieCard").offsetWidth;
  const arrowBtns = document.querySelectorAll(".wrapper i");
  const carouselChildrens = [...carousel.children];
  
  
  let isDragging = false,
    isAutoPlay = false,
    startX,
    startScrollLeft,
    timeoutId;
  
  // Get the number of cards that can fit in the carousel at once
  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
  
  // Insert copies of the last few cards to beginning of carousel for infinite scrolling
  carouselChildrens
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });
  
  // Insert copies of the first few cards to end of carousel for infinite scrolling
  carouselChildrens.slice(0, cardPerView).forEach((card) => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });
  
  // Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");
  
  // Add event listeners for the arrow buttons to scroll the carousel left and right
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id == "left") {
        carousel.scrollLeft -= firstCardWidth;
      } else {
        carousel.scrollLeft += firstCardWidth;
      }
    });
  });
  
  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };
  
  const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };
  
  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };
  
  const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (carousel.scrollLeft === 32) {
      console.log("infinite scroll to left");
  
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (
      Math.ceil(carousel.scrollLeft) ===
      carousel.scrollWidth - carousel.offsetWidth
    ) {
      console.log("infinite scroll to right");
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
  
    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
  };
  
  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
  };
  autoPlay();
  
  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);
  wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  wrapper.addEventListener("mouseleave", autoPlay);
  
} catch (error) {
  
}
//Featured movie slider JS

(function heroSlider() {
  //remove no-js class
  removeClass(document.getElementsByTagName("html")[0], "no-js");

  //Hero Slider - by CodyHouse.co
  function HeroSlider(element) {
    this.element = element;
    this.navigationPrev = this.element.getElementsByClassName(
      "carousel-control-prev"
    )[0];
    this.navigationNext = this.element.getElementsByClassName(
      "carousel-control-next"
    )[0];

    // this.navigationItems = this.navigation.getElementsByTagName('li');
    // this.marker = this.navigation.getElementsByClassName("js-cd-marker")[0];
    this.slides = this.element.getElementsByClassName("js-cd-slide");
    this.slidesNumber = this.slides.length;
    this.newSlideIndex = 0;
    this.oldSlideIndex = 0;
    this.autoplay = hasClass(this.element, "js-cd-autoplay");
    this.autoPlayId;
    this.autoPlayDelay = 5000;
    this.init();
  }

  HeroSlider.prototype.init = function () {
    var self = this;
    //autoplay slider
    this.setAutoplay();
    //listen for the click event on the slider navigation
    this.navigationPrev.addEventListener("click", function (event) {
      if (event.target.tagName.toLowerCase() == "div") return;
      event.preventDefault();
      var selectedSlide = event.target;
      if (hasClass(event.target.parentElement, "cd-selected")) return;
      self.oldSlideIndex = self.newSlideIndex;
      if (self.newSlideIndex <= 0) {
        self.newSlideIndex = self.slidesNumber - 1;
      } else {
        self.newSlideIndex -= 1;
      }
      self.newSlide();
      self.setAutoplay();
    });
    this.navigationNext.addEventListener("click", function (event) {
      if (event.target.tagName.toLowerCase() == "div") return;
      event.preventDefault();
      var selectedSlide = event.target;

      self.oldSlideIndex = self.newSlideIndex;
      if (hasClass(event.target.parentElement, "cd-selected")) return;
      self.oldSlideIndex = self.newSlideIndex;
      if (self.newSlideIndex < self.slidesNumber - 1) {
        self.newSlideIndex += 1;
      } else {
        self.newSlideIndex = 0;
      }
      self.newSlide();
      self.setAutoplay();
    });

    if (this.autoplay) {
      // on hover - pause autoplay
      this.element.addEventListener("mouseenter", function () {
        clearInterval(self.autoPlayId);
      });
      this.element.addEventListener("mouseleave", function () {
        self.setAutoplay();
      });
    }
  };

  HeroSlider.prototype.setAutoplay = function () {
    var self = this;
    if (this.autoplay) {
      clearInterval(self.autoPlayId);
      self.autoPlayId = window.setInterval(function () {
        self.autoplaySlider();
      }, self.autoPlayDelay);
    }
  };

  HeroSlider.prototype.autoplaySlider = function () {
    this.oldSlideIndex = this.newSlideIndex;
    var self = this;
    if (this.newSlideIndex < this.slidesNumber - 1) {
      this.newSlideIndex += 1;
      this.newSlide();
    } else {
      this.newSlideIndex = 0;
      this.newSlide();
    }
  };

  HeroSlider.prototype.newSlide = function (direction) {
    var self = this;
    removeClass(
      this.slides[this.oldSlideIndex],
      "cd-hero__slide--selected cd-hero__slide--from-left cd-hero__slide--from-right"
    );
    addClass(this.slides[this.oldSlideIndex], "cd-hero__slide--is-moving");
    setTimeout(function () {
      removeClass(self.slides[self.oldSlideIndex], "cd-hero__slide--is-moving");
    }, 500);

    for (var i = 0; i < this.slidesNumber; i++) {
      if (i < this.newSlideIndex && this.oldSlideIndex < this.newSlideIndex) {
        addClass(this.slides[i], "cd-hero__slide--move-left");
      } else if (
        i == this.newSlideIndex &&
        this.oldSlideIndex < this.newSlideIndex
      ) {
        addClass(
          this.slides[i],
          "cd-hero__slide--selected cd-hero__slide--from-right"
        );
      } else if (
        i == this.newSlideIndex &&
        this.oldSlideIndex > this.newSlideIndex
      ) {
        addClass(
          this.slides[i],
          "cd-hero__slide--selected cd-hero__slide--from-left"
        );
        removeClass(this.slides[i], "cd-hero__slide--move-left");
      } else if (
        i > this.newSlideIndex &&
        this.oldSlideIndex > this.newSlideIndex
      ) {
        removeClass(this.slides[i], "cd-hero__slide--move-left");
      }
    }
  };

  HeroSlider.prototype.updateNavigationMarker = function () {
    removeClassPrefix(this.marker, "item");
    addClass(
      this.marker,
      "cd-hero__marker--item-" + (Number(this.newSlideIndex) + 1)
    );
  };

  var heroSliders = document.getElementsByClassName("js-cd-hero");
  if (heroSliders.length > 0) {
    for (var i = 0; i < heroSliders.length; i++) {
      (function (i) {
        new HeroSlider(heroSliders[i]);
      })(i);
    }
  }

  function removeClassPrefix(el, prefix) {
    //remove all classes starting with 'prefix'
    var classes = el.className.split(" ").filter(function (c) {
      return c.indexOf(prefix) < 0;
    });
    el.className = classes.join(" ");
  }

  //class manipulations - needed if classList is not supported
  function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    else
      return !!el.className.match(
        new RegExp("(\\s|^)" + className + "(\\s|$)")
      );
  }
  function addClass(el, className) {
    var classList = className.split(" ");
    if (el.classList) el.classList.add(classList[0]);
    else if (!hasClass(el, classList[0])) el.className += " " + classList[0];
    if (classList.length > 1) addClass(el, classList.slice(1).join(" "));
  }
  function removeClass(el, className) {
    var classList = className.split(" ");
    if (el.classList) el.classList.remove(classList[0]);
    else if (hasClass(el, classList[0])) {
      var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
      el.className = el.className.replace(reg, " ");
    }
    if (classList.length > 1) removeClass(el, classList.slice(1).join(" "));
  }
  function toggleClass(el, className, bool) {
    if (bool) addClass(el, className);
    else removeClass(el, className);
  }
})();

})();

function DisplayLibraryCards(movieArray, displayContainerID) {
	movieArray.forEach(movie => {
    let display = "<div class='col'><div class='card h-100'><img src='"+ movie.poster +"' class='card-img-top' alt='Poster'><div class='card-body d-flex flex-column'><h5 class='card-title'>"+movie.title+"</h5><p class='card-text mb-3'>"+movie.year+"</p><div class='mt-auto d-flex gap-2'><button class='btn btn-dark btn-sm'>Play ›</button><button class='btn btn-outline-secondary btn-sm'>Add To My List ›</button></div></div></div></div>"
    $(displayContainerID).append(display);
  });
}

function DisplayFilterLibrary(movieArray, displayContainerID) {
  $(displayContainerID).html("");
	movieArray.forEach(movie => {
    let display = "<div class='col'><div class='card h-100'><img src='"+ movie.poster +"' class='card-img-top' alt='Poster'><div class='card-body d-flex flex-column'><h5 class='card-title'>"+movie.title+"</h5><p class='card-text mb-3'>"+movie.year+"</p><div class='mt-auto d-flex gap-2'><button class='btn btn-dark btn-sm'>Play ›</button><button class='btn btn-outline-secondary btn-sm'>Add To My List ›</button></div></div></div></div>"

    $(displayContainerID).append(display);
  });
}

function DisplayHomePageCards(movieArray, displayContainerID) {
movieArray.forEach(movie => {
		let display = "<li class='MovieCard' onclick='populateMoviePage()'><div class='img'><img src='"+ movie.poster+"' alt='img' draggable='false'></div></li>";
		$(displayContainerID).append(display);
});
}

function DisplayFeaturedMovies(movie, index) {
  let featuredMovieBGID = "FeaturedMovieBackground" + index;
  let featuredMovietitle = "FeaturedMovieTitle" + index;
  let featuredMovieTagline = "FeaturedMovieDesc" + index;

  $("#" + featuredMovieBGID).css(
    "background-image",
    "url(" + movie.backdrop + ")"
  );
  $("#" + featuredMovietitle).text(movie.title);
  $("#" + featuredMovieTagline).text(movie.tagline);
}

