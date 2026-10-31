var menuItems = [
    { category: "Coffee",  name: "Espresso",   description: "Rich and intense double shot",              price: 800 },
    { category: "Coffee",  name: "Cappuccino", description: "Espresso topped with thick milk foam",      price: 1100 },
    { category: "Tea",     name: "Green Tea",  description: "Refreshing steamed loose-leaf green tea",   price: 900 },
    { category: "Pastries", name: "Croissant", description: "Flaky and buttery French pastry",           price: 700 },
    { category: "Pastries", name: "Cheesecake", description: "Classic New York style slice",             price: 1300 }
];

var cart = {
    count: 0,
    total: 0,

    add: function (price) {
        this.count = this.count + 1;
        this.total = this.total + price;
        this.save();
        this.show();
    },

    show: function () {
        var counter = document.getElementById("cart-count");
        if (counter) {
            counter.textContent = this.count;
            animate(counter, "bump");
        }
    },

    save: function () {
        localStorage.setItem("cartCount", this.count);
        localStorage.setItem("cartTotal", this.total);
    },

    load: function () {
        this.count = Number(localStorage.getItem("cartCount")) || 0;
        this.total = Number(localStorage.getItem("cartTotal")) || 0;
        var counter = document.getElementById("cart-count");
        if (counter) {
            counter.textContent = this.count;
        }
    }
};

var sounds = {
    click:   [[600, 0.08]],
    add:     [[660, 0.09], [880, 0.12]],
    star:    [[784, 0.08], [1047, 0.14]],
    success: [[523, 0.1], [659, 0.1], [784, 0.18]],
    error:   [[300, 0.12], [220, 0.2]],
    copy:    [[880, 0.06], [1175, 0.1]]
};

var audioContext = null;

function playSound(type) {
    var AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) {
        return;
    }
    if (audioContext === null) {
        audioContext = new AudioClass();
    }
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    var notes = sounds[type] || sounds.click;
    var time = audioContext.currentTime;

    for (var i = 0; i < notes.length; i++) {
        var oscillator = audioContext.createOscillator();
        var gain = audioContext.createGain();
        var length = notes[i][1];

        oscillator.type = "sine";
        oscillator.frequency.value = notes[i][0];

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.15, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + length);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(time);
        oscillator.stop(time + length + 0.02);

        time = time + length;
    }
}

function animate(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    element.addEventListener("animationend", function () {
        element.classList.remove(className);
    }, { once: true });
}

function showToast(message) {
    var toast = $("#toast");
    toast.stop(true, true);
    toast.text(message);
    toast.hide().fadeIn(300).delay(2000).fadeOut(500);
}

function setupTheme() {
    var button = document.getElementById("theme-btn");
    if (!button) {
        return;
    }

    if (localStorage.getItem("theme") === "night") {
        document.body.classList.add("night");
    }
    updateThemeButton(button);

    button.addEventListener("click", function () {
        document.body.classList.toggle("night");
        if (document.body.classList.contains("night")) {
            localStorage.setItem("theme", "night");
        } else {
            localStorage.setItem("theme", "day");
        }
        updateThemeButton(button);
        playSound("click");
    });
}

function updateThemeButton(button) {
    if (document.body.classList.contains("night")) {
        button.textContent = "Day mode";
    } else {
        button.textContent = "Night mode";
    }
}

function setupKeyboardNav() {
    var links = document.querySelectorAll("#navbarNav .nav-link");

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("keydown", handleNavKey);
    }
}

function handleNavKey(event) {
    var links = document.querySelectorAll("#navbarNav .nav-link");
    var current = Array.from(links).indexOf(event.target);

    switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
            event.preventDefault();
            links[(current + 1) % links.length].focus();
            break;
        case "ArrowLeft":
        case "ArrowUp":
            event.preventDefault();
            links[(current - 1 + links.length) % links.length].focus();
            break;
        case "Home":
            event.preventDefault();
            links[0].focus();
            break;
        case "End":
            event.preventDefault();
            links[links.length - 1].focus();
            break;
    }
}

function setupOrderButtons(container) {
    var buttons = container.querySelectorAll(".order-btn");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            var name = button.dataset.name;
            var price = Number(button.dataset.price);

            cart.add(price);
            playSound("add");
            animate(button, "bump");
            showToast(name + " added to cart (" + price + " KZT)");
        });
    });
}
function getGreeting(name) {
    var hour = new Date().getHours();
    var period;

    if (hour < 12) {
        period = "morning";
    } else if (hour < 18) {
        period = "afternoon";
    } else {
        period = "evening";
    }

    var text;
    switch (period) {
        case "morning":
            text = "Good morning";
            break;
        case "afternoon":
            text = "Good afternoon";
            break;
        case "evening":
            text = "Good evening";
            break;
    }
    return text + ", " + name + "! Ready for a coffee?";
}

