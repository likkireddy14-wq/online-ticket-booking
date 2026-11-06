
const bookingForm = document.getElementById("bookingForm");
const bookingMessage = document.getElementById("bookingMessage");

const urlParams = new URLSearchParams(window.location.search);
const showId = urlParams.get("show_id");

bookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const seats = Number(document.getElementById("seats").value);

    if (!showId) {
        bookingMessage.textContent = "Please select a show first.";
        return;
    }

    if (!name || !email || seats < 1 || seats > 10) {
        bookingMessage.textContent = "Please enter valid details.";
        return;
    }

    try {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                show_id: Number(showId),
                seats
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Booking failed.");
        }

        bookingMessage.textContent =
            "Booking successful! Booking ID: " + result.booking_id;

        bookingForm.reset();

    } catch (error) {
        bookingMessage.textContent = error.message;
        console.error(error);
    }
});
