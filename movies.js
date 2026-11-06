
async function loadMovies() {
    const container = document.getElementById("movieContainer");

    try {
        const response = await fetch("/api/movies");

        if (!response.ok) {
            throw new Error("Unable to fetch movies");
        }

        const movies = await response.json();

        container.innerHTML = "";

        if (movies.length === 0) {
            container.innerHTML = "<p>No movies available.</p>";
            return;
        }

        movies.forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";

            card.innerHTML = `
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.genre || "Genre not available"} | ${movie.language || "Language not available"}</p>
                    <p>Duration: ${movie.duration || "N/A"} minutes</p>
                    <a href="shows.html?movie_id=${movie.movie_id}" class="book-btn">
                        View Shows
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Unable to load movies. Please try again.</p>";
        console.error(error);
    }
}

loadMovies();
