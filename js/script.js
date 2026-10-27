
var navToggle = document.getElementById("nav-toggle");
var navMenu = document.getElementById("nav-menu");

if (navToggle && navMenu) {
    navToggle.onclick = function () {
        navMenu.classList.toggle("open");
    };
}

var colorBtn = document.getElementById("color-btn");
var colors = ["#f7f1e8", "#e8f1e4", "#e4eef7", "#f7e4ee", "#f7f0c8", "#e3d9f7"];
var colorIndex = 0;

if (colorBtn) {
    colorBtn.onclick = function () {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    };
}

var dateTime = document.getElementById("date-time");

function showDateTime() {
    if (!dateTime) return;
    var now = new Date();
    var datePart = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    var timePart = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    dateTime.textContent = datePart + ", " + timePart;
}

if (dateTime) {
    showDateTime();
    setInterval(showDateTime, 1000);
}


document.addEventListener("DOMContentLoaded", function () {

    const themeBtn = document.createElement("button");
    themeBtn.id = "theme-toggle-btn";
    themeBtn.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; padding: 10px 18px; border: none; border-radius: 20px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.3s ease;";
    document.body.appendChild(themeBtn);

    const savedTheme = localStorage.getItem("brewcrew_theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeBtn.textContent = "Day Mode";
        themeBtn.style.backgroundColor = "#d4a373";
        themeBtn.style.color = "#1a1a1a";
    } else {
        themeBtn.textContent = "Night Mode";
        themeBtn.style.backgroundColor = "#5c3d2e";
        themeBtn.style.color = "#ffffff";
    }

    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
        
        themeBtn.style.transform = "scale(0.92)";
        setTimeout(() => { themeBtn.style.transform = "scale(1)"; }, 150);

        if (document.body.classList.contains("dark-theme")) {
            themeBtn.textContent = "Day Mode";
            themeBtn.style.backgroundColor = "#d4a373";
            themeBtn.style.color = "#1a1a1a";
            localStorage.setItem("brewcrew_theme", "dark");
        } else {
            themeBtn.textContent = "Night Mode";
            themeBtn.style.backgroundColor = "#5c3d2e";
            themeBtn.style.color = "#ffffff";
            localStorage.setItem("brewcrew_theme", "light");
        }
    });

    const headerElement = document.querySelector("header");
    if (headerElement) {
        const greetingDiv = document.createElement("div");
        greetingDiv.id = "dynamic-time-greeting";
        greetingDiv.style.cssText = "padding: 8px 15px; background: #5c3d2e; color: #ffffff; text-align: center; font-size: 0.95rem; font-weight: 500;";

        const currentHour = new Date().getHours();
        let greetingMessage = "";

        switch (true) {
            case (currentHour >= 5 && currentHour < 12):
                greetingMessage = "Good morning! Start your day with our fresh BrewCrew coffee.";
                break;
            case (currentHour >= 12 && currentHour < 18):
                greetingMessage = "Good afternoon! Enjoy a mid-day coffee & dessert break with us.";
                break;
            default:
                greetingMessage = "Good evening! Unwind with our signature coffee blends.";
                break;
        }

        greetingDiv.textContent = greetingMessage;
        headerElement.after(greetingDiv);
    }

    const menuTable = document.getElementById("menu-table");

    if (menuTable) {
        const tableRows = Array.from(menuTable.querySelectorAll("tbody tr"));
        const categories = ["All", ...new Set(tableRows.map(row => row.cells[0].textContent.trim()))];

        const filterContainer = document.createElement("div");
        filterContainer.className = "table-filter-controls";
        filterContainer.style.cssText = "margin-bottom: 15px; text-align: center;";

        categories.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = "filter-btn" + (cat === "All" ? " active-filter" : "");
            btn.textContent = cat;
            btn.style.cssText = "margin: 0 4px 8px; padding: 6px 14px; cursor: pointer; border-radius: 4px; border: 1px solid #5c3d2e; font-weight: bold; transition: all 0.2s ease;";
            
            if (cat === "All") {
                btn.style.backgroundColor = "#5c3d2e";
                btn.style.color = "#ffffff";
            } else {
                btn.style.backgroundColor = "#ffffff";
                btn.style.color = "#5c3d2e";
            }

            btn.addEventListener("click", function () {
                filterContainer.querySelectorAll(".filter-btn").forEach(b => {
                    b.style.backgroundColor = "#ffffff";
                    b.style.color = "#5c3d2e";
                    b.classList.remove("active-filter");
                });
                btn.style.backgroundColor = "#5c3d2e";
                btn.style.color = "#ffffff";
                btn.classList.add("active-filter");

                const selectedCategory = cat.toLowerCase();

                tableRows.forEach(row => {
                    const rowCategory = row.cells[0].textContent.trim().toLowerCase();

                    switch (selectedCategory) {
                        case "all":
                            row.style.display = "";
                            break;
                        default:
                            if (rowCategory === selectedCategory) {
                                row.style.display = "";
                            } else {
                                row.style.display = "none";
                            }
                            break;
                    }
                });
            });

            filterContainer.appendChild(btn);
        });

        menuTable.parentNode.insertBefore(filterContainer, menuTable);
    }

    const resetBtn = document.getElementById("reset-contact-form");

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            document.querySelectorAll("#contact-form input, #contact-form textarea").forEach(function (input) {
                if (input.type !== "color") {
                    input.value = "";
                }
                input.classList.remove("input-error");
            });

            document.querySelectorAll("#contact-form .error-text, #contact-form .success-text").forEach(function (msg) {
                msg.textContent = "";
            });
        });
    }

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        const ratingSection = document.createElement("section");
        ratingSection.className = "card rating-widget-container";
        ratingSection.style.cssText = "text-align: center; margin: 30px auto; padding: 20px;";
        ratingSection.innerHTML = `
            <h3>Rate Your BrewCrew Experience</h3>
            <div class="star-rating" style="font-size: 2rem; cursor: pointer; color: #ccc; margin: 10px 0;">
                <span class="star-icon" data-value="1">&#9733;</span>
                <span class="star-icon" data-value="2">&#9733;</span>
                <span class="star-icon" data-value="3">&#9733;</span>
                <span class="star-icon" data-value="4">&#9733;</span>
                <span class="star-icon" data-value="5">&#9733;</span>
            </div>
            <p id="star-rating-feedback" style="margin-top: 5px; font-weight: bold; min-height: 24px;"></p>
        `;

        const mainContent = document.querySelector("main");
        if (mainContent) {
            mainContent.appendChild(ratingSection);
        }

        const starIcons = ratingSection.querySelectorAll(".star-icon");
        const ratingFeedback = ratingSection.querySelector("#star-rating-feedback");

        starIcons.forEach((star, index) => {
            star.addEventListener("click", function () {
                starIcons.forEach((s, i) => {
                    if (i <= index) {
                        s.style.color = "#f39c12";
                        s.style.transform = "scale(1.2)";
                        setTimeout(() => { s.style.transform = "scale(1)"; }, 150);
                    } else {
                        s.style.color = "#ccc";
                    }
                });
                ratingFeedback.textContent = "Thank you! You rated us " + (index + 1) + " out of 5 stars.";
            });
        });
    }

    const clickSound = new Audio("audio/click.mp3");

    document.querySelectorAll("button, .btn, .filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            clickSound.currentTime = 0;
            clickSound.play().catch(err => {
                console.log("Audio play prevented or file not found:", err);
            });
        });
    });

    const navLinks = Array.from(document.querySelectorAll("nav a"));
    let navIndex = 0;

    if (navLinks.length > 0) {
        document.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight") {
                navIndex = (navIndex + 1) % navLinks.length;
                navLinks[navIndex].focus();
            } else if (e.key === "ArrowLeft") {
                navIndex = (navIndex - 1 + navLinks.length) % navLinks.length;
                navLinks[navIndex].focus();
            }
        });
    }

});