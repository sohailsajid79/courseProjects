// GET Wikipedia Search:
$("#btnWiki").click(function () {
  $.ajax({
    url: "libs/php/wikipediaSearch.php",
    type: "GET",
    dataType: "json",
    data: {
      city: $("#selCity").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      // .html("") will clear the existing result
      $("#results").html("");

      $.each(result, function (i, item) {
        $.each(item, function (index, val) {
          $("#results").append("Title: " + val.title + "<br/>");
          $("#results").append("Summary: " + val.summary + "<br/>");
          $("#results").append("Country Code: " + val.countryCode + "<br/>");
          $("#results").append("Wikipedia URL: " + val.wikipediaUrl + "<br/>");
        });
      });
    },
  });
});

// GET Timezone:
$("#tmzBtn").click(function () {
  $.ajax({
    url: "libs/php/timezone.php",
    type: "GET",
    dataType: "json",

    success: function (result) {
      console.log(JSON.stringify(result));
      // .html("") will clear the existing result
      $("#results").html("");

      if (typeof result === "string") {
        result = JSON.parse(result);
      }

      $("#results").append("Timezone: " + result.timezoneId + "<br/>");
      $("#results").append("GMT offset: " + result.gmtOffset + "<br/>");
      $("#results").append("Current Time: " + result.time + "<br/>");
      $("#results").append("Longitude: " + result.lng + "<br/>");
      $("#results").append("Latitude: " + result.lat + "<br/>");
      $("#results").append("Sunrise: " + result.sunrise + "<br/>");
      $("#results").append("Sunset: " + result.sunset + "<br/>");
    },
  });
});

//GET Weather & Observation:
$("#wxBtn").click(function () {
  $.ajax({
    url: "libs/php/weather.php",
    type: "GET",
    dataType: "json",

    success: function (result) {
      console.log(JSON.stringify(result));
      // .html("") will clear the existing result
      $("#results").html("");

      if (typeof result === "string") {
        result = JSON.parse(result);
      }

      $.each(result, function (i, item) {
        // console.log(item);
        $.each(item, function (index, val) {
          $("#results").append("<b>ICAO:</b> " + val.ICAO + "<br/>");
          $("#results").append(
            "<b>Station Name:</b> " + val.stationName + "<br/>"
          );

          $("#results").append("Date & Time: " + val.datetime + "<br/>");
          $("#results").append("Temperature: " + val.temperature + "<br/>");
          $("#results").append("humidity: " + val.humidity + "<br/>");
          $("#results").append("Wind Speed: " + val.windSpeed + "<br/>");
        });
      });
    },
  });
});
