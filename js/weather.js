// weather.js - "Drink of the day" card on the home page (external API #2).
// Data comes from the free Open-Meteo service (no API key needed):
//   https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45&current=temperature_2m,weather_code
// The current temperature in Astana decides which drinks we suggest.
// The last answer is saved in localStorage ("weather"), so the card still works offline.

var WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=51.18&longitude=71.45" +
    "&current=temperature_2m,weather_code&timezone=Asia%2FAlmaty";

// weather codes of Open-Meteo -> short text
function describeWeather(code) {
    if (code === 0) { return "Clear sky"; }
    if (code <= 3) { return "Partly cloudy"; }
    if (code === 45 || code === 48) { return "Fog"; }
    if (code >= 51 && code <= 57) { return "Drizzle"; }
    if (code >= 61 && code <= 67) { return "Rain"; }
    if (code >= 71 && code <= 77) { return "Snow"; }
    if (code >= 80 && code <= 82) { return "Rain showers"; }
    if (code === 85 || code === 86) { return "Snow showers"; }
    if (code >= 95) { return "Thunderstorm"; }
    return "Changing weather";
}

// chooses the advice and the search words for the menu page
function getDrinkAdvice(temperature) {
    if (temperature >= 20) {
        return { text: "It is warm outside. Something cold and refreshing fits well.", searches: ["iced", "matcha"] };
    }
    if (temperature >= 8) {
        return { text: "A mild day. A classic coffee is a good choice.", searches: ["latte", "cappuccino"] };
    }
    return { text: "It is cold outside. Warm up with a hot drink and a pastry.", searches: ["espresso", "tea", "cinnamon"] };
}

function showWeather(data, noteStart) {
    var temperature = Math.round(data.temperature);
    var advice = getDrinkAdvice(temperature);
    var links = document.getElementById("weather-links");

    document.getElementById("weather-temp").textContent = temperature + " \u00B0C";
    document.getElementById("weather-desc").textContent = describeWeather(data.code);
    document.getElementById("weather-tip").textContent = advice.text;
    document.getElementById("weather-status").textContent = noteStart;
    document.getElementById("weather-retry-btn").hidden = noteStart === "Updated just now.";

    links.innerHTML = "";
    for (var i = 0; i < advice.searches.length; i++) {
        var link = document.createElement("a");
        link.className = "btn btn-outline-primary btn-sm";
        link.href = "menu.html?q=" + encodeURIComponent(advice.searches[i]);
        link.textContent = "See \"" + advice.searches[i] + "\" on the menu";
        links.appendChild(link);
    }
}

function loadWeather() {
    var status = document.getElementById("weather-status");
    var retry = document.getElementById("weather-retry-btn");
    retry.hidden = true;
    status.textContent = "Loading the weather...";

    fetch(WEATHER_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Server answered with status " + response.status);
            }
            return response.json();
        })
        .then(function (result) {
            if (!result.current || typeof result.current.temperature_2m !== "number") {
                throw new Error("Unexpected answer from the weather service");
            }
            var data = { temperature: result.current.temperature_2m, code: result.current.weather_code };
            saveData("weather", data);
            showWeather(data, "Updated just now.");
        })
        .catch(function (error) {
            console.log(error);
            var saved = loadData("weather", null);
            if (saved !== null && typeof saved.temperature === "number") {
                showWeather(saved, "No connection. Showing the last saved weather.");
            } else {
                document.getElementById("weather-temp").textContent = "--";
                document.getElementById("weather-desc").textContent = "";
                status.textContent = "Could not load the weather. Check your internet connection and try again.";
                retry.hidden = false;
            }
        });
}

document.addEventListener("DOMContentLoaded", function () {
    var retryButton = document.getElementById("weather-retry-btn");
    if (!retryButton) {
        return;
    }
    retryButton.addEventListener("click", loadWeather);
    loadWeather();
});
