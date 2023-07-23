<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$lat = $_GET['lat'];
$lon = $_GET['lon'];
$username = $_GET['username'];
$url = file_get_contents("http://api.geonames.org/countryCode?lat=$lat&lng=$lon&username=$username");

if ($url === false) {
    echo "Failed to fetch data.";
} else {
    echo $url;
}

?>