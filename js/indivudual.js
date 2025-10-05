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
!async function(){
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NDU3MzgzY2VjNzAxNjA3ZDU2MzNhM2JhNWE2NWIyOCIsIm5iZiI6MTc1ODA0ODgzMy44MzEsInN1YiI6IjY4YzliMjQxNzEzMjEzNTg2NjgwNTA3MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZJove7Zugq6BpkyvUOYrd2JbApgx3K0lzQRKXoTWVU8'
  }
};

    let data = await fetch(
            'https://api.themoviedb.org/3/movie/'+ 12 +'?language=en-US', options
        )
        .then((response) => response.json())
        .then((result) => {return result;})
        .catch((err) => console.error(err));

    let title= data.results[i].title;
    let ID= data.results[i].id;
    let backdrop_path= data.results[i].backdrop_path;
    let rating= data.results[i].rating;
    let overview=data.results[i].overview;

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
//recommendations

         let recommendations = await fetch('https://api.themoviedb.org/3/movie/'+12+'/recommendations?language=en-US&page=1', options)
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

    let toppicks = await fetch('https://api.themoviedb.org/3/movie/'+12+'/recommendations?language=en-US&page=1', options)
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

    let trending = await fetch('https://api.themoviedb.org/3/movie/'+12+'/recommendations?language=en-US&page=1', options)
  .then(res => res.json())
  .then((result) => {return result})
  .catch(err => console.error(err));
    let trend = [];
  for (let i = 0; i < trending.results.length; i++) {
    let ID= trending.results[i].id;
    let poster= "https://image.tmdb.org/t/p/original" +trending.results[i].poster_path;
    trend.push(new Featured(title,tagline,ID,backdrop));
  }
}();