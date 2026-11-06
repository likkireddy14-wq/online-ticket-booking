
const searchForm = document.getElementById("searchBookingForm");
const bookingsContainer = document.getElementById("bookingsContainer");

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("searchEmail").value.trim();

    bookingsContainer.innerHTML = "<p>Loading your bookings...</p>";

    try {
        const response = await fetch(
            "/api/bookings?email=" + encodeURIComponent(email)
        );

        const bookings = await response.json();

        if (!response.ok) {
            throw new Error(bookings.message || "Unable to load bookings.");
        }

        if (bookings.length === 0) {
            bookingsContainer.innerHTML =
                "<p>No bookings found for this email.</p>";
            return;
        }

        bookingsContainer.innerHTML = "";

        bookings.forEach(booking => {
            const card = document.createElement("div");
            card.className = "movie-card";

            const info = document.createElement("div");
            info.className = "movie-info";

            const details = [
                "Booking ID: " + booking.booking_id,
                "Movie: " + booking.title,
                "Theatre: " + booking.theatre_name,
                "Date: " + booking.show_date,
                "Time: " + booking.show_time,
                "Seats: " + booking.seats,
                "Total Amount: ₹" + booking.total_amount,
                "Status: " + booking.booking_status
            ];

            details.forEach(detail => {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                info.appendChild(paragraph);
            });

            card.appendChild(info);
            bookingsContainer.appendChild(card);
        });

    } catch (error) {
        bookingsContainer.innerHTML = "<p>" + error.message + "</p>";
        console.error(error);
    }
});
