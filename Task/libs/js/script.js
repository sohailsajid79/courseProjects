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
  const countryCode = $("#selCountry").val();
  let lat, lng;

  if (countryCode === "Austria") {
    lat = "47.01";
    lng = "10.2";
  } else if (countryCode === "Italy") {
    lat = "46";
    lng = "10";
  } else if (countryCode === "SaudiArabia") {
    lat = "23";
    lng = "46";
  }

  if (lat && lng) {
    $.ajax({
      url: "libs/php/timezone.php",
      type: "GET",
      dataType: "json",
      data: { lat: lat, lng: lng },

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
  } else {
    console.log("Latitude and longitude values are not set");
  }
});

//GET Weather & Observation:
$("#wxBtn").click(function () {
  let north = $("#North").val();
  let south = $("#South").val();
  let east = $("#East").val();
  let west = $("#West").val();

  $.ajax({
    url: "libs/php/weather.php",
    type: "GET",
    dataType: "json",
    data: {
      north: north,
      south: south,
      east: east,
      west: west,
    },

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
