// shop.js - ratings and the product card (used on the home page and the menu page)
//
// Ratings are saved in localStorage under the key "ratings":
// { "espresso": { "user@mail.com": 5, "other@mail.com": 3 }, ... }

function getAllRatings() {
    return loadData("ratings", {});
}

// average rating and number of votes of one product
function getRatingInfo(id) {
    var votes = getAllRatings()[id];
    var total = 0;
    var count = 0;
    if (votes) {
        for (var email in votes) {
            total = total + votes[email];
            count = count + 1;
        }
    }
    var average = 0;
    if (count > 0) {
        average = total / count;
    }
    return { average: average, count: count };
}

// rating given by the logged in user (0 if none)
function getUserRating(id) {
    var user = getCurrentUser();
    if (user === null) {
        return 0;
    }
    var votes = getAllRatings()[id];
    if (votes && votes[user.email]) {
        return votes[user.email];
    }
    return 0;
}

function saveRating(id, value) {
    var user = getCurrentUser();
    var ratings = getAllRatings();
    if (!ratings[id]) {
        ratings[id] = {};
    }
    ratings[id][user.email] = value;
    saveData("ratings", ratings);
}

// fills the stars and the text under them
function updateRatingView(card, id) {
    var stars = card.querySelectorAll(".star-btn");
    var text = card.querySelector(".rating-text");
    var mine = getUserRating(id);

    for (var i = 0; i < stars.length; i++) {
        if (i < mine) {
            stars[i].classList.add("on");
            stars[i].textContent = "★"; // filled star
        } else {
            stars[i].classList.remove("on");
            stars[i].textContent = "☆"; // empty star
        }
        stars[i].setAttribute("aria-pressed", String(i + 1 === mine));
    }

    var info = getRatingInfo(id);
    if (info.count === 0) {
        text.textContent = "No ratings yet";
    } else {
        var votes = info.count === 1 ? "1 rating" : info.count + " ratings";
        text.textContent = "Average " + info.average.toFixed(1) + " (" + votes + ")";
        if (mine > 0) {
            text.textContent = text.textContent + " · you gave " + mine;
        }
    }
}

// builds one product card and returns it (a column for the Bootstrap grid)
function createItemCard(item) {
    var col = document.createElement("div");
    col.className = "col";

    col.innerHTML =
        '<article class="card item-card h-100">' +
        '<img class="item-img" loading="lazy" width="400" height="190" alt="">' +
        '<div class="card-body d-flex flex-column">' +
        '<div class="d-flex justify-content-between align-items-start gap-2">' +
        '<h3 class="h5 card-title item-name"></h3>' +
        '<span class="badge badge-category item-category"></span>' +
        '</div>' +
        '<p class="card-text item-description"></p>' +
        '<div class="mb-3">' +
        '<div class="rating-stars" role="group"></div>' +
        '<span class="rating-text"></span>' +
        '</div>' +
        '<div class="mt-auto d-flex justify-content-between align-items-center gap-2">' +
        '<strong class="price item-price"></strong>' +
        '<button type="button" class="btn btn-primary btn-sm add-btn">' + iconSvg("cart") + ' Add to cart</button>' +
        '</div>' +
        '</div>' +
        '</article>';

    animateIn(col.querySelector(".item-card"));

    var image = col.querySelector(".item-img");
    image.src = item.image;
    image.alt = item.name;
    image.style.objectPosition = item.focus;
    col.querySelector(".item-name").textContent = item.name;
    col.querySelector(".item-category").textContent = item.category;
    col.querySelector(".item-description").textContent = item.description;
    col.querySelector(".item-price").textContent = formatPrice(item.price);

    // five rating stars
    var starBox = col.querySelector(".rating-stars");
    starBox.setAttribute("aria-label", "Rate " + item.name);
    for (var i = 1; i <= 5; i++) {
        var star = document.createElement("button");
        star.type = "button";
        star.className = "star-btn";
        star.dataset.value = i;
        star.setAttribute("aria-label", "Rate " + item.name + " " + i + " out of 5");
        star.addEventListener("click", function () {
            rateItem(col, item, Number(this.dataset.value));
        });
        starBox.appendChild(star);
    }
    updateRatingView(col, item.id);

    col.querySelector(".add-btn").addEventListener("click", function () {
        addToCart(item.id);
        showToast(item.name + " added to cart.", "View cart", "cart.html");
    });

    return col;
}

function rateItem(card, item, value) {
    if (getCurrentUser() === null) {
        showToast("Please log in to rate drinks.", "Log in", "login.html");
        return;
    }
    saveRating(item.id, value);
    updateRatingView(card, item.id);
    showToast("Thanks! You rated " + item.name + " " + value + " out of 5.");
}
