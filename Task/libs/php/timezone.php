<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$lat = $_GET['lat'];
$lng = $_GET['lng'];

// timezone API 
$url = "http://api.geonames.org/timezoneJSON?formatted=true&lat=$lat&lng=$lng&username=sajid79&style=full";

// Initialize Curl 
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);

curl_close($ch);
	
$decode = json_decode($result, true);
	
	header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($decode);


