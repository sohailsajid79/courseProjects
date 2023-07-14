let ctry;
let map;
$.getJSON("./src/countryBorders.geo.json", function (jsonData) {
  //console.log(jsonData);
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
        // for (let i = 0; i <= response.data.length; i++) {
        //   ctry.push(response.data[i]);
        // }
        // //console.log(countries);
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

        // countries = Object.entries(countries);

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
  // getCountryCode_Name();

  // Fetching geolocation and initializing the map
  function showPosition(pos) {
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;
    let isoCode;

    // Function to handle the coordinates
    function coord(pos) {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;
      setTimeout(function () {
        $("#worldmap").fadeOut(3000, function () {
          $(this).replaceWith('<div id="map1"></div>');
          $("#menu-navbar").css("display", "inline-flex");
          mapInitiate(lat, lon);
          // let country_code = geoplugin_countryCode();
          const country_code = isoCode;
          showCountryOnLoad(lat, lon, country_code);
        });
        setTimeout(function () {
          $("#nav-container").show();
        }, 3000);
      }, 3000);
    }

    function showCountryOnLoad(country_code) {
      $.each(country_icons, function (key, item) {
        //country_icons is from Leafet.CountrySelect.js file to get the country code
        if (
          country_code.toString().toLowerCase() == item.toString().toLowerCase()
        ) {
          $("#country-select-box").selectpicker("val", key).change();
        }
      });
    }

    // AJAX request to get lat & lon
    $.ajax({
      url: "../Server/getLatLon.php",
      data: {
        lat: lat,
        lon: lon,
        username: "sajid79",
      },
      type: "GET",
      dataType: "JSON",
      success: function (response) {
        const isoCode = response.countryCode;
        $("#country-select-box").val(isoCode).change();
        initialise(lat, lon, isoCode);
        const country_code = isoCode;
        mapInitiate(lat, lon); // Call the mapInitiate function with lat and lon
        showCountryOnLoad(country_code); // Call the showCountryOnLoad function with the country code
      },
    });

    coord(pos); // Call the coord function with the position
  }

  if (navigator.geolocation) {
    // Fetch geolocation and show the map with the user's location
    navigator.geolocation.getCurrentPosition(showPosition);
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

    // Center the text to the left
    const labels = container.getElementsByTagName("label");
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];
      label.style.textAlign = "left";
    }

    // get Country Holidays
    $(document).on("change", "#country-select-box", function (event) {
      $("#addHolidays").html("");
      let country_name = $("#country-select-box").val();
      if (country_name == "") {
        alert("please select the country");
      }
      let country_code = country_icons[country_name];
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
      let table = "";
      $.ajax(settings).done(function (result) {
        if (result.meta.code == 200) {
          $.each(result.response.holidays, function (ket, item) {
            day = item.date.datetime.day;
            month = item.date.datetime.month;
            new_date = moment(month + " " + day).format("Do MMMM");
            table = `<tr>
                          <td><i class="fas fa-calendar-alt"></i></td>
                          <td>${item.name}</td>
                          <td>${new_date}</td>
                      `;
            $("#addHolidays").append(table);
          });
        } else {
          console.error("Failed to fetch country holidays.");
        }
      });
    });

    // get Weather
    $(document).on("change", "#country-select-box", function (event) {
      let country_name = $("#country-select-box").val();
      if (country_name == "") {
        alert("Please select the country");
      } else {
        let country_code = country_icons[country_name];
        let data = {
          country_code: country_code,
          country_name: country_name,
        };
        let settings = {
          dataType: "json",
          url: "../Server/getWeather.php",
          method: "GET",
          data: data,
        };
        $.ajax(settings).done(function (result) {
          let theDate = new Date(result.data.dt * 1000);
          let dateString = theDate.toGMTString();
          let converted = result.data.main.feels_like - 273.15;
          $("#date_time").text(dateString);
          $("#mood").text(Math.round(converted) + "℃");
          $("#humidity").text(result.data.main.humidity + "%");
          $("#visibility").text(result.data.visibility / 1000 + " KM");
          $("#wind_speed").text(result.data.wind.speed + " meter/sec");
        });
      }
    });

    // get Tweets
    $(document).on("change", "#country-select-box", function () {
      let country_name = $("#country-select-box").val();
      if (country_name === "") {
        alert("Please select the country");
        return;
      }
      let country_code = [country_name];
      let data = {
        country_code: country_code,
        country_name: country_name,
      };
      let settings = {
        dataType: "json",
        url: "../Server/getTweets.php",
        method: "GET",
        data: data,
      };

      function fetchAndRenderTweets() {
        $.ajax(settings).done(function (result) {
          let tweets = result.globalObjects.tweets;

          // Reverse the order of tweets
          let reversedTweets = Object.values(tweets).reverse();

          let tbody = "";
          $.each(reversedTweets, function (key, item) {
            let theDate = new Date(item.created_at);
            let formattedDate =
              numeral(theDate.getDate()).format("0o") +
              " " +
              theDate.toLocaleString("default", { month: "short" }) +
              " '" +
              numeral(theDate.getFullYear()).format("00");
            let formattedTime =
              theDate.getHours() +
              ":" +
              numeral(theDate.getMinutes()).format("00");

            tbody += `<tr>
                <td>${formattedTime} ${formattedDate}</td>
                <td>${item.user_id}</td>
                <td>${item.full_text}</td>
                <td><a href='${
                  item.entities.media != undefined
                    ? item.entities.media[0].expanded_url
                    : ""
                }' target="_blank">Link</a></td>
              </tr>`;
          });
          $("#addTweets").html(tbody);
        });
      }

      // Initial fetch and render
      fetchAndRenderTweets();

      // Periodically fetch and render tweets every 24 hours
      setInterval(fetchAndRenderTweets, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    });

    // get Exchange Rate
    $.ajax({
      url: "../Server/getExchangeRate.php",
      method: "GET",
      success: function (data) {
        if (data.result === "success") {
          let baseCurrency = data.base_code;
          let exchangeRates = data.conversion_rates;

          console.log("Base Currency:", baseCurrency);
          console.log("Exchange Rates:");

          for (let currency in exchangeRates) {
            console.log(currency + ":", exchangeRates[currency]);
          }

          // Set base currency label
          $("#fromCountry").text("From " + baseCurrency);

          // Populate currency dropdown list
          let currencySelect = $("#country-select-box");
          currencySelect.empty();
          for (let currency in exchangeRates) {
            currencySelect.append(
              $("<option>", {
                value: currency,
                text: currency,
              })
            );
          }

          // Handle currency selection change
          currencySelect.on("change", function () {
            let quoteCurrency = $(this).val();
            let amount = $("#fromAmount").val();

            // Make API call to get converted amount
            $.ajax({
              url: "../Server/getExchangeRate.php",
              method: "GET",
              data: {
                quoteCurrency: quoteCurrency,
                amount: amount,
              },
              success: function (data) {
                if (data.result === "success") {
                  let fromCurrency = data.base_code;
                  let toCurrency = data.target_code;
                  let convertedAmount = data.conversion_result;

                  $("#toCountry").text("Convert to " + toCurrency);
                  $("#toAmount").val(convertedAmount);
                } else {
                  console.error("API request failed:", data.error);
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed. Status:", textStatus);
              },
            });
          });

          // Handle amount input change
          $("#fromAmount").on("keyup change", function () {
            let quoteCurrency = $("#country-select-box").val();
            let amount = $(this).val();

            // Make API call to get converted amount
            $.ajax({
              url: "../Server/getExchangeRate.php",
              method: "GET",
              data: {
                quoteCurrency: quoteCurrency,
                amount: amount,
              },
              success: function (data) {
                if (data.result === "success") {
                  let fromCurrency = data.base_code;
                  let toCurrency = data.target_code;
                  let convertedAmount = data.conversion_result;

                  $("#toCountry").text("Convert to " + toCurrency);
                  $("#toAmount").val(convertedAmount);
                } else {
                  console.error("API request failed:", data.error);
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.error("Request failed. Status:", textStatus);
              },
            });
          });
        } else {
          console.error("API request failed:", data.error);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Request failed. Status:", textStatus);
      },
    });

    // Reformating Current Time, Sunrise, and Sunset using numeral.js
    function formatDateTime(dateTime) {
      let theDate = new Date(dateTime);
      let formattedDate =
        numeral(theDate.getDate()).format("0o") +
        " " +
        theDate.toLocaleString("default", { month: "short" }) +
        " '" +
        numeral(theDate.getFullYear()).format("00");
      let formattedTime =
        theDate.getHours() + ":" + numeral(theDate.getMinutes()).format("00");
      return formattedTime + " " + formattedDate;
    }

    //get CountryInfo
    $(document).on("change", "#country-select-box", function (event) {
      let country_name = $("#country-select-box").val();
      if (country_name == "") {
        alert("Please select the country");
      } else {
        let country_code = country_icons[country_name];

        // Get Rest Country Info
        let restCountrySettings = {
          dataType: "json",
          url: "../Server/getRestCountryInfo.php",
          method: "GET",
          data: {
            country_code: country_code,
            country_name: country_name,
          },
        };

        // Get Country Info
        let countryInfoSettings = {
          dataType: "json",
          url: "../Server/getCountryInfo.php",
          method: "GET",
          data: {
            country_code: country_code,
            country_name: country_name,
          },
        };

        // Execute both AJAX requests simultaneously
        Promise.all([$.ajax(restCountrySettings), $.ajax(countryInfoSettings)])
          .then(function (results) {
            // Process results of the first AJAX request for Rest Country Info
            let restCountryResult = results[0];
            if (restCountryResult.status === "success") {
              let restCountryData = restCountryResult.data;
              $("#subregion").text(restCountryData.subregion);
              $("#population").text(restCountryData.population);
              $("#capital").text(restCountryData.capital);
            } else {
              console.error("Failed to fetch Rest Country information.");
            }

            // Process results of the second AJAX request for Country Info
            let countryInfoResult = results[1];
            if (countryInfoResult.status === "success") {
              let countryInfoData = countryInfoResult.data;
              $("#timezone").text(countryInfoData.timezoneId);
              $("#utcOffset").text(countryInfoData.utcOffset);
              $("#currentTime").text(
                formatDateTime(countryInfoData.currentTime)
              );
              $("#sunrise").text(formatDateTime(countryInfoData.sunrise));
              $("#sunset").text(formatDateTime(countryInfoData.sunset));
            } else {
              console.error("Failed to fetch Country information.");
            }

            // AJAX request for getting news articles
            $.ajax({
              url: "../Server/getNews.php",
              method: "GET",
              data: {
                countryCode: country_code,
              },
              dataType: "json",
              success: function (response) {
                if (response.articles.length > 0) {
                  let articles = response.articles;
                  let newsArticleContainer = $(".card");

                  for (let i = 0; i < articles.length; i++) {
                    let article = articles[i];
                    let title = article.title;
                    let description = article.description;
                    let publishedAt = article.publishedAt;
                    let url = article.url;
                    let image = article.image;

                    // Create HTML elements for the article information
                    let articleHTML = `
                      <div class="card-body">
                        <h3 class="card-title">${title}</h3>
                        <p class="card-description">${description}</p>
                      </div>
                      <div class="card-footer py-3">
                        <div class="card-footer__info row justify-content-between">
                          <span class="col-auto articleDate">${publishedAt}</span>
                          <span class="col-auto read-more">
                            <a class="text-uppercase read-more-3" href="${url}">Read more</a>
                          </span>
                        </div>
                      </div>
                    `;

                    // Append the article HTML to the news article container
                    newsArticleContainer.append(articleHTML);

                    // Set the article image
                    $(".card-image img").attr("src", image);
                  }
                } else {
                  console.log("No news articles found.");
                }
              },
              error: function (xhr, status, error) {
                console.log("Error:", error);
              },
            });
          })
          .catch(function (error) {
            console.log("Error:", error);
          });
      }
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

    // tweetModal
    L.easyButton(
      '<i class="fa fa-twitter" aria-hidden="true" style="color: #1DA1F2"></i>',
      function () {
        $("#tweetModal").modal("show");
      },
      "Show Tweet"
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
      '<i class="fa fa-umbrella" aria-hidden="true" style="color: #8c8c0b"></i>',
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

    // 3d Globe minimap for leaflet
    const miniMap = new L.Control.GlobeMiniMap({
      position: "bottomright",
      land: "#AAD1AC",
      water: "#9DDBFF",
      marker: "#FF6400",
      topojsonSrc: "./src/world.json",
    }).addTo(map);

    // Tracking GPS Position
    const options = {
      position: "topleft",
      flyTo: true,
      strings: {
        title: "Your Location",
      },
    };

    // get Location Modal
    const locationControl = L.control.locate(options).addTo(map);

    // Calling the function to populate the dropdown list
    getCountryCode_Name();

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
          '<select id="country-select-box" class="selectpicker" data-live-search="true" title="Select a country"></select>';
        L.DomEvent.disableClickPropagation(this._div);
        return this._div;
      };

      select.addTo(map);

      // Call the function to fetch country code and name
      getCountryCode_Name();
    }
  };

  $(document).on("change", "#country-select-box", function () {
    let country = $(this).val();

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
    // map.fitBounds(polygons.getBounds());
    window.addLayers(polygons);
  });
});
