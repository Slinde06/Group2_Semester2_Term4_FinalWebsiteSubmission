class HomepageMovies {
  constructor(title, ID, poster, year, genres, rating) {
    this.id = ID;
    this.title = title;
    this.year = year;
    this.poster = poster;
    this.genres = genres;
    this.rating = rating;
  }
}

class actor {
  constructor(image, name) {
    this.image = image;
    this.name = name;
  }
}

class WatchList {
  constructor(id, name, year, image, genres, rating) {
    this.id = id;
    this.title = name;
    this.year = year;
    this.poster = image;
    this.genres = genres;
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
  constructor(title, id, backdrop, tagline, poster, year, genres, rating) {
    this.tagline = tagline;
    this.title = title;
    this.id = id;
    this.backdrop = backdrop;
    this.genres = genres;
    this.rating = rating;
    this.year = year;
    this.poster = poster;
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
      let out = "<option id='" + genre.id + "'>" + genre.name + "</option>";
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
    let poster =
      "https://image.tmdb.org/t/p/w500" + featured.results[i].poster_path;
    let genres = featured.results[i].genre_ids;
    let year = featured.results[i].release_date.slice(0, 4);
    let rating = featured.results[i].vote_average;

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
      (window["movie_" + i] = new Featured(
        title,
        id,
        backdrop,
        tagline,
        poster,
        year,
        genres,
        rating
      ))
    );
  }
  featuredMovies.forEach(DisplayFeaturedMovies);

