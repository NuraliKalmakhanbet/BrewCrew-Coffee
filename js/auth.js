// auth.js - sign up, log in and profile. Data is kept in localStorage ("users", "currentUser"); passwords only as SHA-256 hash.

// makes a hash of the password; the email is added so equal passwords look different
function hashPassword(email, password, callback) {
    var text = email.toLowerCase() + ":" + password;

    if (window.crypto && window.crypto.subtle) {
        var bytes = new TextEncoder().encode(text);
        window.crypto.subtle.digest("SHA-256", bytes).then(function (buffer) {
            var hex = "";
            var view = new Uint8Array(buffer);
            for (var i = 0; i < view.length; i++) {
                hex = hex + view[i].toString(16).padStart(2, "0");
            }
            callback(hex);
        });
    } else {
        // very simple backup hash for old browsers
        var hash = 5381;
        for (var j = 0; j < text.length; j++) {
            hash = (hash * 33) ^ text.charCodeAt(j);
        }
        callback("simple-" + (hash >>> 0).toString(16));
    }
}

// ---------- sign up ----------
function setupSignup() {
    var form = document.getElementById("signup-form");
    if (!form) {
        return;
    }
    if (getCurrentUser() !== null) {
        window.location.replace("profile.html");
        return;
    }

    var nameInput = document.getElementById("signup-name");
    var emailInput = document.getElementById("signup-email");
    var phoneInput = document.getElementById("signup-phone");
    var passwordInput = document.getElementById("signup-password");
    var confirmInput = document.getElementById("signup-confirm");

    function validateConfirm(value) {
        if (value === "") {
            return "Please repeat your password.";
        }
        if (value !== passwordInput.value) {
            return "Passwords do not match.";
        }
        return "";
    }

    watchField(nameInput, validateName);
    watchField(emailInput, validateEmail);
    watchField(phoneInput, validatePhone);
    watchField(passwordInput, validatePassword);
    watchField(confirmInput, validateConfirm);
    // if the password changes, the confirmation must be checked again
    passwordInput.addEventListener("input", function () {
        if (confirmInput.value !== "") {
            checkField(confirmInput, validateConfirm);
        }
    });
    setupShowPassword([passwordInput, confirmInput]);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // run all the checks (no early exit, so every error is shown)
        var okName = checkField(nameInput, validateName);
        var okEmail = checkField(emailInput, validateEmail);
        var okPhone = checkField(phoneInput, validatePhone);
        var okPassword = checkField(passwordInput, validatePassword);
        var okConfirm = checkField(confirmInput, validateConfirm);

        if (!(okName && okEmail && okPhone && okPassword && okConfirm)) {
            focusFirstError(form);
            return;
        }

        var email = emailInput.value.trim().toLowerCase();
        if (findUser(email) !== null) {
            showFieldError(emailInput, "An account with this email already exists. Try to log in.");
            emailInput.focus();
            return;
        }

        hashPassword(email, passwordInput.value, function (hash) {
            var users = getUsers();
            users.push({
                name: nameInput.value.trim(),
                email: email,
                phone: phoneInput.value.trim(),
                passwordHash: hash,
                created: new Date().toISOString()
            });
            saveData("users", users);
            saveData("currentUser", email);
            window.location.href = "profile.html";
        });
    });
}

// ---------- log in ----------
function setupLogin() {
    var form = document.getElementById("login-form");
    if (!form) {
        return;
    }
    if (getCurrentUser() !== null) {
        window.location.replace("profile.html");
        return;
    }

    var emailInput = document.getElementById("login-email");
    var passwordInput = document.getElementById("login-password");
    var alertBox = document.getElementById("login-alert");

    watchField(emailInput, validateEmail);
    watchField(passwordInput, validateRequiredPassword);
    setupShowPassword([passwordInput]);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alertBox.hidden = true;

        var okEmail = checkField(emailInput, validateEmail);
        var okPassword = checkField(passwordInput, validateRequiredPassword);
        if (!(okEmail && okPassword)) {
            focusFirstError(form);
            return;
        }

        var email = emailInput.value.trim().toLowerCase();
        var user = findUser(email);

        if (user === null) {
            alertBox.textContent = "Wrong email or password.";
            alertBox.hidden = false;
            return;
        }

        hashPassword(email, passwordInput.value, function (hash) {
            if (hash !== user.passwordHash) {
                alertBox.textContent = "Wrong email or password.";
                alertBox.hidden = false;
                return;
            }
            saveData("currentUser", email);
            window.location.href = "profile.html";
        });
    });
}

