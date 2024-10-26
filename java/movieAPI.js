const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer '
    }
};

const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

const fetchMovieDetails = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos`, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch movie details: ${response.status}`);
        }
        const data = await response.json();

        const director = data.credits.crew.find(person => person.job === 'Director')?.name || 'Unknown';
        const cast = data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
        const trailer = data.videos.results.find(video => video.type === 'Trailer')?.key || 'No Trailer';
        const posterUrl = data.poster_path ? `${posterBaseUrl}${data.poster_path}` : 'No Poster Available';

        return {
            id: movieId, 
            title: data.title,
            director,
            cast,
            overview: data.overview,
            rating: data.vote_average,
            poster: posterUrl,
            trailer: `https://www.youtube.com/watch?v=${trailer}`,
            release_date: data.release_date || 'Unknown'
        };
    } catch (error) {
        console.error(`Error fetching details for movie ID ${movieId}:`, error);
        return null; 
    }
};

const fetchMovies = async (url, category) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${category} movies: ${response.status}`);
        }
        const data = await response.json();
    
        const movieDetailsPromises = data.results.slice(0, 15).map(movie => fetchMovieDetails(movie.id));
        const movieDetails = await Promise.all(movieDetailsPromises);
    
        return movieDetails;
    } catch (error) {
        console.error(`Error fetching ${category} movies:`, error);
    }
};

const fetchUpcomingMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
    return await fetchMovies(url, 'Upcoming');
};

const fetchTopRatedMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
    return await fetchMovies(url, 'Top-Rated');
};

const fetchPopularMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US';
    return await fetchMovies(url, 'Popular');
};

const fetchPremiereMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US';
    return await fetchMovies(url, 'Premiere');
};

// Expose functions globally so they can be called from HTML
window.fetchUpcomingMovies = fetchUpcomingMovies;
window.fetchTopRatedMovies = fetchTopRatedMovies;
window.fetchPopularMovies = fetchPopularMovies;
window.fetchPremiereMovies = fetchPremiereMovies;