/**
 * Controls the state of the carousel, either playing or paused.
 */
let isPlaying = true;

const carouselElement = document.querySelector('#mainCarousel');
const toggleButton = document.querySelector('#toggleCarousel');
const toggleIcon = document.querySelector('#toggleIcon');
const carouselInstance = new bootstrap.Carousel(carouselElement);

/**
 * Toggles between play and pause states of the carousel.
 */
const togglePlayPause = () => {
    if (isPlaying) {
        carouselInstance.pause();
        toggleIcon.src = '../assets/PlayButton.svg';
    } else {
        carouselInstance.cycle();
        toggleIcon.src = '../assets/PauseButton.svg';
    }
    isPlaying = !isPlaying;
};

// If it is playing, then pause, otherwise play.
toggleButton.addEventListener('click', togglePlayPause);

/**
 * Loads the top three premiere movies into the carousel.
 * @returns {Promise<void>}
 */
async function loadTopRatedMovies() {
    const premiereMovies = await window.fetchPremiereMovies();
    const topThreeMovies = premiereMovies.slice(0, 3);
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');

    topThreeMovies.forEach((movie, index) => {
        const newCarouselItem = createCarouselItem(movie, index === 0);
        carouselInner.appendChild(newCarouselItem);
        
        // Create corresponding indicator button
        const indicatorButton = document.createElement('button');
        indicatorButton.type = 'button';
        indicatorButton.setAttribute('data-bs-target', '#mainCarousel');
        indicatorButton.setAttribute('data-bs-slide-to', index);
        indicatorButton.className = index === 0 ? 'active' : '';
        indicatorButton.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
            indicatorButton.setAttribute('aria-current', 'true');
        }
        carouselIndicators.appendChild(indicatorButton);
    });
}

loadTopRatedMovies();

/**
 * Creates a carousel item element.
 * @param {Object} movie - The movie object containing movie details.
 * @param {boolean} isActive - Whether this item is the active item in the carousel.
 * @returns {HTMLElement} The carousel item element.
 */
function createCarouselItem(movie, isActive) {
    /**
     * Helper function to create a div with a class and text content.
     * @param {string} className - The class name for the div.
     * @param {string} textContent - The text content for the div.
     * @returns {HTMLElement} The created div element.
     */
    function createDiv(className, textContent) {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = textContent;
        return div;
    }

    /**
     * Creates the item container with movie details.
     * @param {Object} movie - The movie object containing movie details.
     * @returns {HTMLElement} The item container element.
     */
    function createItemContainer(movie) {
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-container';

        // Create and append the movie details
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        itemContainer.appendChild(createDiv('movie-duration', releaseYear));
        itemContainer.appendChild(createDiv('movie-rating', movie.rating));
        itemContainer.appendChild(createDiv('movie-title', movie.title));
        itemContainer.appendChild(createDiv('movie-description', movie.overview));

        // Create the movie button group div
        const movieButtonGroup = document.createElement('div');
        movieButtonGroup.className = 'movie-button-group';

        // Create the "Watch Now" button
        const watchNowButton = document.createElement('button');
        watchNowButton.className = 'watch-now';
        watchNowButton.textContent = 'Watch Now';

        // Create the "+ Watch List" button
        const watchLaterButton = document.createElement('button');
        watchLaterButton.className = 'watch-later';
        watchLaterButton.textContent = '+ Watch List';

        // Append buttons to the button group
        movieButtonGroup.appendChild(watchNowButton);
        movieButtonGroup.appendChild(watchLaterButton);

        // Append the button group to the item container
        itemContainer.appendChild(movieButtonGroup);

        return itemContainer;
    }

    // Create the carousel item div
    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item' + (isActive ? ' active' : '');
    carouselItem.style.backgroundImage = `url(${movie.poster})`;
    carouselItem.style.backgroundSize = 'cover';
    carouselItem.style.backgroundPosition = 'center';

    // Create the item container and append it to the carousel item
    const itemContainer = createItemContainer(movie);
    carouselItem.appendChild(itemContainer);

    return carouselItem;
}