// ---------- profile ----------
function makeListItem(html) {
    var item = document.createElement("li");
    item.className = "list-group-item px-0";
    item.innerHTML = html;
    return item;
}

function showProfileRatings(user) {
    var list = document.getElementById("profile-ratings");
    var count = 0;

    for (var i = 0; i < menuItems.length; i++) {
        var stars = getUserRating(menuItems[i].id);
        if (stars > 0) {
            var item = makeListItem('<div class="d-flex justify-content-between align-items-center gap-2"><span class="rated-name"></span><span class="static-stars"></span></div>');
            item.querySelector(".rated-name").textContent = menuItems[i].name;
            var starText = item.querySelector(".static-stars");
            starText.textContent = "★".repeat(stars) + "☆".repeat(5 - stars);
            starText.setAttribute("aria-label", stars + " out of 5");
            list.appendChild(item);
            count = count + 1;
        }
    }
    document.getElementById("no-ratings").hidden = count !== 0;
}

function showProfileOrders(user) {
    var list = document.getElementById("profile-orders");
    var orders = loadData("orders", []);
    var count = 0;

    // newest order first
    for (var i = orders.length - 1; i >= 0; i--) {
        var order = orders[i];
        if (order.email !== user.email) {
            continue;
        }
        var item = makeListItem('<div class="d-flex justify-content-between flex-wrap gap-1"><strong class="order-number"></strong><span class="order-total"></span></div><div class="small text-body-secondary order-date"></div><ul class="small mb-0 mt-1 order-lines"></ul>');
        item.querySelector(".order-number").textContent = "Order " + order.id;
        item.querySelector(".order-total").textContent = formatPrice(order.total);
        item.querySelector(".order-date").textContent = new Date(order.date).toLocaleString();

        var lines = item.querySelector(".order-lines");
        for (var j = 0; j < order.items.length; j++) {
            var line = document.createElement("li");
            line.textContent = order.items[j].qty + " x " + order.items[j].name;
            lines.appendChild(line);
        }
        if (order.promo) {
            var promoLine = document.createElement("li");
            promoLine.textContent = "Promo code " + order.promo + " applied";
            lines.appendChild(promoLine);
        }
        list.appendChild(item);
        count = count + 1;
    }
    document.getElementById("no-orders").hidden = count !== 0;
}

function showProfileMessages(user) {
    var list = document.getElementById("profile-messages");
    var messages = loadData("messages", []);
    var count = 0;

    for (var i = messages.length - 1; i >= 0; i--) {
        if (messages[i].userEmail !== user.email) {
            continue;
        }
        var item = makeListItem('<div class="small text-body-secondary message-date"></div><div class="message-text"></div>');
        item.querySelector(".message-date").textContent = new Date(messages[i].date).toLocaleString();
        item.querySelector(".message-text").textContent = messages[i].message;
        list.appendChild(item);
        count = count + 1;
    }
    document.getElementById("no-messages").hidden = count !== 0;
}

function setupProfile() {
    var nameBox = document.getElementById("profile-name");
    if (!nameBox) {
        return;
    }

    var user = getCurrentUser();
    if (user === null) {
        // not logged in: go to the log in page
        window.location.replace("login.html");
        return;
    }

    nameBox.textContent = user.name;
    document.getElementById("profile-avatar").textContent = user.name.charAt(0).toUpperCase();
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-phone").textContent = user.phone;
    document.getElementById("profile-since").textContent = new Date(user.created).toLocaleDateString();
    document.getElementById("logout-btn").addEventListener("click", logout);

    showProfileRatings(user);
    showProfileOrders(user);
    showProfileMessages(user);
}

document.addEventListener("DOMContentLoaded", function () {
    setupSignup();
    setupLogin();
    setupProfile();
});
