let ctry;
let map;
let first_time_country_name = 0;
let navigation_country_name;

$.getJSON("./src/countryBorders.geo.json", function (jsonData) {
  ctry = jsonData;
});

$(document).ready(function () {
  $("#nav-container").hide();

  // AJAX request to get the country code and name
  function getCountryCode_Name() {
    $.ajax({
      url: "../Server/getCountryCode.php",
      method: "GET",
      dataType: "JSON",
      success: function (response) {
        const countries = response.data;
        const countrySelectBox = $("#country-select-box");
        // Clear the existing options
        countrySelectBox.empty();
        // Add the initial empty option
        countrySelectBox.append('<option value=""></option>');

        $.each(countries, function (index, country) {
          const option = createOptionElement(country.name, country.code);
          countrySelectBox.append(option);
        });

        // Refresh the selectpicker after adding options
        countrySelectBox.selectpicker("refresh");
      },
      error: function () {
        console.error("Error fetching country data");
      },
    });
  }

  // Create option element
  function createOptionElement(name, code) {
    const option = $("<option>");
    option.val(code);
    option.html(name);
    return option;
  }

  // Call the function to fetch and populate country data
  getCountryCode_Name();
  getGeoLocation();

  function getGeoLocation() {
    if (navigator.geolocation) {
      // Fetch geolocation and show the map with the user's location
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      map = L.map("map1").fitWorld();
    }
  }

  // Fetching geolocation and initializing the map
  function showPosition(pos) {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let isoCode;

    // Function to handle the coordinates
    function coord(pos) {
      setTimeout(function () {
        $("#worldmap").fadeOut(3000, function () {
          $(this).replaceWith('<div id="map1"></div>');
          $("#menu-navbar").css("display", "inline-flex");
          mapInitiate(lat, lon);
          showCountryOnLoad(isoCode);
          $("#country-select-box").val(isoCode).change();
        });
        setTimeout(function () {
          $("#nav-container").show();
        }, 3000);
      });
    }

    function showCountryOnLoad(country_code) {
      $.each(country_icons, function (key, item) {
        if (country_code.toLowerCase() == item.toLowerCase()) {
          $("#country-select-box").selectpicker("val", key).change();
        }
      });
    }

    // AJAX request to get countryCode
    $.ajax({
      url: "../Server/getLatLon.php",
      data: {
        lat: lat,
        lon: lon,
        username: "sajid79",
      },
      type: "GET",
      success: function (data) {
        isoCode = data.replace(/(\r\n|\n|\r)/gm, "");
        navigation_country_name = isoCode;
        //console.log(isoCode);
        coord(pos); // Call the coord function with the position
      },
      error: function (e) {
        console.log(e.message);
      },
    });
  }

  const mapInitiate = (lat, lon) => {
    // Map initialisation and configuration
    const map = L.map("map1").setView([lat, lon], 3);
    const defaultMap = L.tileLayer(
      "https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=aHphYXDNuNflWVD8pVJ6MOniqzyDItliVum1XRNSwsPViql22lcjbOr9kBu1Y1nN",
      {
        attribution:
          '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: "abcd",
        accessToken:
          "aHphYXDNuNflWVD8pVJ6MOniqzyDItliVum1XRNSwsPViql22lcjbOr9kBu1Y1nN",
      }
    );

    defaultMap.addTo(map);

    // Layers
    const EarthAtNight2012 = L.tileLayer(
      "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}",
      {
        attribution:
          'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975],
        ],
        minZoom: 1,
        maxZoom: 8,
        format: "jpg",
        time: "",
        tilematrixset: "GoogleMapsCompatible_Level",
      }
    );

    const NatGeoWorldMap = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
        maxZoom: 16,
      }
    );

    const USImageryTopo = L.tileLayer(
      "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 20,
        attribution:
          'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
      }
    );

    // Leafet layer control
    const baseMaps = {
      Default: defaultMap,
      Night: EarthAtNight2012,
      Geo: NatGeoWorldMap,
      Satellite: USImageryTopo,
    };

    const layerControl = L.control.layers(baseMaps);
    layerControl.addTo(map);

    // Move radio buttons to the left
    const container = layerControl.getContainer();
    const inputs = container.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      input.style.float = "left";
      input.style.marginRight = "5px";
    }

    // get Country Holidays
    $(document).on("change", "#country-select-box", function (event) {
      $("#addHolidays").html("");
      let country_code = $("#country-select-box").val();
      if (country_code == "") {
        alert("Please select the country");
      } else {
        let data = {
          url: "https://calendarific.com/api/v2/holidays",
          country_code: country_code,
          data_type: "holiday",
        };
        let settings = {
          dataType: "json",
          url: "../Server/getCountryHolidays.php",
          method: "POST",
          data: data,
        };
        $.ajax(settings)
          .done(function (result) {
            if (result.meta && result.meta.code == 200) {
              $.each(result.response.holidays, function (key, item) {
                day = item.date.datetime.day;
                month = item.date.datetime.month;
                new_date = moment(month + " " + day).format("Do MMMM");
                table = `<tr>
                            <td class="text-left"><i class="fas fa-calendar-alt"></i></td>
                            <td class="text-left">${item.name}</td>
                            <td class="text-left">${new_date}</td>
                          </tr>`;
                $("#addHolidays").append(table);
              });
            } else {
              console.error("Failed to fetch country holidays.");
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX request failed:", errorThrown);
          });
      }
    });

    // get Weather
    function getWeatherInfo(lat, lon) {
      if (lat === undefined || lon === undefined) {
        alert("Latitude and longitude are required.");
        return Promise.reject("Latitude and longitude are required.");
      }

      let data = {
        lat: lat,
        lon: lon,
      };

      let settings = {
        dataType: "json",
        url: "../Server/getWeather.php",
        method: "GET",
        data: data,
      };

      // Make the AJAX request and return a promise
      return new Promise((resolve, reject) => {
        $.ajax(settings)
          .done(function (result) {
            resolve(result);
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            // Handle the error by rejecting the promise with an error message
            reject("Failed to fetch weather data: " + errorThrown);
          });
      });
    }

    $(document).on("change", "#country-select-box", function (event) {
      let country_code = $("#country-select-box").val();
      if (country_code === "") {
        alert("Please select the country");
      } else {
        getCountryInfo(country_code)
          .then(({ lat, lng }) => {
            getWeatherInfo(lat, lng)
              .then((weatherData) => {
                // Update current weather elements in the modal with the retrieved data
                $(".weather-icon").html(
                  '<img src="' + weatherData.current.condition.icon + '">'
                );
                $(".temp-c").text(weatherData.current.temp_c + " °C");
                $(".temp-f").text(weatherData.current.temp_f + " °F");
                $(".condition").text(weatherData.current.condition.text);

                // Extract and append forecast data
                const forecastData = weatherData.forecast.forecastday;

                // Remove any existing forecast items
                $(".modal-body .forecast-item").remove();

                // Loop through the forecast data and append forecast items to the modal
                forecastData.forEach((forecastItem, index) => {
                  const date = new Date(forecastItem.date);
                  const dayOfWeek = date.toLocaleString("en-US", {
                    weekday: "long",
                  });
                  const dayOfMonth = date.toLocaleString("en-US", {
                    day: "numeric",
                  });
                  const month = date.toLocaleString("en-US", { month: "long" });
                  const formattedDate = `${dayOfWeek}, ${dayOfMonth}${getDaySuffix(
                    dayOfMonth
                  )} ${month}`;

                  const maxTempC = forecastItem.day.maxtemp_c;
                  const conditionText = forecastItem.day.condition.text;
                  const iconUrl = forecastItem.day.condition.icon;

                  // forecast item structure
                  const forecastItemHtml = `
                    <div class="forecast-item">
                      <div class="date">${formattedDate}</div>
                      <div class="forecast">
                        <i class="maxtemp_c">${maxTempC} °C</i>
                        <i class="text">${conditionText}</i>
                        <h6 class="condition weatherIcon"><img src="${iconUrl}"></h6>
                      </div>
                    </div>
                  `;

                  $(".weather-modal").append(forecastItemHtml);
                });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    // Function to get the day suffix (e.g., 1st, 2nd, 3rd, 4th, etc.)
    function getDaySuffix(day) {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    }

    // get Rest CountryInfo
    function getCountryInfo(country_code) {
      return new Promise((resolve, reject) => {
        if (country_code === "") {
          reject("Please select the country");
        } else {
          let restCountrySettings = {
            dataType: "json",
            url: "../Server/getRestCountryInfo.php",
            method: "GET",
            data: {
              country_code: country_code,
            },
          };

          // Make AJAX request to fetch Rest Country Info
          $.ajax(restCountrySettings)
            .done(function (restCountryResult) {
              if (restCountryResult.region) {
                $("#region").text(restCountryResult.region);
                $("#subregion").text(restCountryResult.subregion);
                $("#population").text(
                  numeral(restCountryResult.population).format("0,0")
                );
                $("#capital").text(restCountryResult.capital);
                $("#timezones").text(restCountryResult.timezones);
                $("#flag").html(
                  '<img src="' + restCountryResult.flags.png + '">'
                );

                let lat = restCountryResult.latitude;
                let lng = restCountryResult.longitude;

                let username = "sajid79";
                let timezoneUrl = `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${username}`;

                $.ajax({
                  url: timezoneUrl,
                  method: "GET",
                  dataType: "json",
                })
                  .done(function (timezoneResult) {
                    let sunrise = timezoneResult.sunrise.split(" ")[1];
                    let sunset = timezoneResult.sunset.split(" ")[1];

                    $("#sunrise").text(sunrise);
                    $("#sunset").text(sunset);

                    resolve({ lat, lng });
                  })
                  .fail(function (jqXHR, textStatus, errorThrown) {
                    reject("Failed to fetch timezone data: " + errorThrown);
                  });
              } else {
                reject("Failed to fetch Rest Country information.");
              }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              reject("Failed to fetch Rest Country Info: " + errorThrown);
            });
        }
      });
    }

    $(document).on("change", "#country-select-box", function (event) {
      let country_code = $("#country-select-box").val();
      if (country_code === "") {
        alert("Please select the country");
      } else {
        getCountryInfo(country_code)
          .then(({ lat, lng }) => {
            // global variables
            //console.log("Latitude:", lat);
            //console.log("Longitude:", lng);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    // get News
    $(document).on("change", "#country-select-box", function (event) {
      let country_code = $("#country-select-box").val();
      if (country_code === "") {
        alert("Please select the country");
      } else {
        let newsSettings = {
          dataType: "json",
          url: "../Server/getNews.php",
          method: "GET",
          data: {
            country_code: country_code,
          },
        };

        // Make AJAX request to fetch news
        $.ajax(newsSettings)
          .done(function (newsResponse) {
            console.log("News response:", newsResponse);
            if (
              newsResponse &&
              newsResponse.articles &&
              newsResponse.articles.length > 0
            ) {
              $(".newsArticles").empty(); // Clear existing articles
              const articles = newsResponse.articles;
              for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                const publishedDate = new Date(article.publishedAt);
                const options = {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                };
                const formattedDate = publishedDate.toLocaleDateString(
                  "en",
                  options
                );
                const articleHtml = `
                  <div class="card shadow-sm h-100">
                    <div class="card-image">
                      <div class="hover-text">
                        <img src="${article.image}" class="card-img-top" alt="...">
                      </div>
                      <div class="image-overlay"></div>
                    </div>
                    <div class="card-body">
                      <h3 class="card-title">${article.title}</h3>
                      <p class="card-description">${article.description}</p>
                    </div>
                    <div class="card-footer py-3">
                      <div class="card-footer__info row justify-content-between">
                        <span class="col-auto articleDate">${formattedDate}</span>
                        <span class="col-auto read-more">
                          <a class="text-uppercase read-more-3 articleURL" href="${article.url}" target="_blank">Read more</a>
                        </span>
                      </div>
                    </div>
                  </div>
                `;
                $(".newsArticles").append(`<tr><td>${articleHtml}</td></tr>`);
              }
            } else {
              console.error("Failed to fetch News or no articles found.");
            }
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            // console.error("Failed to fetch News:", errorThrown);
          });
      }
    });

    // get Exchange Rate
    $(document).on("change", "#country-select-box", function (event) {
      let selectedCountry = $("#country-select-box option:selected").text();
      $("#toCountry").text("To " + selectedCountry);

      setTimeout(() => {
        let amountval = $("#fromAmount").val();
        let ctry_iso_a2 = $("#country-select-box option:selected").val();
        let currency_code_obj = currency_codes.find(
          (crncy_code) => crncy_code.iso_a2 === ctry_iso_a2
        );
        let quoteCurrencyval = currency_code_obj.code;
        $("#toCountry").text("To " + currency_code_obj.name);
        //console.log(amountval);
        //console.log(quoteCurrencyval);

        // Make API call to get converted amount
        $.ajax({
          type: "GET",
          url: "../Server/getExchangeRate.php",
          data: {
            quoteCurrency: quoteCurrencyval,
            amount: amountval,
          },
          success: function (data) {
            //console.log(data);
            $("#toAmount").val(data);
          },
          error: function (e) {
            console.log(e.message);
          },
        });
      }, 2000);
    });

    // Select from search dropdown list
    addCountrySearch(map); // adds the country search box for polygons

    // Control Buttons
    // countryInfoModal
    L.easyButton(
      '<i class="fa fa-flag" aria-hidden="true" style="color: #FF6400"></i>',
      function () {
        $("#countryInfoModal").modal("show");
      },
      "Show countryInfo"
    ).addTo(map);

    // newsModal
    L.easyButton(
      '<i class="fa fa-newspaper-o" aria-hidden="true" style="color: #5721b5"></i>',
      function () {
        $("#newsModal").modal("show");
      },
      "Show countryNew"
    ).addTo(map);

    // holidaysModal
    L.easyButton(
      '<i class="fa fa-calendar" aria-hidden="true" style="color: #9DDBFF"></i>',
      function () {
        $("#holidaysModal").modal("show");
      },
      "Show holidays"
    ).addTo(map);

    // weatherModal
    L.easyButton(
      '<i class="fa fa-umbrella" aria-hidden="true" style="color: #8c837d"></i>',
      function () {
        $("#weatherModal").modal("show");
      },
      "Show Weather"
    ).addTo(map);

    // currencyModal
    L.easyButton(
      '<i class="fa fa-usd" aria-hidden="true" style="color: #04e090"></i>',
      function () {
        $("#currencyModal").modal("show");
      },
      "Show Exchange Rate"
    ).addTo(map);

    // Zoom back to default position
    L.easyButton(
      '<i class="fa fa-refresh" aria-hidden="true" style="color: #a006b8"></i>',
      function () {
        map.flyTo([51.505, -0.09], 3);
      }
    ).addTo(map);

    // Display coordinates of the map center
    L.control
      .mapCenterCoord({
        latlngFormat: "DMS",
        latlngDesignators: true,
        onMove: true,
      })
      .addTo(map);

    // // 3d Globe minimap for leaflet
    // const miniMap = new L.Control.GlobeMiniMap({
    //   position: "bottomright",
    //   land: "#AAD1AC",
    //   water: "#9DDBFF",
    //   marker: "#FF6400",
    //   topojsonSrc: "./src/world.json",
    // }).addTo(map);

    // Tracking GPS Position
    const options = {
      position: "topleft",
      flyTo: true,
      strings: {
        title: "",
      },
    };

    // get Location Modal
    const locationControl = L.control.locate(options).addTo(map);

    window.addLayers = function (countryBorders_jsonData) {
      let layer_data = localStorage.getItem("layer_id");
      map.eachLayer(function (layer) {
        if (layer._leaflet_id == layer_data) {
          map.removeLayer(layer);
        }
      });
      let layer_name = L.geoJSON(countryBorders_jsonData).addTo(map);
      map.fitBounds(layer_name.getBounds());
      localStorage.setItem("layer_id", layer_name._leaflet_id);
    };
    $("#country-select-box").css("display", "block");

    function addCountrySearch(map) {
      let select = L.control({ position: "topleft" });

      select.onAdd = function () {
        this._div = L.DomUtil.create("div", "country-select-box");
        this._div.innerHTML =
          '<select id="country-select-box" class="selectpicker" data-live-search="true" title="Select Country"></select>';
        L.DomEvent.disableClickPropagation(this._div);
        return this._div;
      };

      select.addTo(map);
    }
  };

  $(document).on("change", "#country-select-box", function () {
    let country;

    if (first_time_country_name == 0) {
      country = navigation_country_name;
    } else {
      country = $(this).val();
    }

    let formattedCountries = {};
    ctry.features.forEach((feature) => {
      const name = feature.properties.name;
      formattedCountries[name] = feature;
    });

    let countriesData = {};
    let formattedObject;
    for (let i = 0; i < ctry.features.length; i++) {
      let feature = ctry.features[i];

      // Create the formatted object
      if (feature.properties.iso_a2 == country) {
        formattedObject = {
          type: feature.type,
          id: feature.properties.iso_a3,
          properties: {
            name: feature.properties.name,
          },
          geometry: feature.geometry,
        };
      }
    }
    let polygons = formattedObject;
    polygons = polygons == undefined ? [] : polygons;
    window.addLayers(polygons);
    first_time_country_name = 1;
  });
});

function exchange_currency_func() {
  let amountval = $("#fromAmount").val();
  let ctry_iso_a2 = $("#country-select-box option:selected").val();
  var currency_code_obj = currency_codes.find(
    (crncy_code) => crncy_code.iso_a2 === ctry_iso_a2
  );
  let quoteCurrencyval = currency_code_obj.code;

  // Make API call to get converted amount
  $.ajax({
    type: "GET",
    url: "../Server/getExchangeRate.php",
    data: {
      quoteCurrency: quoteCurrencyval,
      amount: amountval,
    },
    success: function (data) {
      console.log(data);
      $("#toAmount").val(data);
    },
    error: function (e) {
      console.log(e.message);
    },
  });
}
