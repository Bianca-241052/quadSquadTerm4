import { getWatchList, removeFromWatchList, isInWatchList } from './Cookies.js';

/**
 * Loads the watchlist and displays the movies in it.
 * @returns {Promise<void>}
 */
async function loadWatchList() {
    const watchListIds = getWatchList();
    const moviePromises = watchListIds.map(id => window.fetchMovieDetails(id, true, true));
    const watchListMovies = await Promise.all(moviePromises);

    const watchListContainer = document.getElementById('watchListContainer');
    watchListContainer.innerHTML = ''; // Clear previous content

    watchListMovies.forEach(movie => {
        const movieCard = createWatchListCard(movie);
        watchListContainer.appendChild(movieCard);
    });
}

/**
 * Creates a movie card for the watchlist page.
 * @param {MovieDetails} movie - The movie object containing movie details.
 * @returns {HTMLElement} The movie card element.
 */
function createWatchListCard(movie) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card col-sm-3';

    cardDiv.addEventListener('click', () => {
        window.location.href = `/html/individual.html?id=${movie.id}`;
    });

    const img = document.createElement('img');
    img.src = movie.poster;
    img.className = 'card-img-top';
    img.alt = 'Card image';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = movie.title;

    const cardDetails = document.createElement('div');
    cardDetails.className = 'd-flex justify-content-between mt-2';

    const movieYear = document.createElement('span');
    movieYear.textContent = new Date(movie.release_date).getFullYear() || 'N/A';

    const movieRating = document.createElement('span');
    movieRating.textContent = 'Rating: ' + Math.round(movie.rating * 10) / 10;

    cardDetails.appendChild(movieYear);
    cardDetails.appendChild(movieRating);

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-btn';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('data-id', movie.id);

    removeButton.onclick = function (event) {
        event.stopPropagation();
        removeFromWatchList(movie.id);
        loadWatchList(); // Reload the watchlist after removal
    };

    // Append all elements to card body and card div
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(removeButton);
    cardBody.appendChild(cardDetails);
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBody);

    return cardDiv;
}

// Load the watchlist when the page loads
window.onload = loadWatchList;
