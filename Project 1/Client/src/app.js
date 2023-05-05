$(document).ready(function () {
  const mapInitiate = () => {
    // Map
    const map = L.map("map1").setView([51.505, -0.09], 3);

    // Initialization
    const initialization = L.tileLayer(
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

    initialization.addTo(map);

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
      Default: initialization,
      Night: EarthAtNight2012,
      Geo: NatGeoWorldMap,
      Satellite: USImageryTopo,
    };

    L.control.layers(baseMaps).addTo(map);

    // geo JSON data & setting icon
    const markers = L.markerClusterGroup();
    const bankIcon = L.icon({
      iconUrl: "./src/icons/bank.png",
      iconSize: [43, 43],
    });

    const marker = L.geoJSON(centralBanks, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: bankIcon });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.bank);
      },
    });

    // Zoom back to default position

    // Marker Cluster
    markers.addLayer(marker);
    map.addLayer(markers);

    // Control Buttons with Icons and Callbacks
    L.easyButton(
      '<i class="fa fa-flag" aria-hidden="true" style="color: #FF6400"></i>',
      function () {
        $("#countryInfoModal").modal("show");
      },
      "Show countryInfo"
    ).addTo(map);

    L.easyButton(
      '<i class="fa fa-money" aria-hidden="true" style="color: #AAD1AC"></i>',
      function () {
        $("#economicsModal").modal("show");
      },
      "Show economics"
    ).addTo(map);

    L.easyButton(
      '<i class="fa fa-calendar" aria-hidden="true" style="color: #9DDBFF"></i>',
      function () {
        $("#holidaysModal").modal("show");
      },
      "Show holidays"
    ).addTo(map);

    L.easyButton(
      '<i class="fa fa-umbrella" aria-hidden="true" style="color: #8c8c0b"></i>',
      function () {
        $("#weatherModal").modal("show");
      },
      "Show Weather"
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

    // Plugin to show a rotating Compass
    const compass = map.addControl(new L.Control.Compass());

    // Tracking GPS Position
    const options = {
      position: "topleft",
      flyTo: true,
      strings: {
        title: "My Location",
      },
    };

    // Get location
    const locationControl = L.control.locate(options).addTo(map);

    // Select from search dropdown list
    addCountrySearch(map); // adds the country search box for polygions
    $("select.leaflet-countryselect").attr("data-live-search", "true");
    $("select.leaflet-countryselect").selectpicker();

    window.addLayers = function (geoJson_data) {
      let layer_data = localStorage.getItem("layer_id");
      map.eachLayer(function (layer) {
        if (layer._leaflet_id == layer_data) {
          map.removeLayer(layer);
        }
      });
      let layer_name = L.geoJSON(geoJson_data).addTo(map);
      map.fitBounds(layer_name.getBounds());
      localStorage.setItem("layer_id", layer_name._leaflet_id);
    };
    $(".country-search").css("display", "block");
  };

  function addCountrySearch(map) {
    var select = L.countrySelect({
      exclude: "French Southern and Antarctic Lands",
    });
    select.addTo(map);

    select.on("change", function (e) {
      if (e.feature === undefined) {
        //Do nothing on title
        return;
      }
      var country = L.geoJson(e.feature);
      if (this.previousCountry != null) {
        map.removeLayer(this.previousCountry);
      }
      this.previousCountry = country;

      map.addLayer(country);
      map.fitBounds(country.getBounds());
    });
  }

  // Preloader get browser's Geolocation API to obtain the user's current position
  function coord(pos) {
    let lat = pos.coords.latitude;
    let lng = pos.coords.longitude;
    setTimeout(function () {
      $("#worldmap").fadeOut(3000, function () {
        $(this).replaceWith('<div id="map1"></div>');
        $("#menu-navbar").css("display", "inline-flex");
        mapInitiate(lat, lng);
      });
    }, 3000);
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(coord);
  }

  $(document).on("change", "#country-select-box", function () {
    let country = $(this).val();
    let polygons = countries[country];
    polygons = polygons == undefined ? [] : polygons;
    window.addLayers(polygons);
  });
});
