// script.js - code that is used on every page:
// localStorage helpers, icons, light/dark theme switch, toast message,
// login state in the menu, cart, scroll animations

// ---------- localStorage helpers ----------
function loadData(key, fallback) {
    try {
        var text = localStorage.getItem(key);
        if (text === null) {
            return fallback;
        }
        return JSON.parse(text);
    } catch (error) {
        return fallback;
    }
}

function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log("Could not save " + key);
    }
}

function removeData(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.log("Could not remove " + key);
    }
}

function formatPrice(number) {
    return number.toLocaleString("en-US") + " KZT";
}

// ---------- icons (small inline SVG pictures, no external library) ----------
// Use <span class="icon" data-icon="coffee"></span> in HTML; renderIcons() fills it.
var ICON_PATHS = {
    coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    cloud: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>'
};

function iconSvg(name) {
    var paths = ICON_PATHS[name];
    if (!paths) {
        return "";
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">' + paths + '</svg>';
}

// fills every empty <span data-icon="..."> inside root
function renderIcons(root) {
    var places = (root || document).querySelectorAll("[data-icon]");
    for (var i = 0; i < places.length; i++) {
        if (places[i].firstChild === null) {
            places[i].innerHTML = iconSvg(places[i].dataset.icon);
        }
    }
}

// ---------- theme (light / dark) ----------
function getTheme() {
    return document.documentElement.getAttribute("data-bs-theme");
}

function updateThemeButton() {
    var button = document.getElementById("theme-btn");
    if (!button) {
        return;
    }
    var isDark = getTheme() === "dark";
    var thumb = button.querySelector(".theme-thumb");
    var label = button.querySelector(".theme-label");

    button.setAttribute("aria-checked", String(isDark));
    if (isDark) {
        button.setAttribute("aria-label", "Switch to light mode");
    } else {
        button.setAttribute("aria-label", "Switch to dark mode");
    }
    if (label) {
        label.textContent = isDark ? "Light mode" : "Dark mode";
    }
    // the picture shows the mode that the switch will turn ON next
    if (thumb) {
        thumb.innerHTML = '<span class="icon" aria-hidden="true">' + iconSvg(isDark ? "moon" : "sun") + '</span>';
    }
}

function setupTheme() {
    var button = document.getElementById("theme-btn");
    updateThemeButton();
    if (!button) {
        return;
    }
    button.addEventListener("click", function () {
        var newTheme = "dark";
        if (getTheme() === "dark") {
            newTheme = "light";
        }
        document.documentElement.setAttribute("data-bs-theme", newTheme);
        saveTheme(newTheme);
        updateThemeButton();
    });
}

// the theme is saved in localStorage, so every page opens in the same mode
function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        console.log("Could not save theme");
    }
}

// keeps the switch in sync when the theme is changed in another tab
window.addEventListener("storage", function (event) {
    if (event.key === "theme" && (event.newValue === "dark" || event.newValue === "light")) {
        document.documentElement.setAttribute("data-bs-theme", event.newValue);
        updateThemeButton();
    }
});

// ---------- toast message ----------
var toastTimer = null;

function createToast() {
    var toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
}

function showToast(message, linkText, linkHref) {
    var toast = document.getElementById("toast");
    if (!toast) {
        return;
    }
    toast.textContent = message;
    if (linkText) {
        var link = document.createElement("a");
        link.href = linkHref;
        link.textContent = linkText;
        toast.appendChild(document.createTextNode(" "));
        toast.appendChild(link);
    }
    toast.className = "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toast.className = "";
    }, 3500);
}

// ---------- users and login state ----------
function getUsers() {
    return loadData("users", []);
}

function findUser(email) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email.toLowerCase()) {
            return users[i];
        }
    }
    return null;
}

function getCurrentUser() {
    var email = loadData("currentUser", null);
    if (!email) {
        return null;
    }
    return findUser(email);
}

function logout() {
    removeData("currentUser");
    window.location.href = "index.html";
}

