
async function loadShows() {
    const container = document.getElementById("showsContainer");

    try {
        const response = await fetch("/api/shows");

        if (!response.ok) {
            throw new Error("Unable to fetch shows");
        }

        const shows = await response.json();

        container.innerHTML = "";

        if (shows.length === 0) {
            container.innerHTML = "<p>No shows available.</p>";
            return;
        }

        shows.forEach(show => {
            const card = document.createElement("div");
            card.className = "movie-card";

            card.innerHTML = `
                <div class="movie-info">
                    <h3>${show.title}</h3>
                    <p>Theatre: ${show.theatre_name}</p>
                    <p>Date: ${show.show_date}</p>
                    <p>Time: ${show.show_time}</p>
                    <p>Ticket Price: ₹${show.ticket_price}</p>
                    <a href="booking.html?show_id=${show.show_id}" class="book-btn">
                        Book Tickets
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Unable to load shows.</p>";
        console.error(error);
    }
}

loadShows();
