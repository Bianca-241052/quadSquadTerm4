(function () {
    let watchList = JSON.parse(localStorage.getItem('watchList')) || []; // Retrieve watchlist from local storage

    // Add movie to watchlist
    function addToWatchList(movie) {
        console.log("Adding to watchlist:", movie); // Debugging

        if (!watchList.some(watchItem => watchItem.id === movie.id)) {
            watchList.push(movie);
            localStorage.setItem('watchList', JSON.stringify(watchList)); // Update local storage
            renderWatchList();
        } else {
            console.log("Movie already in watchlist:", movie.title);
        }
    }

    // Remove movie from watchlist
    function removeFromWatchList(movieId) {
        console.log("Removing from watchlist, Movie ID:", movieId); // Debugging

        watchList = watchList.filter(watchItem => watchItem.id !== movieId);
        localStorage.setItem('watchList', JSON.stringify(watchList)); // Update local storage
        renderWatchList();
    }

    // Render watchlist
    function renderWatchList() {
        console.log("Rendering watchlist"); // Debugging
        const watchListContainer = document.getElementById('watchListContainer');
        watchListContainer.innerHTML = '';

        if (watchList.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = "Your watchlist is currently empty.";
            watchListContainer.appendChild(emptyMessage);
            return;
        }

        watchList.forEach(movie => {
            const movieCard = createMovieCard(movie);
            const watchListButton = movieCard.querySelector('.movie-btn');
            watchListButton.textContent = 'Remove'; // Change button text to 'Remove'
            watchListButton.onclick = () => removeFromWatchList(movie.id);
            watchListContainer.appendChild(movieCard);
        });
    }

    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.dataset.id = movie.id;

        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster" class="movie-poster">
            <h3 class="card-title">${movie.title}</h3>
            <p class="movie-rating">Rating: ${movie.rating}</p>
            <p class="movie-year">Released: ${movie.release_date}</p>
            <button class="movie-btn">Remove</button> <!-- Default button for remove -->
        `;

        return card;
    }

    // Attach event listeners for adding to watchlist
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('watch-later') || event.target.classList.contains('movie-btn')) {
            const movieCard = event.target.closest('.card');
            if (!movieCard) {
                console.error("No .card element found for the clicked element:", event.target);
                return;
            }

            const movie = {
                id: parseInt(movieCard.dataset.id, 10),
                title: movieCard.querySelector('.card-title') ? movieCard.querySelector('.card-title').textContent : 'Untitled',
                rating: movieCard.querySelector('.movie-rating') ? parseFloat(movieCard.querySelector('.movie-rating').textContent.split(' ')[1]) : 0,
                release_date: movieCard.querySelector('.movie-year') ? movieCard.querySelector('.movie-year').textContent : 'N/A',
                poster: movieCard.querySelector('img') ? movieCard.querySelector('img').src : ''
            };

            console.log("Movie data extracted:", movie);

            if (event.target.textContent === '+ Watch List') {
                addToWatchList(movie);
                event.target.textContent = 'Remove';
                event.target.onclick = () => removeFromWatchList(movie.id);
            } else if (event.target.textContent === 'Remove') {
                removeFromWatchList(movie.id);
            }
        }
    });

    // Initial render
    renderWatchList();
})();
