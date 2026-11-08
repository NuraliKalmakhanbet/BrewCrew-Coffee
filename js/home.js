// home.js - greeting and featured drinks on the home page

function getGreeting(name) {
    var hour = new Date().getHours();
    var text;

    if (hour < 12) {
        text = "Good morning";
    } else if (hour < 18) {
        text = "Good afternoon";
    } else {
        text = "Good evening";
    }
    return text + ", " + name + "! Ready for a coffee?";
}

function setupGreeting() {
    var greeting = document.getElementById("greeting");
    var accountButton = document.getElementById("hero-account-btn");
    var user = getCurrentUser();

    if (user === null) {
        greeting.textContent = "Log in to rate drinks and keep your order history.";
    } else {
        greeting.textContent = getGreeting(user.name.split(" ")[0]);
        accountButton.textContent = "My profile";
        accountButton.href = "profile.html";
    }
}

function showFeatured() {
    var grid = document.getElementById("featured-grid");
    var ids = ["caramel-oat-latte", "cinnamon-roll", "honey-iced-matcha"];

    for (var i = 0; i < ids.length; i++) {
        var item = findItem(ids[i]);
        grid.appendChild(createItemCard(item));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setupGreeting();
    showFeatured();
});