function setupHomePage() {
    var greeting = document.getElementById("greeting");
    if (!greeting) {
        return;
    }
    var savedName = localStorage.getItem("userName") || "friend";
    greeting.textContent = getGreeting(savedName);

    var form = document.getElementById("greeting-form");
    var input = document.getElementById("user-name");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var name = input.value.trim();
        if (name === "") {
            showToast("Please enter your name");
            return;
        }
        localStorage.setItem("userName", name);
        greeting.textContent = getGreeting(name);
        animate(greeting, "fade-in");
        playSound("success");
        input.value = "";
    });

    var timeButton = document.getElementById("time-btn");
    var timeOutput = document.getElementById("time-output");
    timeButton.addEventListener("click", function () {
        timeOutput.textContent = "Current time: " + new Date().toLocaleTimeString();
        animate(timeOutput, "fade-in");
        playSound("click");
    });
}

function getItemsByCategory(category) {
    var result;
    switch (category) {
        case "coffee":
            result = menuItems.filter(function (item) { return item.category === "Coffee"; });
            break;
        case "tea":
            result = menuItems.filter(function (item) { return item.category === "Tea"; });
            break;
        case "pastries":
            result = menuItems.filter(function (item) { return item.category === "Pastries"; });
            break;
        default:
            result = menuItems;
    }
    return result;
}

function countCheapItems(items, limit) {
    var count = 0;
    var i = 0;
    while (i < items.length) {
        if (items[i].price < limit) {
            count++;
        }
        i++;
    }
    return count;
}

function showMenuTable(items) {
    var tbody = document.querySelector("#menu-table tbody");
    tbody.innerHTML = "";

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var row = document.createElement("tr");
        row.className = "fade-in";
        row.innerHTML =
            "<td>" + item.category + "</td>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.description + "</td>" +
            "<td>" + item.price + " KZT</td>" +
            "<td><button type='button' class='btn btn-sm btn-outline-primary order-btn' " +
            "data-name='" + item.name + "' data-price='" + item.price + "'>Add</button></td>";
        tbody.appendChild(row);
    }

    applyMenuSearch();
}

function setupMenuPage() {
    var table = document.getElementById("menu-table");
    if (!table) {
        return;
    }

    showMenuTable(menuItems);
    setupOrderButtons(document.querySelector("#menu-table tbody"));

    var filterButtons = document.querySelectorAll(".filter-btn");
    var info = document.getElementById("filter-info");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var category = button.dataset.category;
            var items = getItemsByCategory(category);

            showMenuTable(items);
            setupOrderButtons(document.querySelector("#menu-table tbody"));

            filterButtons.forEach(function (b) { b.classList.remove("active-filter"); });
            button.classList.add("active-filter");

            var sum = items.reduce(function (total, item) { return total + item.price; }, 0);
            var average = Math.round(sum / items.length);
            info.textContent = "Showing " + items.length + " item(s). Average price: " + average + " KZT. Cheaper than 1000 KZT: " + countCheapItems(items, 1000);
            playSound("click");
        });
    });

    var sortButton = document.getElementById("sort-btn");
    var sortedUp = true;
    sortButton.addEventListener("click", function () {
        var sorted = menuItems.slice().sort(function (a, b) {
            if (sortedUp) {
                return a.price - b.price;
            }
            return b.price - a.price;
        });
        showMenuTable(sorted);
        setupOrderButtons(document.querySelector("#menu-table tbody"));
        if (sortedUp) {
            sortButton.textContent = "Sort by price: high to low";
        } else {
            sortButton.textContent = "Sort by price: low to high";
        }
        sortedUp = !sortedUp;
        playSound("click");
    });

    setupRating();
}

function setupRating() {
    var stars = document.querySelectorAll(".star");
    var message = document.getElementById("rating-message");

    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            var value = Number(star.dataset.value);

            // color the stars up to the clicked one
            for (var i = 0; i < stars.length; i++) {
                if (i < value) {
                    stars[i].classList.add("selected");
                } else {
                    stars[i].classList.remove("selected");
                }
            }

            animate(star, "pop");
            playSound("star");

            switch (value) {
                case 1:
                case 2:
                    message.textContent = "Sorry about that! We will do better. (" + value + "/5)";
                    break;
                case 3:
                    message.textContent = "Thanks! We will keep improving. (3/5)";
                    break;
                case 4:
                    message.textContent = "Great, thank you! (4/5)";
                    break;
                case 5:
                    message.innerHTML = "<strong>Awesome!</strong> You made our day! (5/5)";
                    break;
            }
        });
    });
}

