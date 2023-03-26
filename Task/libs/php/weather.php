<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// weather API 
$url = 'http://api.geonames.org/weatherJSON?formatted=true&north=44.1&south=-9.9&east=-22.4&west=55.2&username=sajid79&style=full';

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


