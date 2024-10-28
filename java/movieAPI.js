/**
 * Options used for fetch requests to the Movie Database API.
 * Contains method type and authorization headers.
 */
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDE4OGY5N2I3OTQ3YmIxM2E3N2FhMjgzM2YxZWNiZSIsIm5iZiI6MTcyOTc1OTI5Mi42ODUxNDcsInN1YiI6IjY3MTBjNjFkMWI5MTJhZGQyZWRiY2QwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.79Xo8DabsJftkgYvH8HWG_B108-bF0Km9kTfh2Xycw0'
    }
};

/**
 * Base URL for accessing movie poster images.
 */
const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Easier for Visual Studio to work with:
/**
 * @typedef {Object} MovieDetails
 * @property {number} id - The movie ID.
 * @property {string} title - The title of the movie.
 * @property {string} overview - A brief overview of the movie's plot.
 * @property {number} rating - Average rating of the movie.
 * @property {string} poster - URL to the movie poster image.
 * @property {string} release_date - The release date of the movie, formatted as 'YYYY-MM-DD'.
 */


/**
 * Fetch details for a specific movie by ID.
 * @param {number} movieId - The ID of the movie to fetch details for.
 * @returns {Promise<any>} An object containing movie details or null if an error occurred.
 */
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

/**
 * Fetch a list of movies from a given API URL and category.
 * @param {string} url - The API URL to fetch movies from.
 * @param {string} category - The category of movies being fetched (e.g., 'Upcoming', 'Top-Rated').
 * @returns {Promise<Array<MovieDetails>>} An array of movie details objects.
 */
const fetchMovies = async (url, category) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${category} movies: ${response.status}`);
        }
        const data = await response.json();
    
        const movieDetails = data.results.slice(0, 15).map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            rating: movie.vote_average,
            poster: movie.poster_path ? `${posterBaseUrl}${movie.poster_path}` : 'No Poster Available',
            release_date: movie.release_date || 'Unknown'
        }));
    
        return movieDetails;
    } catch (error) {
        console.error(`Error fetching ${category} movies:`, error);
    }
};

/**
 * Fetch upcoming movies.
 * @returns {Promise<Array<MovieDetails>>} An array of upcoming movie details.
 */
const fetchUpcomingMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/upcoming?region=za&language=en-US&page=1';
    return await fetchMovies(url, 'Upcoming');
};

/**
 * Fetch top-rated movies.
 * @returns {Promise<Array<MovieDetails>>} An array of top-rated movie details.
 */
const fetchTopRatedMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/top_rated?region=za&language=en-US&page=1';
    return await fetchMovies(url, 'Top-Rated');
};

/**
 * Fetch popular movies.
 * @returns {Promise<Array<MovieDetails>>} An array of popular movie details.
 */
const fetchPopularMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/popular?region=za&language=en-US';
    return await fetchMovies(url, 'Popular');
};

/**
 * Fetch movies that are currently playing in theaters.
 * @returns {Promise<Array<MovieDetails>>} An array of premiere movie details.
 */
const fetchPremiereMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?region=za&language=en-US';
    return await fetchMovies(url, 'Premiere');
};

// Expose functions globally so they can be called from HTML
window.fetchUpcomingMovies = fetchUpcomingMovies;
window.fetchTopRatedMovies = fetchTopRatedMovies;
window.fetchPopularMovies = fetchPopularMovies;
window.fetchPremiereMovies = fetchPremiereMovies;