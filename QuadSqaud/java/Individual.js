const id = new URLSearchParams(window.location.search).get("id");
if(id) {
    window.fetchMovieDetails(id, true, true).then(movie => {
        populateMovieDetails(movie);
    })
}

function populateMovieDetails(movie) {
    // Populate the movie poster
    const posterElement = document.getElementById("moviePoster");
    posterElement.src = movie.poster;
    posterElement.alt = movie.title + " Poster";

    // Populate the title
    document.getElementById("movieTitle").textContent = movie.title;

    // Populate the director
    document.getElementById("movieDirector").textContent = movie.director;

    // Populate the cast
    document.getElementById("movieCast").textContent = movie.cast;

    // Populate the overview
    document.getElementById("movieOverview").textContent = movie.overview;

    // Populate the rating
    document.getElementById("movieRating").textContent = movie.rating;

    // Set the trailer URL
    const trailerButton = document.getElementById("trailer-button");
    trailerButton.addEventListener('click', () => {
        window.open(movie.trailer, '_blank');
    });
    
}