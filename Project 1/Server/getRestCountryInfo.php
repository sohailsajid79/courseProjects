<?php
$country_code = $_GET['country_code'];
$data = file_get_contents("https://restcountries.com/v3.1/alpha/$country_code");

header('Content-Type: application/json; charset=UTF-8');

$countryData = json_decode($data, true);
if ($countryData) {
  $region = $countryData[0]['region'];
  $subregion = $countryData[0]['subregion'];
  $population = $countryData[0]['population'];
  $capital = $countryData[0]['capital'];
  $timezones = $countryData[0]['timezones'];
  $flags = $countryData[0]['flags'];
  
  // Get currency name and symbol
  // Get currency name and symbol
if (isset($countryData[0]['currencies']) && !empty($countryData[0]['currencies'])) {
  $currency = $countryData[0]['currencies'];
  $currencyKeys = array_keys($currency);
  $currencyCode = $currencyKeys[0];

  $currencyName = $currency[$currencyCode]['name'] ?? null;
  $currencySymbol = $currency[$currencyCode]['symbol'] ?? null;
} else {
  $currencyName = null;
  $currencySymbol = null;
}


  // Get latitude and longitude
  $latitude = $countryData[0]['latlng'][0];
  $longitude = $countryData[0]['latlng'][1];

  $response = [
    'region' => $region,
    'subregion' => $subregion,
    'population' => $population,
    'capital' => $capital,
    'timezones' => $timezones,
    'flags' => $flags,
    'currencyName' => $currencyName,
    'currencySymbol' => $currencySymbol,
    'latitude' => $latitude,
    'longitude' => $longitude
  ];

  echo json_encode($response);
} else {
  // Error handling if data cannot be retrieved or decoded
  $errorResponse = [
    'error' => 'Failed to fetch country information.'
  ];
  echo json_encode($errorResponse);
}
?>