function setupComboButtons() {
    var buttons = document.querySelectorAll(".combo-btn");
    var status = document.getElementById("combo-status");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            status.textContent = "Your order \"" + button.dataset.name + "\" is being prepared!";
            animate(status, "fade-in");
            playSound("success");
        });
    });
}


function sendForm(data, onSuccess, onError) {
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Server error");
            }
            return response.json();
        })
        .then(function (result) {
            onSuccess(result);
        })
        .catch(function (error) {
            onError(error);
        });
}

function setupContactPage() {
    var form = document.getElementById("contact-form");
    if (!form) {
        return;
    }

    var result = document.getElementById("form-result");
    var submitButton = document.getElementById("submit-btn");

    // live letter counter
    var textarea = document.getElementById("message");
    var counter = document.getElementById("char-count");
    textarea.addEventListener("input", function () {
        counter.textContent = textarea.value.length + " / 300";
        if (textarea.value.length > 300) {
            counter.style.color = "red";
        } else {
            counter.style.color = "";
        }
    });

    var colorInput = document.getElementById("favorite-color");
    colorInput.addEventListener("input", function () {
        submitButton.style.backgroundColor = colorInput.value;
        submitButton.style.borderColor = colorInput.value;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            visitTime: document.getElementById("visit-time").value,
            message: textarea.value
        };

        if (textarea.value.length > 300) {
            result.className = "form-result error";
            result.textContent = "Message is too long (max 300 characters).";
            playSound("error");
            return;
        }

        showSpinner($("#submit-btn"));

        sendForm(
            data,
            function () {
                result.className = "form-result success fade-in";
                result.textContent = "Thank you, " + data.name + "! Your message was sent. We will reply to " + data.email + ".";
                form.reset();
                counter.textContent = "0 / 300";
                playSound("success");
                hideSpinner($("#submit-btn"));
                showToast("Form submitted successfully!");
            },
            function () { 
                result.className = "form-result error fade-in";
                result.textContent = "Sorry, something went wrong. Please try again.";
                playSound("error");
                hideSpinner($("#submit-btn"));
                showToast("Could not send the form");
            }
        );
    });

    var resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener("click", function () {
        form.reset();
        counter.textContent = "0 / 300";
        result.textContent = "";
        result.className = "form-result";
        submitButton.style.backgroundColor = "";
        submitButton.style.borderColor = "";
        playSound("click");
    });
}


function setupReadMore() {
    var button = document.getElementById("read-more-btn");
    var moreText = document.getElementById("more-text");
    if (!button) {
        return;
    }

    moreText.style.display = "none";

    button.addEventListener("click", function () {
        if (moreText.style.display === "none") {
            moreText.style.display = "block";
            animate(moreText, "fade-in");
            button.innerText = "Read less";
        } else {
            moreText.style.display = "none";
            button.innerText = "Read more";
        }
        playSound("click");
    });
}


document.addEventListener("DOMContentLoaded", function () {
    cart.load();
    setupOrderButtons(document);
    setupTheme();
    setupKeyboardNav();
    setupHomePage();
    setupMenuPage();
    setupComboButtons();
    setupContactPage();
    setupReadMore();
});

$(document).ready(function () {
    console.log("jQuery is ready!");
});



function showSpinner(button) {
    button.data("old-text", button.text());
    button.data("start-time", Date.now());
    button.prop("disabled", true);
    button.html('<span class="spinner"></span> Please wait...');
}

function hideSpinner(button) {
    var passed = Date.now() - button.data("start-time");
    var wait = Math.max(0, 1500 - passed);

    setTimeout(function () {
        button.prop("disabled", false);
        button.text(button.data("old-text"));
    }, wait);
}


function applyMenuSearch() {
    var input = $("#menu-search");
    if (input.length === 0) {
        return;
    }
    var word = input.val().toLowerCase();

    $("#menu-table tbody tr").filter(function () {
        var found = $(this).text().toLowerCase().indexOf(word) > -1;
        $(this).toggle(found);
    });

    $(".combo-card-col").filter(function () {
        var found = $(this).text().toLowerCase().indexOf(word) > -1;
        $(this).toggle(found);
    });

    var rows = $("#menu-table tbody tr:visible").length;
    var cards = $(".combo-card-col:visible").length;
    if (rows === 0 && cards === 0) {
        $("#no-results").show();
    } else {
        $("#no-results").hide();
    }
}