/**
 * Creates a movie card element for displaying in the grid.
 * @param {Object} movie - The movie object containing movie details.
 * @returns {HTMLElement} The movie card element.
 */
function createMovieCard(movie) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-3';

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    const img = document.createElement('img');
    img.src = movie.poster;
    img.className = 'card-img-top';
    img.alt = 'Card image';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = movie.title;

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = movie.overview;

    const cardLink = document.createElement('a');
    cardLink.href = '#';
    cardLink.className = 'btn btn-primary';
    cardLink.textContent = 'More Info';

    // Append all elements to card body and card div
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardLink);
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBody);
    colDiv.appendChild(cardDiv);

    return colDiv;
}

/**
 * Loads movies based on the selected category and displays them as cards.
 * @param {string} category - The category of movies to load (e.g., 'popular', 'inTheatres').
 * @returns {Promise<void>}
 */
async function loadMoviesByCategory(category) {
    const movieCardsRow = document.getElementById('movieCardsRow');
    movieCardsRow.innerHTML = ''; // Clear previous cards

    let movies;
    switch (category) {
        case 'popular':
            movies = await window.fetchPopularMovies();
            break;
        case 'inTheatres':
            movies = await window.fetchPremiereMovies();
            break;
        case 'topRated':
            movies = await window.fetchTopRatedMovies();
            break;
        case 'upcoming':
            movies = await window.fetchUpcomingMovies();
            break;
        default:
            movies = [...await window.fetchPopularMovies(), ...await window.fetchPremiereMovies(), ...await window.fetchTopRatedMovies(), ...await window.fetchUpcomingMovies()];
    }

    movies.slice(0, 4).forEach(movie => {
        const newMovieCard = createMovieCard(movie);
        movieCardsRow.appendChild(newMovieCard);
    });
}

function toggleCategory(category) {
    const trendButtons = document.querySelectorAll('.trend-button');
    trendButtons.forEach(button => button.classList.remove('active'));

    const buttonId = category + 'Button';
    document.getElementById(buttonId).classList.add('active');

    const movieCardsRow = document.getElementById('movieCardsRow');
    movieCardsRow.innerHTML = ''; // Clear previous cards

    switch (category) {
        case 'popular':
            window.fetchPopularMovies().then(movies => addMoviesToRow('Popular', movies));
            break;
        case 'inTheatres':
            window.fetchPremiereMovies().then(movies => addMoviesToRow('Premiere', movies));
            break;
        case 'topRated':
            window.fetchTopRatedMovies().then(movies => addMoviesToRow('Top Rated', movies));
            break;
        case 'upcoming':
            window.fetchUpcomingMovies().then(movies => addMoviesToRow('Upcoming', movies));
            break;
        default:
            window.fetchPopularMovies().then(movies => addMoviesToRow('Popular', movies));
            window.fetchPremiereMovies().then(movies => addMoviesToRow('Premiere', movies));
            window.fetchTopRatedMovies().then(movies => addMoviesToRow('Top Rated', movies));
            window.fetchUpcomingMovies().then(movies => addMoviesToRow('Upcoming', movies));
            break;
    }
}

function addMoviesToRow(title, movies) {
    // Create a title element
    const titleElement = document.createElement('h3');
    titleElement.className = 'category-title';
    titleElement.textContent = title;

    // Create a new row for the movies
    const newMovieCardsRow = document.createElement('div');
    newMovieCardsRow.className = 'row movie-cards-row';

    // Populate the new row with the movies
    movies.slice(0, 4).forEach(movie => {
        const newMovieCard = createMovieCard(movie);
        newMovieCardsRow.appendChild(newMovieCard);
    });

    // Get the container and add the title and the movie row
    const mainContainer = document.getElementById('movieCardsRow');
    mainContainer.appendChild(titleElement);
    mainContainer.appendChild(newMovieCardsRow);
}

window.loadMoviesByCategory = loadMoviesByCategory;
window.toggleCategory = toggleCategory;