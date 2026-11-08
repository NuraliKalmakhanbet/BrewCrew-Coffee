// menu.js - search, category filter and sorting on the menu page
//
// The last search is saved in localStorage:
//   "menuFilters"    -> { query, category, sort, results: [ids of the shown products] }
//   "recentSearches" -> ["latte", "matcha", ...] (max 5)
// When the user comes back, the same search and the same results are shown again.

var currentCategory = "all";
var menuGrid;
var searchInput;
var sortSelect;

function loadSavedFilters() {
    var saved = loadData("menuFilters", null);
    if (saved === null) {
        return;
    }
    searchInput.value = saved.query || "";

    var categories = ["all", "Coffee", "Tea", "Pastries", "Combos"];
    if (categories.indexOf(saved.category) !== -1) {
        currentCategory = saved.category;
    }

    var sorts = ["default", "price-asc", "price-desc", "rating", "name"];
    if (sorts.indexOf(saved.sort) !== -1) {
        sortSelect.value = saved.sort;
    }
}

// checks if the product contains every word of the search text
function itemMatches(item, query) {
    var text = (item.name + " " + item.description + " " + item.category).toLowerCase();
    var words = query.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i] !== "" && text.indexOf(words[i]) === -1) {
            return false;
        }
    }
    return true;
}

function sortItems(list, sortType) {
    if (sortType === "price-asc") {
        list.sort(function (a, b) { return a.price - b.price; });
    } else if (sortType === "price-desc") {
        list.sort(function (a, b) { return b.price - a.price; });
    } else if (sortType === "name") {
        list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (sortType === "rating") {
        list.sort(function (a, b) {
            var infoA = getRatingInfo(a.id);
            var infoB = getRatingInfo(b.id);
            if (infoB.average !== infoA.average) {
                return infoB.average - infoA.average;
            }
            return infoB.count - infoA.count;
        });
    }
}

function updateCategoryButtons() {
    var buttons = document.querySelectorAll("#category-buttons .chip");
    for (var i = 0; i < buttons.length; i++) {
        var isActive = buttons[i].dataset.category === currentCategory;
        buttons[i].classList.toggle("active", isActive);
        buttons[i].setAttribute("aria-pressed", String(isActive));
    }
}

// the main function: filters, sorts, shows the cards and saves the search
function filterMenu() {
    var query = searchInput.value.trim().toLowerCase();
    var result = [];

    for (var i = 0; i < menuItems.length; i++) {
        var item = menuItems[i];
        var categoryOk = currentCategory === "all" || item.category === currentCategory;
        if (categoryOk && itemMatches(item, query)) {
            result.push(item);
        }
    }

    sortItems(result, sortSelect.value);

    menuGrid.innerHTML = "";
    var ids = [];
    for (var j = 0; j < result.length; j++) {
        menuGrid.appendChild(createItemCard(result[j]));
        ids.push(result[j].id);
    }

    document.getElementById("menu-count").textContent =
        "Showing " + result.length + " of " + menuItems.length + " items";
    document.getElementById("menu-empty").hidden = result.length !== 0;

    updateCategoryButtons();
    saveData("menuFilters", {
        query: searchInput.value.trim(),
        category: currentCategory,
        sort: sortSelect.value,
        results: ids
    });
}

// ---------- recent searches ----------
function showRecentSearches() {
    var list = loadData("recentSearches", []);
    var box = document.getElementById("recent-box");
    var holder = document.getElementById("recent-list");

    holder.innerHTML = "";
    box.hidden = list.length === 0;

    for (var i = 0; i < list.length; i++) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip chip-small";
        chip.textContent = list[i];
        chip.addEventListener("click", function () {
            searchInput.value = this.textContent;
            filterMenu();
        });
        holder.appendChild(chip);
    }
}

function addRecentSearch(text) {
    text = text.trim();
    if (text === "") {
        return;
    }
    var list = loadData("recentSearches", []);
    var index = list.indexOf(text);
    if (index !== -1) {
        list.splice(index, 1);
    }
    list.unshift(text);
    if (list.length > 5) {
        list.pop();
    }
    saveData("recentSearches", list);
    showRecentSearches();
}

// used by the coffee guide: "Find on our menu" button
function searchMenuFor(text) {
    searchInput.value = text;
    currentCategory = "all";
    filterMenu();
    addRecentSearch(text);
    document.getElementById("menu-top").scrollIntoView({ behavior: "smooth" });
}

// a link like menu.html?q=iced starts a search (used by the weather card on the home page)
function applySearchFromLink() {
    var word = "";
    try {
        word = new URLSearchParams(window.location.search).get("q") || "";
    } catch (error) {
        return;
    }
    word = word.trim().slice(0, 40);
    if (word === "") {
        return;
    }
    searchInput.value = word;
    currentCategory = "all";
    addRecentSearch(word);
}

function setupMenuPage() {
    menuGrid = document.getElementById("menu-grid");
    searchInput = document.getElementById("menu-search");
    sortSelect = document.getElementById("menu-sort");

    loadSavedFilters();
    showRecentSearches();
    applySearchFromLink();
    filterMenu();

    // search while typing
    searchInput.addEventListener("input", filterMenu);
    // save the word in the history when the user presses Enter or leaves the field
    searchInput.addEventListener("change", function () {
        addRecentSearch(searchInput.value);
    });
    document.getElementById("menu-search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        addRecentSearch(searchInput.value);
    });

    sortSelect.addEventListener("change", filterMenu);

    var buttons = document.querySelectorAll("#category-buttons .chip");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            currentCategory = this.dataset.category;
            filterMenu();
        });
    }

    document.getElementById("reset-filters-btn").addEventListener("click", function () {
        searchInput.value = "";
        sortSelect.value = "default";
        currentCategory = "all";
        filterMenu();
    });

    document.getElementById("clear-history-btn").addEventListener("click", function () {
        removeData("recentSearches");
        showRecentSearches();
    });
}

document.addEventListener("DOMContentLoaded", setupMenuPage);