$(document).ready(function () {

    $(".card-img-top").closest(".col-lg-4").addClass("combo-card-col");

    $("#menu-search").on("keyup", applyMenuSearch);

    var suggestions = [];
    for (var i = 0; i < menuItems.length; i++) {
        suggestions.push(menuItems[i].name);
    }
    $(".combo-card-col .card-title").each(function () {
        suggestions.push($(this).text());
    });

    $("#menu-search").on("input", function () {
        var word = $(this).val().toLowerCase();
        var list = $("#suggestion-list");
        list.empty();

        if (word === "") {
            list.hide();
            return;
        }

        for (var j = 0; j < suggestions.length; j++) {
            if (suggestions[j].toLowerCase().indexOf(word) > -1) {
                list.append("<li>" + suggestions[j] + "</li>");
            }
        }

        if (list.children().length > 0) {
            list.show();
        } else {
            list.hide();
        }
    });

    $("#suggestion-list").on("click", "li", function () {
        $("#menu-search").val($(this).text());
        $("#suggestion-list").hide();
        applyMenuSearch();
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest(".search-box").length) {
            $("#suggestion-list").hide();
        }
    });


    $(".searchable p, .searchable li").each(function () {
        $(this).data("original", $(this).text());
    });

    $("#page-search").on("keyup", function () {
        var word = $(this).val().trim();
        var count = 0;

        $(".searchable p, .searchable li").each(function () {
            var original = $(this).data("original");

            if (word === "") {
                $(this).text(original);
                return;
            }

            var safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            var regex = new RegExp("(" + safeWord + ")", "gi");
            var matches = original.match(regex);

            if (matches) {
                count = count + matches.length;
                $(this).html(original.replace(regex, "<mark>$1</mark>"));
            } else {
                $(this).text(original);
            }
        });

        if ($("#more-text mark").length > 0) {
            $("#more-text").show();
            $("#read-more-btn").text("Read less");
        }

        if (word === "") {
            $("#page-search-count").text("");
        } else {
            $("#page-search-count").text(count + " match(es) found");
        }
    });


    $("body").prepend('<div id="scroll-progress"><div id="scroll-progress-bar"></div></div>');

    function updateProgress() {
        var scrolled = $(window).scrollTop();
        var maxScroll = $(document).height() - $(window).height();
        var percent = 0;
        if (maxScroll > 0) {
            percent = (scrolled / maxScroll) * 100;
        }
        $("#scroll-progress-bar").css("width", percent + "%");
    }
    $(window).on("scroll resize", updateProgress);
    updateProgress();

    var counterStarted = false;

    function startCounters() {
        if (counterStarted || $(".counter-number").length === 0) {
            return;
        }
        var windowBottom = $(window).scrollTop() + $(window).height();

        if ($(".stats-section").offset().top < windowBottom - 50) {
            counterStarted = true;

            $(".counter-number").each(function () {
                var element = $(this);
                var target = parseInt(element.attr("data-target"));

                $({ value: 0 }).animate({ value: target }, {
                    duration: 2500,
                    step: function (now) {
                        element.text(Math.floor(now));
                    },
                    complete: function () {
                        element.text(target);
                    }
                });
            });
        }
    }
    $(window).on("scroll resize", startCounters);
    startCounters();

    $(".copy-btn").on("click", function () {
        var button = $(this);
        var text = button.attr("data-copy");

        var temp = $("<textarea>").val(text).appendTo("body").select();
        document.execCommand("copy");
        temp.remove();

        button.addClass("copied").html("&#10004;");
        var tip = $('<span class="copy-tooltip">Copied to clipboard!</span>');
        button.after(tip);
        tip.hide().fadeIn(200);
        showToast("Copied: " + text);
        playSound("copy");

        setTimeout(function () {
            tip.fadeOut(300, function () {
                tip.remove();
            });
            button.removeClass("copied").html("&#128203;");
        }, 2000);
    });

    $(".copy-text").on("copy", function () {
        showToast("Text copied!");
    });

    function loadVisibleImages() {
        var windowBottom = $(window).scrollTop() + $(window).height();

        $("img.lazy").each(function () {
            var img = $(this);
            if (img.offset().top < windowBottom + 100) {
                img.attr("src", img.attr("data-src"));
                img.removeClass("lazy");
                img.hide().fadeIn(600);
                console.log("Lazy loaded: " + img.attr("data-src"));
            }
        });
    }
    $(window).on("scroll resize", loadVisibleImages);
    loadVisibleImages();

});
