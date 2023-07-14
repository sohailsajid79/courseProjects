<?php
$country_code = $_GET['country_code'];
$data = file_get_contents("https://restcountries.com/v3.1/alpha/$country_code");

header('Content-Type: application/json; charset=UTF-8');

$countryData = json_decode($data, true);
if ($countryData) {
  $subregion = $countryData['subregion'];
  $population = $countryData['population'];
  $capital = $countryData['capital'];

  $response = [
    'subregion' => $subregion,
    'population' => $population,
    'capital' => $capital
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