  //Library page and popular movies API calls
  let library = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));

  let popularMovies = [];
  let libraryMovies = [];

  for (let i = 0; i < library.results.length; i++) {
    let title = library.results[i].title;
    let id = library.results[i].id;
    let image =
      "https://image.tmdb.org/t/p/w500" + library.results[i].poster_path;
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
    popularMovies.push(
      new HomepageMovies(title, id, image, year, genres, rating)
    );
  }

  DisplayLibraryCards(
    libraryMovies,
    "#librarycards",
    "Add to My List",
    "AddToList"
  );

  let watchList = JSON.parse(localStorage.getItem("watchList"));

  if (watchList == null) {
    DisplayHomePageCards(libraryMovies, "#continueWatchingContainer");
  } else {
    DisplayHomePageCards(watchList, "#continueWatchingContainer");
  }

  //load more data
  let loadMore = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=2",
    options
  )
    .then((response) => response.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let loadMoreData = [];

  for (let i = 0; i < loadMore.results.length; i++) {
    let title = loadMore.results[i].title;
    let id = loadMore.results[i].id;
    let image =
      "https://image.tmdb.org/t/p/w500" + loadMore.results[i].poster_path;
    let genres = loadMore.results[i].genre_ids;
    let year = loadMore.results[i].release_date.slice(0, 4);
    let rating = loadMore.results[i].vote_average;

    loadMoreData.push(
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

  $("#loadbuttonlibrary").click(function () {
    loadMoreData.forEach((movie) => {
      libraryMovies.push(movie);
    });
    DisplayFilterLibrary(libraryMovies, "#librarycards", "Add to My List");
    $("#loadbuttonlibrary").hide();
  });

  //top picks API call

  let url;
  let recommendationID;
  if (watchList != null) {
    recommendationID = watchList[0].id;
  }
  if (recommendationID == null) {
    url =
      "https://api.themoviedb.org/3/movie/" +
      11 +
      "/recommendations?language=en-US&page=1";
  } else {
    url =
      "https://api.themoviedb.org/3/movie/" +
      recommendationID +
      "/recommendations?language=en-US&page=1";
  }

  let toppicks = await fetch(url, options)
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let top = [];
  for (let i = 0; i < toppicks.results.length; i++) {
    let title = toppicks.results[i].title;
    let ID = toppicks.results[i].id;
    let genres = toppicks.results[i].genre_ids;
    let year = toppicks.results[i].release_date.slice(0, 4);
    let rating = toppicks.results[i].vote_average;
    let poster =
      "https://image.tmdb.org/t/p/original" + toppicks.results[i].poster_path;
    top.push(new HomepageMovies(title, ID, poster, year, genres, rating));
  }
  DisplayHomePageCards(top, "#topPicksContainer");

  //trending APi call

  let trending = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  )
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => console.error(err));
  let trend = [];
  for (let i = 0; i < trending.results.length; i++) {
    let title = trending.results[i].title;
    let ID = trending.results[i].id;
    let poster =
      "https://image.tmdb.org/t/p/original" + trending.results[i].poster_path;
    let genres = trending.results[i].genre_ids;
    let year = trending.results[i].release_date.slice(0, 4);
    let rating = trending.results[i].vote_average;
    trend.push(new HomepageMovies(title, ID, poster, year, genres, rating));
  }
  DisplayHomePageCards(trend, "#trendingContainer");

  //comedy API call
  let genre = [];

  for (let i = 0; i < libraryMovies.length; i++) {
    let title = libraryMovies[i].title;
    let ID = libraryMovies[i].id;
    let genres = libraryMovies[i].genres;
    let year = libraryMovies[i].year;
    let rating = libraryMovies[i].rating;
    if (libraryMovies[i].genres.includes(35)) {
      let poster = libraryMovies[i].poster;
      genre.push(new HomepageMovies(title, ID, poster, genres, year, rating));
    }
  }
  DisplayHomePageCards(genre, "#genreContainer");

  //Individual movie pages
  var individualID;

  try {
    individualID = localStorage.getItem("individualID");

    let individual = await fetch(
      "https://api.themoviedb.org/3/movie/" + individualID + "?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err));

    let title = individual.title;
    let ID = individual.id;
    let backdrop_path =
      "https://image.tmdb.org/t/p/original" + individual.backdrop_path;
    let rating = individual.rating;
    let overview = individual.overview;
    let genres = [];
    for (let i = 0; i < individual.genres.length; i++) {
      genres.push(individual.genres[i].id);
    }
    let poster = "https://image.tmdb.org/t/p/original"+individual.poster_path;
    let year = individual.release_date.slice(0, 4);

    individualDetails = new Library(title,ID,genres,poster,year,rating);

    let credits = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        individualID +
        "/credits?language=en-US",
      options
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err));
    let actors = [];
    let i = 0;
    while (i < credits.cast.length && actors.length <= 4) {
      if (credits.cast[i].known_for_department == "Acting") {
        let name = credits.cast[i].name;
        let image =
          "https://image.tmdb.org/t/p/original" + credits.cast[i].profile_path;
        actors.push(new actor(image, name));
      }
      i++;
    }

    let directors = [];
    for (let i = 0; i < credits.cast.length; i++) {
      if (credits.cast[i].known_for_department == "Directing") {
        let name = credits.cast[i].name;
        directors.push(name);
      }
    }
    $("#individualHero").css("background-image", "url(" + backdrop_path + ")");
    $("#movieTitle").html(title);
    let out = "";
    directors.forEach((director) => {
      out += director + " ";
    });
    $("#director").html(out);
    $("#Synopsis").html(overview);
    actors.forEach((cast) => {
      $("#circleContainer").append("<img src=" + cast.image + ">");
    });

    // populate rating value next to the star (vote_average is out of 10 on TMDB)
    try {
      const vote =
        individual.vote_average !== undefined ? individual.vote_average : null;
      if (vote !== null) {
        $("#ratingValue").text(vote.toFixed(1) + " / 10");
      } else {
        $("#ratingValue").text("- / 10");
      }
    } catch (e) {
      console.error("rating populate error", e);
    }
    actors.forEach((cast) => {
      $("#actorImageContainer").append(
        "<div class='actorImage'><img src ='" +
          cast.image +
          "' class='actorImg'></div>"
      );
    });
    $("#individualAdd").click((e)=>{
      e.preventDefault();
      AddToList(individualDetails);
      console.log("added to list");
    })

    let similar = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        individualID +
        "/recommendations?language=en-US&page=1'",
      options
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err));
    let similarMovies = [];

    for (let i = 0; i < similar.results.length; i++) {
      let title = similar.results[i].title;
      let ID = similar.results[i].id;
      let genres = similar.results[i].genre_ids;
      let year = similar.results[i].release_date.slice(0, 4);
      let rating = similar.results[i].vote_average;
      let poster =
        "https://image.tmdb.org/t/p/original" + similar.results[i].poster_path;
      similarMovies.push(
        new HomepageMovies(title, ID, poster, year, genres, rating)
      );
    }
    DisplayHomePageCards(similarMovies, "#similiarContainer");
  } catch (error) {}

  //Filtering for genres
  try {
    $("#genreDropdown").on("change", function () {
      let filter = document.getElementById("genreDropdown");
      let selectedID = filter.options[filter.selectedIndex].id;
      let filteredMovies = libraryMovies.filter((movie) => {
        return movie.genres.includes(parseInt(selectedID));
      });
      if (filteredMovies.length == 0) {
      } else {
        if (window.location.href == "library.html") {
          DisplayFilterLibrary(
            libraryMovies,
            "#librarycards",
            "Add to My List"
          );
        } else {
          DisplayFilterLibrary(
            libraryMovies,
            "#watchListCards",
            "Remove from List",
            "RemoveFromList"
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  //filtering for rating
  try {
    $("#ratingDropdown").on("change", function () {
      let filter = document.getElementById("ratingDropdown");
      let selectedRating = filter.value;
      let filteredMovies = libraryMovies.filter((movie) => {
        return movie.rating >= parseInt(selectedRating);
      });
      if (filteredMovies.length == 0) {
      } else {
        if (window.location.href == "library.html") {
          DisplayFilterLibrary(
            libraryMovies,
            "#librarycards",
            "Add to My List"
          );
        } else {
          DisplayFilterLibrary(
            libraryMovies,
            "#watchListCards",
            "Remove from List",
            "RemoveFromList"
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  //filtering for year
  try {
    $("#yearDropdown").on("change", function () {
      let filter = document.getElementById("yearDropdown");
      let selectedYear = filter.value;
      let filteredMovies = libraryMovies.filter((movie) => {
        return movie.year == parseInt(selectedYear);
      });
      if (filteredMovies.length == 0) {
      } else {
        if (window.location.href == "library.html") {
          DisplayFilterLibrary(
            libraryMovies,
            "#librarycards",
            "Add to My List"
          );
        } else {
          DisplayFilterLibrary(
            libraryMovies,
            "#watchListCards",
            "Remove from List",
            "RemoveFromList"
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  //filtering for order
  try {
    $("#popularityDropdown").on("change", function () {
      let filter = document.getElementById("popularityDropdown");
      let selectedOrder = filter.value;
      if (selectedOrder === "Oldest") {
        libraryMovies.sort((a, b) => a.year - b.year);
        if (window.location.href == "library.html") {
          DisplayFilterLibrary(
            libraryMovies,
            "#librarycards",
            "Add to My List"
          );
        } else {
          DisplayFilterLibrary(
            libraryMovies,
            "#watchListCards",
            "Remove from List",
            "RemoveFromList"
          );
        }
      } else {
        libraryMovies.sort((a, b) => b.year - a.year);

        if (window.location.href == "library.html") {
          DisplayFilterLibrary(
            libraryMovies,
            "#librarycards",
            "Add to My List",
            "AddToList"
          );
        } else {
          DisplayFilterLibrary(
            libraryMovies,
            "#watchListCards",
            "Remove from List",
            "RemoveFromList"
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }

  //slider adapted JQuery code

  try {
    //for loop is used to make every carousel only work with it's own buttons
    for (let i = 0; i < 4; i++) {
      const wrapper = document.querySelector(".wrapper" + i);
      const carousel = document.querySelector(".movieCarousel" + i);
      const firstCardWidth = carousel.querySelector(".MovieCard").offsetWidth;
      const arrowBtns = document.querySelectorAll(".wrapper" + i + " i");
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
        if (carousel.scrollLeft <= 32) {
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
        timeoutId = setTimeout(
          () => (carousel.scrollLeft += firstCardWidth),
          2500
        );
      };
      autoPlay();

      carousel.addEventListener("mousedown", dragStart);
      carousel.addEventListener("mousemove", dragging);
      document.addEventListener("mouseup", dragStop);
      carousel.addEventListener("scroll", infiniteScroll);
      wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
      wrapper.addEventListener("mouseleave", autoPlay);
    }
  } catch (error) {
    console.log(error);
  }

  //Featured movie slider JQuery JS
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
        removeClass(
          self.slides[self.oldSlideIndex],
          "cd-hero__slide--is-moving"
        );
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

  function DisplayFeaturedMovies(movie, index) {
    let featuredMovieBGID = "FeaturedMovieBackground" + index;
    let featuredMovietitle = "FeaturedMovieTitle" + index;
    let featuredMovieTagline = "FeaturedMovieDesc" + index;
    let featuredMovieView = "FeaturedMovieView" + index;
    let featuredMovieAdd = "FeaturedMovieAdd" + index;

    $("#" + featuredMovieView).click((e) => {
      e.preventDefault;
      PopulateMoviePage(movie.id);
    });
    $("#" + featuredMovieAdd).click((e) => {
      e.preventDefault;
      console.log(movie.id);

      AddToList(movie);
    });

    $("#" + featuredMovieBGID).css(
      "background-image",
      "url(" + movie.backdrop + ")",
      "background",
      "no-repeat",
      "background-size",
      "cover"
    );
    $("#" + featuredMovietitle).text(movie.title);
    $("#" + featuredMovieTagline).text(movie.tagline);
  }
})(); //async end

//Display Functions
function DisplayLibraryCards(
  movieArray,
  displayContainerID,
  button,
  buttonFunction
) {
  movieArray.forEach((movie) => {
    let movieToAdd = movie;
    let display =
      "<div class='col'><div class='card h-100'><img src='" +
      movie.poster +
      "' class='card-img-top' alt='Poster'><div class='card-body d-flex flex-column'><h5 class='card-title'>" +
      movie.title +
      "</h5><p class='card-text mb-3'>" +
      movie.year +
      "</p><div class='mt-auto d-flex gap-2'><button class='btn btn-dark btn-sm' onclick='PopulateMoviePage(" +
      movie.id +
      ")'>Play ›</button><button onclick='" +
      buttonFunction +
      "(" +
      JSON.stringify(movie) +
      ")' class='btn btn-outline-secondary btn-sm'>" +
      button +
      "›</button></div></div></div></div>";
    $(displayContainerID).append(display);
  });
}

function DisplayFilterLibrary(
  movieArray,
  displayContainerID,
  button,
  buttonFunction
) {
  $(displayContainerID).html("");
  movieArray.forEach((movie) => {
    let display =
      "<div class='col'><div class='card h-100'><img src='" +
      movie.poster +
      "' class='card-img-top' alt='Poster'><div class='card-body d-flex flex-column'><h5 class='card-title'>" +
      movie.title +
      "</h5><p class='card-text mb-3'>" +
      movie.year +
      "</p><div class='mt-auto d-flex gap-2'><button class='btn btn-dark btn-sm' onclick='PopulateMoviePage(" +
      movie.id +
      ")'>Play ›</button><button onclick='" +
      buttonFunction +
      "(" +
      JSON.stringify(movie) +
      ")' class='btn btn-outline-secondary btn-sm'>" +
      button +
      "›</button></div></div></div></div>";

    $(displayContainerID).append(display);
  });
}

function DisplayHomePageCards(movieArray, displayContainerID) {
  movieArray.forEach((movie) => {
    let display =
      "<div class='cardContainer'><li class='MovieCard' onclick='PopulateMoviePage(" +
      movie.id +
      ")'><div class='img'><img src='" +
      movie.poster +
      "' alt='img' draggable='false'></div></li><div class='imageOverlay'>" +
      movie.title +
      "</div></div>";
    $(displayContainerID).append(display);
  });
}

function PopulateMoviePage(movieId) {
  localStorage.setItem("individualID", movieId);

  window.location.href = "../pages/individual.html";
}

function AddToList(movieDetails) {
  let watchList = [];
  try {
    watchList = JSON.parse(localStorage.getItem("watchList"));
    if (watchList == null) {
      watchList = [];
    }
  } catch (error) {
    console.log(error);
  }
  if (watchList.find((movie) => movie.id == movieDetails.id)) {
    console.log("already in list");
  } else {
    watchList.push(
      new WatchList(
        movieDetails.id,
        movieDetails.title,
        movieDetails.year,
        movieDetails.poster,
        movieDetails.genres,
        movieDetails.rating
      )
    );
    console.log("added item to list");
  }

  localStorage.setItem("watchList", JSON.stringify(watchList));
}

function populateWatchListPage() {
  let watchList = JSON.parse(localStorage.getItem("watchList"));
  DisplayLibraryCards(
    watchList,
    "#watchListCards",
    "Remove from List",
    "RemoveFromList",
    "RemoveFromList"
  );
}

function RemoveFromList(movie) {
  let watchList = JSON.parse(localStorage.getItem("watchList"));
  toRemove = watchList.findIndex((movies) => movies.id == movie.id);
  watchList.splice(toRemove, 1);
  DisplayFilterLibrary(
    watchList,
    "#watchListCards",
    "Remove from List",
    "RemoveFromList",
    "RemoveFromList"
  );
  localStorage.setItem("watchList", JSON.stringify(watchList));
}


function populateHome(){
  let username = localStorage.getItem("username");
  $("#welcomeText").html("Welcome Back, " + username +"!");
}


// leandre sign in/ sign up code

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = () => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
};
loginBtn.onclick = () => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
};
signupLink.onclick = () => {
  signupBtn.click();
  return false;
};
