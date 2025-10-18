class Featured { 
    constructor(title, overview,ID,backdrop) {
        this.title=title;
        this.overview=overview;
        this.ID=ID;
        this.backdrop=backdrop;
    }
}
class HomepageMovies {
  constructor(ID,poster) {
        this.ID=ID;
        this.poster=poster;
  }
}

class actor {
    constructor(image,name) {
        this.image=image;
        this.name=name;
    }
}


//API functions
!async function(){
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDU3MzgzY2VjNzAxNjA3ZDU2MzNhM2JhNWE2NWIyOCIsIm5iZiI6MTc1ODA0ODgzMy44MzEsInN1YiI6IjY4YzliMjQxNzEzMjEzNTg2NjgwNTA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJove7Zugq6BpkyvUOYrd2JbApgx3K0lzQRKXoTWVU8'
  }
};

//featured movies API call
let feature = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
  
  
  let featured = [];

  for (let i = 0; i < 3; i++) {
    let title= feature.results[i].title;
    let ID= feature.results[i].id;
    let backdrop= feature.results[i].backdrop;
    
        let movieDetails = await fetch(
            'https://api.themoviedb.org/3/movie/'+ ID +'?language=en-US', options
        )
          .then((response) => response.json())
          .then((result) => {return result;})
          .catch((err) => console.error(err));

    let tagline = movieDetails.tagline;
    featured.push(new Featured(title,tagline,ID,backdrop));
  }

//recommendations

  let recommendations = await fetch('https://api.themoviedb.org/3/movie/12/recommendations?language=en-US&page=1', options)
         .then(res => res.json())
         .then((result) => {return result})
        .catch(err => console.error(err));
  
  
  let recommended = [];
  
  for (let i = 0; i < recommendations.results.length; i++) {
    let ID= recommendations.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +recommendations.results[i].poster_path;
    recommended.push(new HomepageMovies(ID,poster));
  }

//toppicks

    let toppicks = await fetch('https://api.themoviedb.org/3/movie/12/recommendations?language=en-US&page=1' , options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let top = [];
  for (let i = 0; i < toppicks.results.length; i++) {
    let ID= toppicks.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +toppicks.results[i].poster_path;
    top.push(new HomepageMovies(ID,poster));
  }

//trending

    let trending = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let trend = [];
  for (let i = 0; i < trending.results.length; i++) {
    let ID= trending.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +trending.results[i].poster_path;
    trend.push(new HomepageMovies(ID,poster));
  }

//comedy

  let comedy = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(res => res.json())
    .then((result) => {return result})
    .catch(err => console.error(err));
    
  let genre = [];
  
  for (let i = 0; i < comedy.results.length; i++) {
    let ID= comedy.results[i].id;
    if (comedy.results[i].genre_ids.indexOf(35) != null) {
      let poster= "https://image.tmdb.org/t/p/original" +comedy.results[i].poster_path;
      genre.push(new HomepageMovies(ID,poster));
    }

  }



  //Individual movie pages

  let data = await fetch(
            'https://api.themoviedb.org/3/movie/'+ 12 +'?language=en-US', options
        )
        .then((response) => response.json())
        .then((result) => {return result;})
        .catch((err) => console.error(err));

    let title= data.title;
    let ID= data.id;
    let backdrop_path= data.backdrop_path;
    let rating= data.rating;
    let overview=data.overview;

   let credits = await fetch(
            'https://api.themoviedb.org/3/movie/12/credits?language=en-US', options
        )
        .then((response) => response.json())
        .then((result) => {return result;})
        .catch((err) => console.error(err)); 
let actors =[];

for (let i = 0; i < 4; i++) {
   if (credits.cast[i].known_for_department=="Acting") {
    let name=credits.cast[i].name;
    let image="https://image.tmdb.org/t/p/original" +(credits.cast[i].profile_path);
    actors.push(new actor(image,name));
   }
    
}
let directors=[];
for (let i = 0; i < credits.cast.length; i++) {
    if(credits.cast[i].known_for_department=="Directing") {
        let name=credits.cast[i].name;
        directors.push(name);
    }
    
}
  }();


  //slider code

  $('')
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".movieCarousel");
const firstCardWidth = carousel.querySelector(".MovieCard").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = false, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id == "left") {
          carousel.scrollLeft -= firstCardWidth    
        } else {
          carousel.scrollLeft += firstCardWidth 
        }

    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if((carousel.scrollLeft) === 32) {
      console.log("infinite scroll to left");
      
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
      console.log("infinite scroll to right");
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

