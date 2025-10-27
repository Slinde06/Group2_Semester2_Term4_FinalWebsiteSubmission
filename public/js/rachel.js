class Featured { 
    constructor(title, overview,ID,backdrop) {
        this.title=title;
        this.overview=overview;
        this.ID=ID;
        this.backdrop=backdrop;
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


  }();


