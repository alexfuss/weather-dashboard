// Store the value of the input
let city = $("#searchTerm").val();

// Add link to API key
const apiKey = "&appid=cbe411711c90894d5d0200ae3a6a03f6";

let date = new Date();

$("searchTerm").keypress(function(event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        $("#searchButton").click();
    }
});

// Create an event for the search button
$("#searchButton").on("click", function() {

    // Change the class to allow the module for the forecast to show
    $("#headingForecast").addClass("show");

    // Grab the input value from the user
    city = $("#searchTerm").val();

    // Make sure the input box is cleared out
    $("#searchTerm").val("");

    // Call the full URL for the weather API
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        console.log(response.name);
        console.log(response.weather[0].icon);

        let tempFa = (response.main.temp - 273.15) * 1.80 + 32;
        console.log(Math.floor(tempFa))


        console.log(response.main.humidity)
        console.log(response.wind.speed)

        // Functions defined lated below
        weatherCondition(response);
        weatherForecast(response);
        createDash();
    })
});

// Function to create the actual list of items for the dashboard
function createDash() {
    let listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
}

// Function to get the current weather conditions
function weatherCondition(response) {

    let tempFa = (response.main.temp - 273.15) * 1.80 + 32;
    tempFa = Math.floor(tempFa);

    $("#chosenCity").empty();

    // Create the content
    const card = $("<div>").addClass("card card-main");
    const cardBody = $("<div>").addClass("card-body");
    const city = $("<h4>").addClass("card-title").text(response.name);
    const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString("en-US"));
    const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempFa + "F");
    const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

    // Add the content to the page
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#chosenCity").append(card)

}

// Function to get the current weather forecast
function weatherForecast() {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
        method: "GET"
    }).then(function(response) {
        console.log(response);

        $("#forecast").empty();

        let results = response.list;

        // Loop to portray a start and end date
        for (var i = 0; i < results.length; i++) {

            let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
            let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
            console.log(day);
            console.log(hour);
      

            if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                let temp = (results[i].main.temp - 273.15) * 1.80 +32;
                let tempFa = Math.floor(temp);

                const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white card-forecast");
                const cardBody = $("<div>").addClass("card-body p-3 forecastBody");
                const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString("en-US"));
                const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempFa + "F");
                const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

                const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png");

                cardBody.append(cityDate, image, temperature, humidity);
                card.append(cardBody);
                $("#forecast").append(card);
            }
        }

    });
}