// shows "Log in / Sign up" or "Hi, Name / Log out" in the top menu
function setupNavAuth() {
    var holder = document.getElementById("nav-auth");
    if (!holder) {
        return;
    }
    var user = getCurrentUser();
    if (user === null) {
        return; // the HTML already has the Log in and Sign up links
    }

    holder.innerHTML = "";

    var profileLink = document.createElement("a");
    profileLink.className = "nav-link py-0";
    profileLink.href = "profile.html";
    profileLink.textContent = "Hi, " + user.name.split(" ")[0];
    if (window.location.pathname.indexOf("profile.html") !== -1) {
        profileLink.classList.add("active");
        profileLink.setAttribute("aria-current", "page");
    }

    var logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "btn btn-sm btn-outline-light";
    logoutButton.textContent = "Log out";
    logoutButton.addEventListener("click", logout);

    holder.appendChild(profileLink);
    holder.appendChild(logoutButton);
}

// ---------- cart (saved in localStorage as [{id, qty}, ...]) ----------
function getCart() {
    return loadData("cart", []);
}

function saveCart(cart) {
    saveData("cart", cart);
    updateCartBadge(true);
}

function addToCart(id) {
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].qty = cart[i].qty + 1;
            found = true;
        }
    }
    if (!found) {
        cart.push({ id: id, qty: 1 });
    }
    saveCart(cart);
}

function getCartCount() {
    var cart = getCart();
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count = count + cart[i].qty;
    }
    return count;
}

function updateCartBadge(animate) {
    var badge = document.getElementById("cart-count");
    if (badge) {
        badge.textContent = getCartCount();
        if (animate) {
            // the badge grows (CSS transition) and goes back after a moment
            badge.classList.add("bump");
            setTimeout(function () {
                badge.classList.remove("bump");
            }, 200);
        }
    }
}

// ---------- copy buttons (promo code, email, address) ----------
function copyWithOldMethod(text) {
    var box = document.createElement("textarea");
    box.value = text;
    document.body.appendChild(box);
    box.select();
    document.execCommand("copy");
    document.body.removeChild(box);
}

function copyText(text, button) {
    var oldLabel = button.textContent;

    function showCopied() {
        button.textContent = "Copied!";
        showToast("Copied: " + text);
        setTimeout(function () {
            button.textContent = oldLabel;
        }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(function () {
            copyWithOldMethod(text);
            showCopied();
        });
    } else {
        copyWithOldMethod(text);
        showCopied();
    }
}

function setupCopyButtons() {
    var buttons = document.querySelectorAll(".copy-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            copyText(this.dataset.copy, this);
        });
    }
}

// ---------- appear animation for cards made by JavaScript ----------
// The card starts with the class "entering" (hidden and a bit lower).
// One moment later the class is removed and the CSS transition shows the card.
function animateIn(element) {
    element.classList.add("entering");
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            element.classList.remove("entering");
        });
    });
}

// ---------- scroll animations ----------
// Cards and titles fade in when they come into view.
// If the browser has no IntersectionObserver, nothing is hidden.
function setupRevealOnScroll() {
    if (!("IntersectionObserver" in window)) {
        return;
    }
    var targets = document.querySelectorAll("main .card:not(.item-card), main .section-title");
    var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add("is-visible");
                observer.unobserve(entries[i].target);
            }
        }
    }, { threshold: 0.12 });

    for (var j = 0; j < targets.length; j++) {
        targets[j].classList.add("reveal");
        // small delay between neighbours, so a row of cards appears one by one
        targets[j].style.transitionDelay = (j % 3) * 80 + "ms";
        observer.observe(targets[j]);
    }
}

// ---------- start ----------
document.addEventListener("DOMContentLoaded", function () {
    renderIcons();
    createToast();
    setupTheme();
    setupRevealOnScroll();
    setupNavAuth();
    updateCartBadge();
    setupCopyButtons();
});
