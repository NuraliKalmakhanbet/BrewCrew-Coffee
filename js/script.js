
var navToggle = document.getElementById("nav-toggle");
var navMenu = document.getElementById("nav-menu");

navToggle.onclick = function () {
    navMenu.classList.toggle("open");
};

var colorBtn = document.getElementById("color-btn");

var colors = ["#f7f1e8", "#e8f1e4", "#e4eef7", "#f7e4ee", "#f7f0c8", "#e3d9f7"];
var colorIndex = 0;

colorBtn.onclick = function () {
    colorIndex = colorIndex + 1;
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
    document.body.style.backgroundColor = colors[colorIndex];
};

var dateTime = document.getElementById("date-time");

function showDateTime() {
    var now = new Date();

    var datePart = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    var timePart = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

    dateTime.textContent = datePart + ", " + timePart;
}

showDateTime();
setInterval(showDateTime, 1000);
