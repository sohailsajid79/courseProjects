<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$lat = $_GET['lat'];
$lon = $_GET['lon'];
$username = $_GET['username'];
$url = file_get_contents("http://api.geonames.org/countryCode?lat=$lat&lng=$lon&username=$username");

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($curl);
if ($result === false) {
    echo "cURL Error: " . curl_error($curl);
    // Handle the error accordingly
} else {
    $data = json_decode($result, true);
    $country = $data['geonames'][0]['countryName'];
    $isoCode = $data['geonames'][0]['countryCode'];
}

curl_close($curl);
$response = array('countryCode' => $isoCode, 'countryName' => $country);

echo json_encode($response);
?>
