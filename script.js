
const searchForm = document.getElementById("searchForm");
const destinationInput = document.getElementById("destination");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const guestsInput = document.getElementById("guests");

const hotelCards = [...document.querySelectorAll(".hotel-card")];
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

const bookingDialog = document.getElementById("bookingDialog");
const bookingSummary = document.getElementById("bookingSummary");
const confirmBooking = document.getElementById("confirmBooking");

let selectedBooking = null;

const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

checkinInput.min = todayString;
checkoutInput.min = todayString;

checkinInput.addEventListener("change", () => {
    checkoutInput.min = checkinInput.value || todayString;

    if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = "";
    }
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const destination = destinationInput.value.trim().toLowerCase();
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;

    if (!checkin || !checkout || checkout <= checkin) {
        alert("Please choose a valid check-in and check-out date.");
        return;
    }

    let visibleCount = 0;

    hotelCards.forEach((card) => {
        const city = card.dataset.city;
        const matches = !destination || city.includes(destination);

        card.hidden = !matches;

        if (matches) visibleCount++;
    });

    resultCount.textContent =
        `${visibleCount} demo hotel${visibleCount === 1 ? "" : "s"} found · ${guestsInput.value} guest(s)`;

    noResults.hidden = visibleCount !== 0;

    document.getElementById("hotels").scrollIntoView({
        behavior: "smooth"
    });
});

document.querySelectorAll(".book-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const hotel = button.dataset.hotel;
        const price = Number(button.dataset.price);

        selectedBooking = {
            hotel,
            price,
            checkin: checkinInput.value,
            checkout: checkoutInput.value,
            guests: guestsInput.value
        };

        bookingSummary.replaceChildren();

        const addLine = (label, value) => {
            const line = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = `${label}: `;
            line.append(strong, document.createTextNode(value));
            bookingSummary.appendChild(line);
        };

        addLine("Hotel", hotel);
        addLine("Price", `₹${price.toLocaleString("en-IN")} per night`);
        addLine("Guests", selectedBooking.guests);

        if (selectedBooking.checkin && selectedBooking.checkout) {
            const start = new Date(`${selectedBooking.checkin}T00:00:00`);
            const end = new Date(`${selectedBooking.checkout}T00:00:00`);
            const nights = Math.round((end - start) / 86400000);

            if (nights > 0) {
                addLine("Stay", `${nights} night(s)`);
                addLine("Demo total", `₹${(price * nights).toLocaleString("en-IN")}`);
            }
        } else {
            addLine("Stay", "Select dates using the search form");
        }

        confirmBooking.textContent = "Confirm Demo Booking";
        bookingDialog.showModal();
    });
});

document.getElementById("closeDialog").addEventListener("click", () => {
    bookingDialog.close();
});

confirmBooking.addEventListener("click", () => {
    if (!selectedBooking) return;

    alert(
        `Demo booking confirmed for ${selectedBooking.hotel}!\n\n` +
        "This is only a frontend demonstration. No real reservation or payment was made."
    );

    bookingDialog.close();
});

bookingDialog.addEventListener("click", (event) => {
    if (event.target === bookingDialog) {
        bookingDialog.close();
    }
});
