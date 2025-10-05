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
!async function(){
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDU3MzgzY2VjNzAxNjA3ZDU2MzNhM2JhNWE2NWIyOCIsIm5iZiI6MTc1ODA0ODgzMy44MzEsInN1YiI6IjY4YzliMjQxNzEzMjEzNTg2NjgwNTA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJove7Zugq6BpkyvUOYrd2JbApgx3K0lzQRKXoTWVU8'
  }
};

let data = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
  let featured = [];
  for (let i = 0; i < 3; i++) {
    let title= data.results[i].title;
    let ID= data.results[i].id;
    let backdrop= data.results[i].backdrop;
    
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

         let recommendations = await fetch('https://api.themoviedb.org/3/movie/'+featured[1].id+'/recommendations?language=en-US&page=1', options)
         .then(res => res.json())
         .then((result) => {return result})
        .catch(err => console.error(err));
    let recommended = [];
  for (let i = 0; i < recommendations.results.length; i++) {
    let ID= recommendations.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +recommendations.results[i].poster_path;
    recommended.push(new Featured(title,tagline,ID,backdrop));
  }

//toppicks

    let toppicks = await fetch('https://api.themoviedb.org/3/movie/'+featured[1].id+'/recommendations?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let top = [];
  for (let i = 0; i < toppicks.results.length; i++) {
    let ID= toppicks.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +toppicks.results[i].poster_path;
    top.push(new Featured(title,tagline,ID,backdrop));
  }

//trending

    let trending = await fetch('https://api.themoviedb.org/3/movie/'+featured[1].id+'/recommendations?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let trend = [];
  for (let i = 0; i < trending.results.length; i++) {
    let ID= trending.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +trending.results[i].poster_path;
    trend.push(new Featured(title,tagline,ID,backdrop));
  }

//comedy

    let comedy = await fetch('https://api.themoviedb.org/3/movie/'+featured[1].id+'/recommendations?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let genre = [];
  for (let i = 0; i < comedy.results.length; i++) {
    let ID= comedy.results[i].id;
    if (comedy.results.genre_ids.contains(35)) {
          let poster= "https://image.tmdb.org/t/p/original" +comedy.results[i].poster_path;
    genre.push(new Featured(title,tagline,ID,backdrop));
    }

  }

  }();

