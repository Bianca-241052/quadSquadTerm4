import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDbmD4rHZbcoIZwSkG03EBaTCCPu3oiQqI",
    authDomain: "quadsquad-deb87.firebaseapp.com",
    projectId: "quadsquad-deb87",
    storageBucket: "quadsquad-deb87.appspot.com",
    messagingSenderId: "1094931551145",
    appId: "1:1094931551145:web:679927d51ce598c8dd2ab8"
  };
 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// Function to save movie to Firebase under the logged-in user's watchlist
async function saveMovieToFirebase(movie) {
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        
        try {
            // Reference to the user's watchlist sub-collection
            const userWatchlistRef = collection(db, `users/${userId}/watchlist`);
            
            // Add the movie data to the watchlist
            await addDoc(userWatchlistRef, {
                id: movie.id,
                title: movie.title,
                director: movie.director,
                cast: movie.cast,
                overview: movie.overview,
                rating: movie.rating,
                poster: movie.poster,
                trailer: movie.trailer,
                release_date: movie.release_date
            });

            console.log(`Movie "${movie.title}" saved to watchlist for user: ${userId}`);
        } catch (error) {
            console.error("Error adding movie to Firebase:", error);
        }
    } else {
        console.log("User is not logged in.");
    }
}

// Listen for user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`User is logged in with UID: ${user.uid}`);
    } else {
        console.log("No user is logged in.");
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        // Now you can call the save function with the user ID
    } else {
        console.log("No user is signed in.");
    }
});

function createMovieCard(movie, showFullDate = false) {
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

    const cardDetails = document.createElement('div');
    cardDetails.className = 'd-flex justify-content-between mt-2';

    const movieYear = document.createElement('span');
    movieYear.textContent = showFullDate ? movie.release_date : new Date(movie.release_date).getFullYear();

    const movieRating = document.createElement('span');
    movieRating.textContent = 'Rating: ' + Math.round(movie.rating * 10) / 10;

    cardDetails.appendChild(movieYear);
    cardDetails.appendChild(movieRating);

    const watchListButton = document.createElement('button');
    watchListButton.className = 'movie-btn';
    watchListButton.textContent = '+ Watch List';
    
    // Add event listener to save the movie for the logged-in user
    watchListButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
            saveMovieToFirebase(movie, user.uid);
        } else {
            console.log("User is not logged in.");
            // Optionally, prompt user to log in here
        }
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(watchListButton);
    cardBody.appendChild(cardDetails);
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBody);
    colDiv.appendChild(cardDiv);

    return colDiv;
}

service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/watchlist/{movieId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }