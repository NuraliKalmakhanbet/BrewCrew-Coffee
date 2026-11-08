// guide.js - "Coffee guide" on the menu page.
// Data comes from the free Sample APIs coffee service (no API key needed):
//   https://api.sampleapis.com/coffee/hot
//   https://api.sampleapis.com/coffee/iced
// Every drink has: title, description, ingredients (list) and image.
// The last loaded list is saved in localStorage so the guide still works if the API is offline.

var GUIDE_URL = "https://api.sampleapis.com/coffee/";
var guideType = "hot";
var guideDrinks = [];
var guideShown = 6;

// A small built-in list. It is shown only when the API is offline and nothing was saved yet,
// so the guide is never empty. (These drinks have no pictures, the letter is shown instead.)
var GUIDE_SAMPLE = {
    hot: [
        { title: "Espresso", description: "A short, strong shot of coffee.", ingredients: ["Espresso"] },
        { title: "Americano", description: "Espresso diluted with hot water.", ingredients: ["Espresso", "Hot water"] },
        { title: "Cappuccino", description: "Equal parts espresso, steamed milk and milk foam.", ingredients: ["Espresso", "Steamed milk", "Milk foam"] },
        { title: "Latte", description: "Espresso with a lot of steamed milk and a thin layer of foam.", ingredients: ["Espresso", "Steamed milk"] },
        { title: "Flat White", description: "Espresso with smooth, velvety steamed milk.", ingredients: ["Espresso", "Steamed milk"] },
        { title: "Mocha", description: "A chocolate latte.", ingredients: ["Espresso", "Chocolate", "Steamed milk"] }
    ],
    iced: [
        { title: "Iced Coffee", description: "Chilled coffee served over ice.", ingredients: ["Coffee", "Ice"] },
        { title: "Iced Latte", description: "Espresso and cold milk over ice.", ingredients: ["Espresso", "Milk", "Ice"] },
        { title: "Cold Brew", description: "Coffee brewed slowly with cold water.", ingredients: ["Coffee", "Cold water", "Ice"] },
        { title: "Iced Mocha", description: "Chocolate, espresso and cold milk over ice.", ingredients: ["Espresso", "Chocolate", "Milk", "Ice"] },
        { title: "Iced Caramel Latte", description: "Iced latte with caramel syrup.", ingredients: ["Espresso", "Milk", "Caramel", "Ice"] },
        { title: "Frappe", description: "Blended iced coffee with a foamy top.", ingredients: ["Coffee", "Milk", "Ice", "Sugar"] }
    ]
};

function setGuideStatus(text) {
    document.getElementById("guide-status").textContent = text;
}

function loadGuide() {
    var grid = document.getElementById("guide-grid");
    grid.innerHTML = "";
    document.getElementById("guide-retry-btn").hidden = true;
    document.getElementById("guide-more-btn").hidden = true;
    setGuideStatus("Loading drinks...");

    fetch(GUIDE_URL + guideType)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Server answered with status " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            if (!Array.isArray(data)) {
                throw new Error("Unexpected answer from the server");
            }
            guideDrinks = data;
            saveData("coffeeGuide-" + guideType, data);
            guideShown = 6;
            showGuide("");
        })
        .catch(function (error) {
            console.log(error);
            var saved = loadData("coffeeGuide-" + guideType, null);
            if (saved !== null) {
                guideDrinks = saved;
                guideShown = 6;
                showGuide("Could not reach the server, showing the last saved list. ");
                document.getElementById("guide-retry-btn").hidden = false;
            } else {
                // nothing saved yet: show the built-in list and let the user try the API again
                guideDrinks = GUIDE_SAMPLE[guideType];
                guideShown = 6;
                showGuide("Could not reach the coffee service, showing a short built-in list. ");
                document.getElementById("guide-retry-btn").hidden = false;
            }
        });
}

// ingredients can be a list in the API, but we also accept a text
function getIngredients(drink) {
    if (Array.isArray(drink.ingredients)) {
        return drink.ingredients;
    }
    if (typeof drink.ingredients === "string" && drink.ingredients !== "") {
        return drink.ingredients.split(",");
    }
    return [];
}

function createGuideCard(drink) {
    var col = document.createElement("div");
    col.className = "col";

    var card = document.createElement("article");
    card.className = "card item-card h-100";
    col.appendChild(card);
    animateIn(card);

    // picture (if the picture link is broken we show the first letter instead)
    var title = String(drink.title || "Coffee");
    function showLetter(image) {
        var letter = document.createElement("div");
        letter.className = "img-placeholder";
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = title.charAt(0).toUpperCase();
        if (image.parentNode) {
            image.parentNode.replaceChild(letter, image);
        }
    }

    if (drink.image) {
        var image = document.createElement("img");
        image.className = "item-img";
        image.loading = "lazy";
        image.alt = title;
        image.addEventListener("error", function () {
            showLetter(image);
        });
        image.src = drink.image;
        card.appendChild(image);
    } else {
        var letterBox = document.createElement("div");
        letterBox.className = "img-placeholder";
        letterBox.setAttribute("aria-hidden", "true");
        letterBox.textContent = title.charAt(0).toUpperCase();
        card.appendChild(letterBox);
    }

    var body = document.createElement("div");
    body.className = "card-body d-flex flex-column";
    card.appendChild(body);

    var heading = document.createElement("h3");
    heading.className = "h5 card-title";
    heading.textContent = title;
    body.appendChild(heading);

    var text = document.createElement("p");
    text.className = "card-text";
    text.textContent = drink.description || "";
    body.appendChild(text);

    var list = document.createElement("div");
    list.className = "d-flex flex-wrap gap-1 mb-3";
    var ingredients = getIngredients(drink);
    for (var i = 0; i < ingredients.length; i++) {
        var badge = document.createElement("span");
        badge.className = "badge ingredient";
        badge.textContent = String(ingredients[i]).trim();
        list.appendChild(badge);
    }
    body.appendChild(list);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-primary btn-sm mt-auto align-self-start";
    button.textContent = "Find on our menu";
    button.addEventListener("click", function () {
        searchMenuFor(title);
    });
    body.appendChild(button);

    return col;
}

// shows the drinks that match the search word
function showGuide(messageStart) {
    var word = document.getElementById("guide-search").value.trim().toLowerCase();
    var grid = document.getElementById("guide-grid");
    var found = [];

    for (var i = 0; i < guideDrinks.length; i++) {
        var drink = guideDrinks[i];
        var text = (String(drink.title) + " " + getIngredients(drink).join(" ")).toLowerCase();
        if (text.indexOf(word) !== -1) {
            found.push(drink);
        }
    }

    grid.innerHTML = "";
    for (var j = 0; j < found.length && j < guideShown; j++) {
        grid.appendChild(createGuideCard(found[j]));
    }

    if (found.length === 0) {
        setGuideStatus(messageStart + "No drinks found. Try another word.");
    } else {
        var shown = Math.min(found.length, guideShown);
        setGuideStatus(messageStart + "Showing " + shown + " of " + found.length + " drinks.");
    }
    document.getElementById("guide-more-btn").hidden = found.length <= guideShown;
}

function updateGuideButtons() {
    var buttons = document.querySelectorAll("[data-type]");
    for (var i = 0; i < buttons.length; i++) {
        var isActive = buttons[i].dataset.type === guideType;
        buttons[i].classList.toggle("active", isActive);
        buttons[i].setAttribute("aria-pressed", String(isActive));
    }
}

function setupGuide() {
    var typeButtons = document.querySelectorAll("[data-type]");
    for (var i = 0; i < typeButtons.length; i++) {
        typeButtons[i].addEventListener("click", function () {
            guideType = this.dataset.type;
            document.getElementById("guide-search").value = "";
            updateGuideButtons();
            loadGuide();
        });
    }

    document.getElementById("guide-search").addEventListener("input", function () {
        guideShown = 6;
        showGuide("");
    });

    document.getElementById("guide-more-btn").addEventListener("click", function () {
        guideShown = guideShown + 6;
        showGuide("");
    });

    document.getElementById("guide-retry-btn").addEventListener("click", loadGuide);

    updateGuideButtons();
    loadGuide();
}

document.addEventListener("DOMContentLoaded", setupGuide);
