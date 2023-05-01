const mapInitiate = () => {
  // Map
  const map = L.map("map1").setView([51.505, -0.09], 5);

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

  // Checkbox

  // Leaflet control to display the coordinates of the map center
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

  const locationControl = L.control.locate(options).addTo(map);

  // GEO JSON
  L.geoJSON(countryBorders).addTo(map);

  // Search Country
  L.CountrySelect.countryBorders = {};

  document.getElementById;
};

// preloadaer
function coord(pos) {
  let lat = pos.coords.latitude;
  let lng = pos.coords.longitude;
  setTimeout(function () {
    $("#worldmap").fadeOut(3000, function () {
      $(this).replaceWith('<div id="map1"></div>');
      mapInitiate(lat, lng);
    });
  }, 4000);
}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(coord);
}
L.Cou;
